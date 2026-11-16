export const NIGHT_LIGHTS = Object.freeze({
  year: 2012, width: 1800, height: 900,
  url: '/data/globe-night-lights/black-marble-2012.png',
  sha256: 'd00bd12ed5dda942111ab895be9f748a296b1b5ea7db86c81b9408c076f190ca',
});

// PixelIsArea, EPSG:4326. Coordinates address pixel centers, with the
// antimeridian wrapped and the two polar rows extended to the poles.
export function sampleNightLight(raster, lat, lon) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90) return 0;
  const {width, height, data} = raster;
  const u = (((lon + 180) % 360 + 360) % 360) * width / 360 - 0.5;
  const v = Math.max(0, Math.min(height - 1, (90 - lat) * height / 180 - 0.5));
  const left = Math.floor(u), top = Math.floor(v);
  const x0 = (left + width) % width, x1 = (x0 + 1) % width;
  const y1 = Math.min(height - 1, top + 1);
  const fx = u - left, fy = v - top;
  const a = data[top * width + x0] * (1 - fx) + data[top * width + x1] * fx;
  const b = data[y1 * width + x0] * (1 - fx) + data[y1 * width + x1] * fx;
  return a * (1 - fy) + b * fy;
}

export async function loadNightLights(signal) {
  const response = await fetch(NIGHT_LIGHTS.url, {signal});
  if (!response.ok) throw new Error('NASA night-lights image is unavailable.');
  const bytes = await response.arrayBuffer();
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  const hash = Array.from(digest, value => value.toString(16).padStart(2, '0')).join('');
  if (hash !== NIGHT_LIGHTS.sha256) throw new Error('NASA night-lights integrity check failed.');
  signal.throwIfAborted();
  const bitmap = await createImageBitmap(new Blob([bytes], {type: 'image/png'}));
  const canvas = document.createElement('canvas');
  try {
    signal.throwIfAborted();
    if (bitmap.width !== NIGHT_LIGHTS.width || bitmap.height !== NIGHT_LIGHTS.height) throw new Error('Unexpected NASA raster dimensions.');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    if (!ctx) throw new Error('This browser cannot read the NASA layer.');
    ctx.drawImage(bitmap, 0, 0);
    const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const data = new Uint8Array(canvas.width * canvas.height);
    for (let i = 0; i < data.length; i++) {
      if (rgba[i * 4] !== rgba[i * 4 + 1] || rgba[i * 4] !== rgba[i * 4 + 2] || rgba[i * 4 + 3] !== 255) throw new Error('Unexpected NASA raster channels.');
      data[i] = rgba[i * 4];
    }
    return {width: canvas.width, height: canvas.height, data};
  } finally {
    bitmap.close();
    canvas.width = canvas.height = 0;
  }
}
