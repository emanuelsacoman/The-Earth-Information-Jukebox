import { ExtractedFeature, PixelRegion, SonificationEvent } from './sonification.types';

export const EXTRACTION_VERSION = 'encoded-rgb-grid/v1';
export const MAPPING_VERSION = 'brightness-pentatonic/v1';
export const STEP_SECONDS = 0.24;

export interface DecodedPixels {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export interface ExtractionOptions {
  recordId: string;
  frameId: string;
  resourceVersion: string;
  roi: PixelRegion;
  columns?: number;
  rows?: number;
  sampleStride?: number;
  /** One entry per source pixel: zero excludes the pixel; nonzero accepts it. */
  mask?: Uint8Array;
  excludedRegions?: readonly PixelRegion[];
}

function isPositiveInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0;
}

function validateRegion(region: PixelRegion, width: number, height: number): void {
  if (!Number.isSafeInteger(region.x) || !Number.isSafeInteger(region.y)
    || region.x < 0 || region.y < 0
    || !isPositiveInteger(region.width) || !isPositiveInteger(region.height)
    || region.x + region.width > width || region.y + region.height > height) {
    throw new Error('The extraction region must use integer pixels within the image.');
  }
}

function contains(region: PixelRegion, x: number, y: number): boolean {
  return x >= region.x && x < region.x + region.width
    && y >= region.y && y < region.y + region.height;
}

/** A stable configuration fingerprint, not a security/integrity checksum. */
function maskFingerprint(mask: Uint8Array | undefined): string {
  if (!mask) return 'none';
  let value = 2166136261;
  for (const entry of mask) value = Math.imul(value ^ (entry === 0 ? 0 : 1), 16777619);
  return (value >>> 0).toString(16);
}

/**
 * Samples the encoded RGB image; it does not invert a physical radiance scale.
 * Cells advance top-to-bottom within each column, then left-to-right.
 * Only sampled, opaque/nonzero-alpha, unmasked pixels enter the cell mean.
 */
export function extractFeatures(pixels: DecodedPixels, options: ExtractionOptions): ExtractedFeature[] {
  const { width, height, data } = pixels;
  if (!isPositiveInteger(width) || !isPositiveInteger(height)
    || !Number.isSafeInteger(width * height * 4)
    || !(data instanceof Uint8ClampedArray) || data.length !== width * height * 4) {
    throw new Error('Invalid decoded pixels.');
  }
  const { roi, mask } = options;
  validateRegion(roi, width, height);
  const columns = options.columns ?? 24;
  const rows = options.rows ?? 8;
  const stride = options.sampleStride ?? 2;
  if (!isPositiveInteger(columns) || !isPositiveInteger(rows) || !isPositiveInteger(stride)
    || columns > roi.width || rows > roi.height) {
    throw new Error('Invalid grid or sample stride for this region.');
  }
  if (mask && (!(mask instanceof Uint8Array) || mask.length !== width * height)) {
    throw new Error('The mask must have one entry per image pixel.');
  }
  const excluded = options.excludedRegions ?? [];
  for (const region of excluded) validateRegion(region, width, height);
  for (const id of [options.recordId, options.frameId, options.resourceVersion]) {
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('Extraction requires source and version identifiers.');
    }
  }
  const parameters = JSON.stringify({
    width, height, roi, columns, rows, stride,
    mask: maskFingerprint(mask), excluded,
  });
  const method = `${EXTRACTION_VERSION}:${parameters}`;
  const identity = [options.recordId, options.frameId, options.resourceVersion, method]
    .map(value => encodeURIComponent(value)).join('/');
  const features: ExtractedFeature[] = [];
  for (let column = 0; column < columns; column++) {
    const x0 = roi.x + Math.floor(column * roi.width / columns);
    const x1 = roi.x + Math.floor((column + 1) * roi.width / columns);
    for (let row = 0; row < rows; row++) {
      const y0 = roi.y + Math.floor(row * roi.height / rows);
      const y1 = roi.y + Math.floor((row + 1) * roi.height / rows);
      let sum = 0;
      let count = 0;
      let masked = 0;
      let sampled = 0;
      for (let y = y0; y < y1; y += stride) {
        for (let x = x0; x < x1; x += stride) {
          sampled++;
          const pixelIndex = y * width + x;
          if ((mask && mask[pixelIndex] === 0) || excluded.some(region => contains(region, x, y))) {
            masked++;
            continue;
          }
          const channel = pixelIndex * 4;
          if (data[channel + 3] === 0) continue;
          sum += 0.2126 * data[channel] + 0.7152 * data[channel + 1] + 0.0722 * data[channel + 2];
          count++;
        }
      }
      const rawValue = count > 0 ? Math.min(255, Math.max(0, sum / count)) : null;
      const index = column * rows + row;
      features.push({
        id: `${identity}/cell-${index}`,
        recordId: options.recordId,
        frameId: options.frameId,
        resourceVersion: options.resourceVersion,
        index,
        kind: 'relative-image-brightness',
        domain: 'visual-pixel',
        rawValue,
        normalizedValue: rawValue === null ? null : rawValue / 255,
        validity: count > 0 ? 'valid' : masked === sampled ? 'masked' : 'missing',
        extent: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 },
        position: { x: (x0 + x1) / (2 * width), y: (y0 + y1) / (2 * height) },
        extractionMethod: method,
      });
    }
  }
  return features;
}

const MIDI_NOTES = [48, 50, 52, 55, 57, 60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84] as const;
const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'] as const;

function validFeature(feature: ExtractedFeature): boolean {
  return feature.validity === 'valid' && feature.kind === 'relative-image-brightness'
    && feature.domain === 'visual-pixel'
    && feature.normalizedValue !== null && Number.isFinite(feature.normalizedValue)
    && feature.normalizedValue >= 0 && feature.normalizedValue <= 1
    && feature.rawValue !== null && Number.isFinite(feature.rawValue)
    && feature.rawValue >= 0 && feature.rawValue <= 255
    && Number.isSafeInteger(feature.index) && feature.index >= 0
    && Number.isFinite(feature.index * STEP_SECONDS)
    && Number.isFinite(feature.position.x) && feature.position.x >= 0 && feature.position.x <= 1
    && Number.isFinite(feature.position.y) && feature.position.y >= 0 && feature.position.y <= 1;
}

/** Invalid/missing cells retain silent timeline slots rather than becoming zero-valued notes. */
export function mapFeatures(features: readonly ExtractedFeature[]): SonificationEvent[] {
  return features.filter(validFeature).slice().sort((left, right) => left.index - right.index).map(feature => {
    const normalized = feature.normalizedValue as number;
    const midi = MIDI_NOTES[Math.round(normalized * (MIDI_NOTES.length - 1))];
    const note = `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
    const frequencyHz = 440 * 2 ** ((midi - 69) / 12);
    return {
      id: `${feature.id}/${MAPPING_VERSION}`,
      origin: {
        recordId: feature.recordId,
        frameId: feature.frameId,
        featureId: feature.id,
        resourceVersion: feature.resourceVersion,
        extractionMethod: feature.extractionMethod,
      },
      featureSnapshot: { ...feature, extent: { ...feature.extent }, position: { ...feature.position } },
      mappingVersion: MAPPING_VERSION,
      frequencyHz,
      note,
      intensity: 0.06 + 0.14 * normalized,
      durationSeconds: 0.18,
      timelineOffsetSeconds: feature.index * STEP_SECONDS,
      pan: 2 * feature.position.x - 1,
      textDescription: `Cell ${feature.index + 1}: relative image brightness ${(normalized * 100).toFixed(1)}%. ${note}, ${frequencyHz.toFixed(1)} Hz.`,
    };
  });
}
