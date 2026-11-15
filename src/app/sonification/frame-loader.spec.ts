import { FrameLoader } from './frame-loader';
import { SCIENTIFIC_RECORDS } from './scientific-catalog';

describe('FrameLoader', () => {
  const frame = SCIENTIFIC_RECORDS[0].frames[1];
  let sourceBytes: ArrayBuffer;
  let loader: FrameLoader;
  let controller: AbortController;

  // The happy path uses the actual curated NASA PNG served by the existing Karma assets config.
  // Failure cases reuse those bytes and change only the boundary whose failure is under test.
  beforeAll(async () => {
    const response = await fetch(frame.resourceUrl);
    if (!response.ok) throw new Error(`Curated NASA test asset unavailable: ${response.status}`);
    sourceBytes = await response.arrayBuffer();
  });

  beforeEach(() => {
    loader = new FrameLoader();
    controller = new AbortController();
  });

  function serveVerifiedBytes(): jasmine.Spy {
    return spyOn(window, 'fetch').and.callFake(async () => new Response(sourceBytes.slice(0), {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    }));
  }

  it('fetches, verifies SHA-256, decodes and reads the actual 2023 NASA asset without mocks', async () => {
    const pixels = await loader.load(frame, controller.signal);
    expect(pixels.width).toBe(2048);
    expect(pixels.height).toBe(1152);
    expect(pixels.data.length).toBe(2048 * 1152 * 4);
    expect(Array.from(pixels.data.slice(0, 3))).toEqual([0, 0, 0]);
    // Bicubic conversion into RGBA leaves a partially transparent outer edge.
    expect(pixels.data[(576 * 2048 + 1024) * 4 + 3]).toBe(255);
    let containsBrightPixel = false;
    let containsColoredPixel = false;
    for (let offset = 0; offset < pixels.data.length; offset += 4) {
      const red = pixels.data[offset];
      const green = pixels.data[offset + 1];
      const blue = pixels.data[offset + 2];
      if (Math.max(red, green, blue) > 192) containsBrightPixel = true;
      if (Math.abs(red - blue) > 32) containsColoredPixel = true;
      if (containsBrightPixel && containsColoredPixel) break;
    }
    expect(containsBrightPixel).toBeTrue();
    expect(containsColoredPixel).toBeTrue();
  });

  it('rejects an actual missing HTTP asset before attempting image decoding', async () => {
    const decode = spyOn(window, 'createImageBitmap').and.callThrough();
    await expectAsync(loader.load({ ...frame,
      resourceUrl: '/data/night-lights/missing-frame-for-test.png'
    }, controller.signal)).toBeRejectedWithError('Could not load the NASA image. Try again.');
    expect(decode).not.toHaveBeenCalled();
  });

  it('passes the cancellation signal to fetch and propagates network errors', async () => {
    const failure = new TypeError('Network unavailable for this test');
    const request = spyOn(window, 'fetch').and.rejectWith(failure);
    await expectAsync(loader.load(frame, controller.signal)).toBeRejectedWith(failure);
    expect(request).toHaveBeenCalledOnceWith(frame.resourceUrl, { signal: controller.signal });
  });

  it('rejects a hash mismatch before decoding the otherwise valid real image', async () => {
    serveVerifiedBytes();
    const decode = spyOn(window, 'createImageBitmap').and.callThrough();
    await expectAsync(loader.load({ ...frame, sha256: '0'.repeat(64) }, controller.signal))
      .toBeRejectedWithError('The image does not match the verified NASA resource.');
    expect(decode).not.toHaveBeenCalled();
  });

  it('rejects mismatched dimensions and closes the decoded bitmap', async () => {
    serveVerifiedBytes();
    const close = spyOn(ImageBitmap.prototype, 'close').and.callThrough();
    await expectAsync(loader.load({ ...frame, width: frame.width + 1 }, controller.signal))
      .toBeRejectedWithError('Image dimensions do not match the manifest.');
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('rejects an already aborted request without decoding an image', async () => {
    controller.abort();
    const decode = spyOn(window, 'createImageBitmap').and.callThrough();
    await expectAsync(loader.load(frame, controller.signal)).toBeRejected();
    expect(decode).not.toHaveBeenCalled();
  });

  it('discards bytes arriving after cancellation without decoding stale content', async () => {
    let releaseBytes!: (bytes: ArrayBuffer) => void;
    const pendingBytes = new Promise<ArrayBuffer>(resolve => { releaseBytes = resolve; });
    spyOn(window, 'fetch').and.resolveTo({ ok: true, arrayBuffer: () => pendingBytes } as Response);
    const decode = spyOn(window, 'createImageBitmap').and.callThrough();
    const loading = loader.load(frame, controller.signal);
    controller.abort();
    releaseBytes(sourceBytes.slice(0));
    await expectAsync(loading).toBeRejectedWithError('Loading cancelled.');
    expect(decode).not.toHaveBeenCalled();
  });

  it('closes a bitmap delivered by an obsolete decode after cancellation', async () => {
    serveVerifiedBytes();
    const close = jasmine.createSpy('close');
    const bitmap = { width: frame.width, height: frame.height, close } as unknown as ImageBitmap;
    spyOn(window, 'createImageBitmap').and.callFake(async () => {
      controller.abort();
      return bitmap;
    });
    await expectAsync(loader.load(frame, controller.signal)).toBeRejectedWithError('Loading cancelled.');
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('propagates a decoder failure instead of returning fabricated pixels', async () => {
    serveVerifiedBytes();
    const failure = new DOMException('Decode failed for this test', 'InvalidStateError');
    spyOn(window, 'createImageBitmap').and.rejectWith(failure);
    await expectAsync(loader.load(frame, controller.signal)).toBeRejectedWith(failure);
  });

  it('reports an unavailable canvas and closes the real decoded bitmap', async () => {
    serveVerifiedBytes();
    const close = spyOn(ImageBitmap.prototype, 'close').and.callThrough();
    spyOn(HTMLCanvasElement.prototype, 'getContext').and.returnValue(null);
    await expectAsync(loader.load(frame, controller.signal))
      .toBeRejectedWithError('The browser could not read image pixels.');
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('propagates pixel security failures and closes the bitmap rather than returning zero data', async () => {
    serveVerifiedBytes();
    const close = spyOn(ImageBitmap.prototype, 'close').and.callThrough();
    const failure = new DOMException('Pixel access blocked for this test', 'SecurityError');
    spyOn(CanvasRenderingContext2D.prototype, 'getImageData').and.throwError(failure);
    await expectAsync(loader.load(frame, controller.signal)).toBeRejectedWith(failure);
    expect(close).toHaveBeenCalledTimes(1);
  });
});
