const RAD = Math.PI / 180;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function normalizePoint(point) {
  if (!point || !Number.isFinite(point.lat) || !Number.isFinite(point.lon)) return null;
  return {lat: clamp(point.lat, -90, 90), lon: ((point.lon + 180) % 360 + 360) % 360 - 180};
}

// Coordinates are normalized to a unit sphere; y points north, z toward the camera.
export function project(point, center) {
  const lat = point.lat * RAD;
  const delta = (point.lon - center.lon) * RAD;
  const tilt = center.lat * RAD;
  return {
    x: Math.cos(lat) * Math.sin(delta),
    y: Math.cos(tilt) * Math.sin(lat) - Math.sin(tilt) * Math.cos(lat) * Math.cos(delta),
    z: Math.sin(tilt) * Math.sin(lat) + Math.cos(tilt) * Math.cos(lat) * Math.cos(delta),
  };
}

export function unproject(x, y, center) {
  if (!Number.isFinite(x) || !Number.isFinite(y) || x * x + y * y > 1) return null;
  const z = Math.sqrt(Math.max(0, 1 - x * x - y * y));
  const tilt = center.lat * RAD;
  return normalizePoint({
    lat: Math.asin(clamp(y * Math.cos(tilt) + z * Math.sin(tilt), -1, 1)) / RAD,
    lon: center.lon + Math.atan2(x, z * Math.cos(tilt) - y * Math.sin(tilt)) / RAD,
  });
}

export function isClickGesture(maxDistance, maxPointers) {
  return Number.isFinite(maxDistance) && maxDistance >= 0 && maxDistance <= 6 && maxPointers === 1;
}

export class GlobeModel {
  constructor() {
    this.reducedMotion = false;
    this.reset();
  }

  reset() {
    this.center = {lat: -12, lon: -35};
    this.selection = null;
    this.zoom = 1;
    this.autoRotate = false;
  }

  setAutoRotate(enabled) { this.autoRotate = Boolean(enabled) && !this.reducedMotion; }

  setReducedMotion(enabled) {
    this.reducedMotion = Boolean(enabled);
    if (this.reducedMotion) this.autoRotate = false;
  }

  select(point, focus = false) {
    const valid = normalizePoint(point);
    if (!valid) return false;
    this.selection = valid;
    this.autoRotate = false;
    if (focus) this.center = {lat: clamp(valid.lat, -85, 85), lon: valid.lon};
    return true;
  }

  rotateBy(dx, dy) {
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
    this.autoRotate = false;
    const next = normalizePoint({lat: this.center.lat + dy * 0.25, lon: this.center.lon - dx * 0.25});
    this.center = {lat: clamp(next.lat, -85, 85), lon: next.lon};
  }

  zoomBy(factor) {
    if (Number.isFinite(factor) && factor > 0) this.zoom = clamp(this.zoom * factor, 0.72, 2.1);
  }

  moveSelection(dLat, dLon) {
    const point = this.selection || this.center;
    this.select({lat: point.lat + dLat, lon: point.lon + dLon}, true);
  }
}
