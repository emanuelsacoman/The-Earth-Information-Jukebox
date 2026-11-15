import { ScientificFrame } from './sonification.types';

export interface DecodedPixels { width: number; height: number; data: Uint8ClampedArray; }

/** Browser boundary: no canvas, fetch or image is created until load() is called. */
export class FrameLoader {
  async load(frame: ScientificFrame, signal: AbortSignal): Promise<DecodedPixels> {
    if (typeof document === 'undefined' || typeof createImageBitmap === 'undefined') {
      throw new Error('A leitura da imagem requer um navegador com Canvas2D.');
    }
    const response = await fetch(frame.resourceUrl, { signal });
    if (!response.ok) throw new Error('A imagem NASA não pôde ser carregada. Tente novamente.');
    const bytes = await response.arrayBuffer();
    if (signal.aborted) throw new Error('Carregamento cancelado.');
    if (!globalThis.crypto?.subtle) throw new Error('Abra em HTTPS ou localhost para verificar a imagem.');
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    if (hash !== frame.sha256) throw new Error('A imagem diverge do recurso NASA verificado.');
    const bitmap = await createImageBitmap(new Blob([bytes]));
    let canvas: HTMLCanvasElement | undefined;
    try {
      if (signal.aborted) throw new Error('Carregamento cancelado.');
      if (bitmap.width !== frame.width || bitmap.height !== frame.height) {
        throw new Error('As dimensões da imagem divergem do manifesto.');
      }
      canvas = document.createElement('canvas');
      canvas.width = frame.width;
      canvas.height = frame.height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('O navegador não disponibilizou a leitura de pixels.');
      context.drawImage(bitmap, 0, 0);
      const pixels = context.getImageData(0, 0, frame.width, frame.height);
      return pixels;
    } finally {
      if (canvas) canvas.width = canvas.height = 0;
      bitmap.close();
    }
  }
}
