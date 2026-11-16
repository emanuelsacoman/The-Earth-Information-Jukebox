import { ScientificFrame } from './sonification.types';

export interface DecodedPixels {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

/** Browser boundary: no canvas, fetch or image is created until load() is called. */
export class FrameLoader {
  async load(
    frame: ScientificFrame,
    signal: AbortSignal,
  ): Promise<DecodedPixels> {
    if (
      typeof document === 'undefined' ||
      typeof createImageBitmap === 'undefined'
    ) {
      throw new Error('Image reading requires a browser with Canvas2D.');
    }
    const response = await fetch(frame.resourceUrl, { signal });
    if (!response.ok)
      throw new Error('Could not load the NASA image. Try again.');
    const bytes = await response.arrayBuffer();
    if (signal.aborted) throw new Error('Loading cancelled.');
    if (!globalThis.crypto?.subtle)
      throw new Error('Use HTTPS or localhost to verify the image.');
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    const hash = Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, '0'),
    ).join('');
    if (hash !== frame.sha256)
      throw new Error('The image does not match the verified NASA resource.');
    const bitmap = await createImageBitmap(new Blob([bytes]));
    let canvas: HTMLCanvasElement | undefined;
    try {
      if (signal.aborted) throw new Error('Loading cancelled.');
      if (bitmap.width !== frame.width || bitmap.height !== frame.height) {
        throw new Error('Image dimensions do not match the manifest.');
      }
      canvas = document.createElement('canvas');
      canvas.width = frame.width;
      canvas.height = frame.height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('The browser could not read image pixels.');
      context.drawImage(bitmap, 0, 0);
      const pixels = context.getImageData(0, 0, frame.width, frame.height);
      return pixels;
    } finally {
      if (canvas) canvas.width = canvas.height = 0;
      bitmap.close();
    }
  }
}
