import { EXTRACTION_VERSION, MAPPING_VERSION, STEP_SECONDS, extractFeatures, mapFeatures } from './feature-mapping';
import { ExtractedFeature } from './sonification.types';

// Synthetic RGBA fixtures test the algorithm; they are not NASA observations.
function syntheticPixels(values: readonly number[], width = values.length) {
  return {
    width,
    height: values.length / width,
    data: new Uint8ClampedArray(values.flatMap(value => [value, value, value, 255])),
  };
}

function syntheticFeatures(values: readonly number[]): ExtractedFeature[] {
  return extractFeatures(syntheticPixels(values), {
    recordId: 'synthetic-record', frameId: 'synthetic-frame', resourceVersion: 'fixture/v1',
    roi: { x: 0, y: 0, width: values.length, height: 1 },
    columns: values.length, rows: 1, sampleStride: 1,
  });
}

describe('Feature extraction and pentatonic mapping', () => {
  it('normalizes black, intermediate gray and white against the fixed 0–255 reference', () => {
    const features = syntheticFeatures([0, 128, 255]);
    expect(features[0].rawValue).toBe(0);
    expect(features[1].rawValue as number).toBeCloseTo(128, 12);
    expect(features[2].rawValue as number).toBeCloseTo(255, 12);
    expect(features[0].normalizedValue).toBe(0);
    expect(features[1].normalizedValue).toBeCloseTo(128 / 255, 12);
    expect(features[2].normalizedValue as number).toBeCloseTo(1, 12);
    expect(features.every(feature => feature.domain === 'visual-pixel')).toBeTrue();
  });

  it('maps minimum, midpoint and maximum to bounded, deterministic notes', () => {
    const features = syntheticFeatures([0, 128, 255]);
    features[1].normalizedValue = 0.5;
    const events = mapFeatures(features);
    expect(events.map(event => event.note)).toEqual(['C3', 'G4', 'C6']);
    expect(events[0].frequencyHz).toBeCloseTo(130.81278265, 6);
    expect(events[1].frequencyHz).toBeCloseTo(391.99543598, 6);
    expect(events[2].frequencyHz).toBeCloseTo(1046.5022612, 6);
    expect(events[0].intensity).toBeCloseTo(0.06, 12);
    expect(events[1].intensity).toBeCloseTo(0.13, 12);
    expect(events[2].intensity).toBeCloseTo(0.2, 12);
    expect(events.map(event => event.timelineOffsetSeconds)).toEqual([0, STEP_SECONDS, 2 * STEP_SECONDS]);
    expect(events.every(event => event.durationSeconds === 0.18)).toBeTrue();
    expect(events[0].pan).toBeCloseTo(-2 / 3, 12);
    expect(events[2].pan).toBeCloseTo(2 / 3, 12);
  });

  it('keeps missing and masked samples silent, while valid black remains a real zero', () => {
    const pixels = syntheticPixels([0, 255, 255]);
    pixels.data[7] = 0;
    const features = extractFeatures(pixels, {
      recordId: 'synthetic', frameId: 'masked', resourceVersion: 'fixture/v1',
      roi: { x: 0, y: 0, width: 3, height: 1 }, columns: 3, rows: 1,
      sampleStride: 1, mask: new Uint8Array([1, 1, 0]),
    });
    expect(features.map(feature => feature.validity)).toEqual(['valid', 'missing', 'masked']);
    expect(features.map(feature => feature.normalizedValue)).toEqual([0, null, null]);
    expect(mapFeatures(features).map(event => event.origin.featureId)).toEqual([features[0].id]);
  });

  it('retains silent timeline gaps and orders events even for reordered input', () => {
    const features = syntheticFeatures([0, 128, 255]);
    features[1].validity = 'missing';
    features[1].normalizedValue = null;
    expect(mapFeatures([features[2], features[1], features[0]]).map(event => event.timelineOffsetSeconds))
      .toEqual([0, 2 * STEP_SECONDS]);
  });

  it('uses the specified channel weights and averages only samples allowed by ROI and exclusions', () => {
    const pixels = { width: 3, height: 1, data: new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 255, 255, 255, 255]) };
    const features = extractFeatures(pixels, {
      recordId: 'synthetic', frameId: 'roi', resourceVersion: 'fixture/v1',
      roi: { x: 0, y: 0, width: 2, height: 1 }, columns: 1, rows: 1, sampleStride: 1,
      excludedRegions: [{ x: 1, y: 0, width: 1, height: 1 }],
    });
    expect(features[0].rawValue).toBeCloseTo(255 * 0.2126, 12);
    expect(features[0].extent).toEqual({ x: 0, y: 0, width: 2, height: 1 });
    expect(features[0].position).toEqual({ x: 1 / 3, y: 0.5 });
  });

  it('marks a fully excluded cell as masked rather than measured black', () => {
    const features = extractFeatures(syntheticPixels([255]), {
      recordId: 'synthetic', frameId: 'excluded', resourceVersion: 'fixture/v1',
      roi: { x: 0, y: 0, width: 1, height: 1 }, columns: 1, rows: 1,
      excludedRegions: [{ x: 0, y: 0, width: 1, height: 1 }],
    });
    expect(features[0].validity).toBe('masked');
    expect(mapFeatures(features)).toEqual([]);
  });

  it('sweeps down each column and samples on the declared stride without rescaling each frame', () => {
    const features = extractFeatures(syntheticPixels([0, 50, 100, 150], 2), {
      recordId: 'synthetic', frameId: 'grid', resourceVersion: 'fixture/v1',
      roi: { x: 0, y: 0, width: 2, height: 2 }, columns: 2, rows: 2, sampleStride: 1,
    });
    expect(features.map(feature => feature.rawValue)).toEqual([0, 100, 50, 150]);
    expect(features[3].normalizedValue).toBeCloseTo(150 / 255, 12);
    const sampled = extractFeatures(syntheticPixels([0, 255, 100, 255]), {
      recordId: 'synthetic', frameId: 'stride', resourceVersion: 'fixture/v1',
      roi: { x: 0, y: 0, width: 4, height: 1 }, columns: 1, rows: 1, sampleStride: 2,
    });
    expect(sampled[0].rawValue).toBeCloseTo(50, 12);
  });

  it('is reproducible, traces events to the extraction, and snapshots independent feature values', () => {
    const features = syntheticFeatures([0, 128, 255]);
    const events = mapFeatures(features);
    expect(syntheticFeatures([0, 128, 255])).toEqual(features);
    expect(mapFeatures(syntheticFeatures([0, 128, 255]))).toEqual(events);
    expect(events[1].origin).toEqual({
      recordId: features[1].recordId, frameId: features[1].frameId,
      featureId: features[1].id, resourceVersion: features[1].resourceVersion,
      extractionMethod: features[1].extractionMethod,
    });
    expect(events[1].mappingVersion).toBe(MAPPING_VERSION);
    expect(features[1].extractionMethod).toContain(EXTRACTION_VERSION);
    expect(events[1].textDescription).toContain('relative image brightness');
    expect(events[1].textDescription).toContain(events[1].note);
    const originalX = events[1].featureSnapshot.position.x;
    features[1].position.x = 0;
    expect(events[1].featureSnapshot.position.x).toBe(originalX);
  });

  it('includes extraction parameters and resource versions in stable feature identities', () => {
    const pixels = syntheticPixels([0, 128, 255]);
    const options = {
      recordId: 'synthetic', frameId: 'identity', resourceVersion: 'fixture/v1',
      roi: { x: 0, y: 0, width: 3, height: 1 }, columns: 1, rows: 1,
    };
    const original = extractFeatures(pixels, options)[0].id;
    expect(extractFeatures(pixels, { ...options, sampleStride: 1 })[0].id).not.toBe(original);
    expect(extractFeatures(pixels, { ...options, resourceVersion: 'fixture/v2' })[0].id).not.toBe(original);
    expect(extractFeatures(pixels, { ...options, mask: new Uint8Array([1, 0, 1]) })[0].id).not.toBe(original);
  });

  it('rejects malformed pixels, regions, masks and sampling configurations', () => {
    const pixels = syntheticPixels([0, 128, 255]);
    const options = {
      recordId: 'synthetic', frameId: 'invalid', resourceVersion: 'fixture/v1',
      roi: { x: 0, y: 0, width: 3, height: 1 }, columns: 3, rows: 1,
    };
    expect(() => extractFeatures({ ...pixels, data: new Uint8ClampedArray(1) }, options)).toThrowError();
    expect(() => extractFeatures({ ...pixels, width: NaN }, options)).toThrowError();
    expect(() => extractFeatures(pixels, { ...options, roi: { x: -1, y: 0, width: 3, height: 1 } })).toThrowError();
    expect(() => extractFeatures(pixels, { ...options, roi: { x: 0, y: 0, width: 4, height: 1 } })).toThrowError();
    expect(() => extractFeatures(pixels, { ...options, columns: 4 })).toThrowError();
    expect(() => extractFeatures(pixels, { ...options, rows: 0 })).toThrowError();
    expect(() => extractFeatures(pixels, { ...options, sampleStride: Infinity })).toThrowError();
    expect(() => extractFeatures(pixels, { ...options, sampleStride: 0.5 })).toThrowError();
    expect(() => extractFeatures(pixels, { ...options, mask: new Uint8Array(1) })).toThrowError();
    expect(() => extractFeatures(pixels, { ...options, frameId: '' })).toThrowError();
  });

  it('produces no notes for absent, nonfinite or out-of-domain values and unsafe positions', () => {
    const [feature] = syntheticFeatures([128]);
    const invalidFeatures: ExtractedFeature[] = [
      { ...feature, normalizedValue: null }, { ...feature, normalizedValue: NaN },
      { ...feature, normalizedValue: Infinity }, { ...feature, normalizedValue: -0.01 },
      { ...feature, normalizedValue: 1.01 }, { ...feature, rawValue: NaN },
      { ...feature, index: -1 }, { ...feature, index: 1.5 },
      { ...feature, position: { x: NaN, y: 0.5 } },
      { ...feature, position: { x: 1.01, y: 0.5 } },
    ];
    expect(mapFeatures(invalidFeatures)).toEqual([]);
    expect(mapFeatures([])).toEqual([]);
  });
});
