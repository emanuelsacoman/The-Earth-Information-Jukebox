import { project, unproject, isClickGesture } from './globe-core.mjs';
import { landPolygons } from './land-polygons.mjs';
import { sampleNightLight } from './night-lights.mjs';

const RAD = Math.PI / 180;

function createLandMask() {
  const map = document.createElement('canvas');
  map.width = 1440;
  map.height = 720;
  const ctx = map.getContext('2d', {willReadFrequently: true});
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.fillStyle = '#fff';
  for (const polygon of landPolygons) {
    ctx.beginPath();
    for (const ring of polygon) {
      ring.forEach(([lon, lat], index) => {
        const x = (lon + 180) * 4;
        const y = (90 - lat) * 4;
        if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.closePath();
    }
    ctx.fill('evenodd');
  }
  return ctx.getImageData(0, 0, map.width, map.height).data;
}

export class GlobeRenderer {
  constructor(canvas, model, onChange) {
    this.canvas = canvas;
    this.model = model;
    this.onChange = onChange;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) throw new Error('This browser cannot draw the globe. Use the places and direction controls.');
    this.mask = createLandMask();
    this.nightLights = null;
    this.nightLightLevels = Float32Array.from({length: 256}, (_, i) => Math.pow(i / 255, 0.85) * 0.9);
    this.surface = document.createElement('canvas');
    this.surface.width = 440;
    this.surface.height = 440;
    this.surfaceCtx = this.surface.getContext('2d');
    this.pixels = this.surfaceCtx.createImageData(440, 440);
    this.frame = 0;
    this.lastPaint = 0;
    this.disposed = false;
    this.dirty = true;
    this.pointers = new Map();
    this.gesture = null;
    this.abort = new AbortController();
    const signal = this.abort.signal;
    canvas.addEventListener('pointerdown', event => this.pointerDown(event), {signal});
    canvas.addEventListener('pointermove', event => this.pointerMove(event), {signal});
    canvas.addEventListener('pointerup', event => this.pointerUp(event), {signal});
    canvas.addEventListener('pointercancel', event => this.cancelPointer(event), {signal});
    canvas.addEventListener('lostpointercapture', event => this.cancelPointer(event), {signal});
    canvas.addEventListener('wheel', event => {
      if (!event.deltaY) return;
      event.preventDefault();
      model.zoomBy(Math.exp(-Math.max(-160, Math.min(160, event.deltaY)) * 0.002));
      this.changed();
    }, {passive: false, signal});
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.lastPaint = 0;
      if (!document.hidden) this.invalidate();
    }, {signal});
    this.resize = new ResizeObserver(() => this.invalidate());
    this.resize.observe(canvas);
    this.invalidate();
  }

  changed() { this.onChange(); this.invalidate(); }

  setNightLights(raster) {
    if (this.disposed) return;
    this.nightLights = raster;
    this.invalidate();
  }

  invalidate() {
    this.dirty = true;
    if (!this.disposed && !document.hidden && !this.frame) {
      this.frame = requestAnimationFrame(time => this.tick(time));
    }
  }

  tick(time) {
    this.frame = 0;
    if (this.disposed || document.hidden) return;
    const rotating = this.model.autoRotate && !this.model.reducedMotion;
    if (rotating && this.lastPaint && time - this.lastPaint < 32) {
      this.frame = requestAnimationFrame(next => this.tick(next));
      return;
    }
    if (rotating) {
      const seconds = this.lastPaint ? Math.min((time - this.lastPaint) / 1000, 0.1) : 0;
      this.model.center.lon = ((this.model.center.lon + seconds * 3 + 180) % 360) - 180;
      this.dirty = true;
    }
    if (this.dirty) {
      this.draw();
      this.dirty = false;
      this.lastPaint = time;
    }
    if (rotating) this.frame = requestAnimationFrame(next => this.tick(next));
  }

  pointerDown(event) {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    this.canvas.focus({preventScroll: true});
    this.canvas.setPointerCapture(event.pointerId);
    this.pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    if (!this.gesture) this.gesture = {id: event.pointerId, x: event.clientX, y: event.clientY, distance: 0, maxPointers: 1};
    this.gesture.maxPointers = Math.max(this.gesture.maxPointers, this.pointers.size);
    this.model.setAutoRotate(false);
    this.canvas.classList.add('is-dragging');
    this.changed();
  }

  pointerMove(event) {
    const old = this.pointers.get(event.pointerId);
    if (!old || !this.gesture) return;
    const before = [...this.pointers.values()];
    this.pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    this.gesture.distance = Math.max(this.gesture.distance, Math.hypot(event.clientX - this.gesture.x, event.clientY - this.gesture.y));
    if (this.pointers.size === 2) {
      const after = [...this.pointers.values()];
      const distance = points => Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      if (distance(before) > 1) this.model.zoomBy(distance(after) / distance(before));
    } else if (this.pointers.size === 1) {
      this.model.rotateBy((event.clientX - old.x) / this.model.zoom, (event.clientY - old.y) / this.model.zoom);
    }
    this.changed();
  }

  pointerUp(event) {
    if (!this.pointers.has(event.pointerId)) return;
    if (this.gesture) this.gesture.distance = Math.max(this.gesture.distance, Math.hypot(event.clientX - this.gesture.x, event.clientY - this.gesture.y));
    const click = this.gesture && isClickGesture(this.gesture.distance, this.gesture.maxPointers);
    this.pointers.delete(event.pointerId);
    if (click && this.geometry) {
      const rect = this.canvas.getBoundingClientRect();
      const point = unproject((event.clientX - rect.left - this.geometry.x) / this.geometry.radius,
        -(event.clientY - rect.top - this.geometry.y) / this.geometry.radius, this.model.center);
      if (point) this.model.select(point);
    }
    if (!this.pointers.size) {
      this.gesture = null;
      this.canvas.classList.remove('is-dragging');
    }
    this.changed();
  }

  cancelPointer(event) {
    this.pointers.delete(event.pointerId);
    if (this.gesture) this.gesture.maxPointers = 2;
    if (!this.pointers.size) {
      this.gesture = null;
      this.canvas.classList.remove('is-dragging');
    }
  }

  paintSurface() {
    const data = this.pixels.data;
    const tilt = this.model.center.lat * RAD;
    const sinTilt = Math.sin(tilt), cosTilt = Math.cos(tilt);
    for (let row = 0; row < 440; row++) {
      const y = 1 - (row + 0.5) / 220;
      for (let col = 0; col < 440; col++) {
        const x = (col + 0.5) / 220 - 1;
        const index = (row * 440 + col) * 4;
        const sq = 1 - x * x - y * y;
        if (sq < 0) { data[index + 3] = 0; continue; }
        const z = Math.sqrt(sq);
        const lat = Math.asin(Math.max(-1, Math.min(1, y * cosTilt + z * sinTilt))) / RAD;
        const lon = this.model.center.lon + Math.atan2(x, z * cosTilt - y * sinTilt) / RAD;
        const tx = ((Math.floor((lon + 180) * 4) % 1440) + 1440) % 1440;
        const ty = Math.max(0, Math.min(719, Math.floor((90 - lat) * 4)));
        const land = this.mask[(ty * 1440 + tx) * 4 + 3] > 100;
        const edge = land && (this.mask[(ty * 1440 + (tx + 2) % 1440) * 4 + 3] < 100 || this.mask[(ty * 1440 + (tx + 1438) % 1440) * 4 + 3] < 100);
        const light = Math.max(0, -x * 0.45 + y * 0.45 + z * 0.76);
        const grain = ((tx * 17 + ty * 31) % 11) * 0.4;
        const limb = Math.pow(1 - z, 5);
        data[index] = edge ? 174 + light * 50 : (land ? 30 + light * 44 + grain : 9 + light * 12) + limb * 26;
        data[index + 1] = edge ? 119 + light * 36 : (land ? 29 + light * 40 + grain : 14 + light * 14) + limb * 14;
        data[index + 2] = edge ? 49 + light * 14 : (land ? 25 + light * 32 + grain : 18 + light * 18);
        if (this.nightLights) {
          const brightness = this.nightLightLevels[Math.round(sampleNightLight(this.nightLights, lat, lon))];
          // Amber is a display choice. Positions and emission strength come
          // exclusively from NASA pixels, independent of the land mask.
          const fade = 0.65 + z * 0.35;
          data[index] = data[index] * 0.42 * (1 - brightness) + brightness * 245 * fade;
          data[index + 1] = data[index + 1] * 0.42 * (1 - brightness) + brightness * 205 * fade;
          data[index + 2] = data[index + 2] * 0.55 * (1 - brightness) + brightness * 125 * fade;
        }
        data[index + 3] = 255;
      }
    }
    this.surfaceCtx.putImageData(this.pixels, 0, 0);
  }

  drawLine(points, color) {
    const ctx = this.ctx, {x, y, radius} = this.geometry;
    ctx.beginPath();
    let previous = null;
    for (const point of points) {
      const p = project(point, this.model.center);
      if (p.z >= 0) {
        if (previous) ctx.lineTo(x + p.x * radius, y - p.y * radius);
        else ctx.moveTo(x + p.x * radius, y - p.y * radius);
        previous = p;
      } else previous = null;
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.65;
    ctx.stroke();
  }

  draw() {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.round(rect.width * dpr), height = Math.round(rect.height * dpr);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    const ctx = this.ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    const radius = Math.min(rect.width * 0.425, rect.height * 0.405) * this.model.zoom;
    const x = rect.width / 2, y = rect.height / 2;
    this.geometry = {x, y, radius};
    this.paintSurface();
    const glow = ctx.createRadialGradient(x - radius * .3, y - radius * .2, radius * .8, x, y, radius * 1.16);
    glow.addColorStop(0, '#ffb54700'); glow.addColorStop(.8, '#ffb54709'); glow.addColorStop(1, '#ffb54700');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.drawImage(this.surface, x - radius, y - radius, radius * 2, radius * 2);
    ctx.strokeStyle = '#d49b4a99'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.stroke();
    for (let lat = -60; lat <= 60; lat += 30) {
      this.drawLine(Array.from({length: 181}, (_, i) => ({lat, lon: i * 2 - 180})), '#ffb54724');
    }
    for (let lon = -180; lon < 180; lon += 30) {
      this.drawLine(Array.from({length: 91}, (_, i) => ({lat: i * 2 - 90, lon})), '#ffb54720');
    }
    // Instrument ticks are decorative; they carry no scientific measurement.
    for (let i = 0; i < 72; i++) {
      const angle = i * Math.PI / 36;
      const r1 = radius + 14, r2 = r1 + (i % 6 === 0 ? 6 : 2);
      ctx.beginPath(); ctx.moveTo(x + Math.cos(angle) * r1, y + Math.sin(angle) * r1);
      ctx.lineTo(x + Math.cos(angle) * r2, y + Math.sin(angle) * r2);
      ctx.strokeStyle = i % 6 === 0 ? '#ad834885' : '#ad834830'; ctx.stroke();
    }
    if (this.model.selection) {
      const p = project(this.model.selection, this.model.center);
      if (p.z > 0) {
        const sx = x + p.x * radius, sy = y - p.y * radius;
        ctx.strokeStyle = '#ffe0a0'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(sx, sy, 9, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(sx - 15, sy); ctx.lineTo(sx - 5, sy); ctx.moveTo(sx + 5, sy); ctx.lineTo(sx + 15, sy);
        ctx.moveTo(sx, sy - 15); ctx.lineTo(sx, sy - 5); ctx.moveTo(sx, sy + 5); ctx.lineTo(sx, sy + 15);
        ctx.stroke();
      }
    }
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.abort.abort();
    this.resize.disconnect();
    for (const id of this.pointers.keys()) {
      if (this.canvas.hasPointerCapture(id)) this.canvas.releasePointerCapture(id);
    }
    this.pointers.clear();
    this.mask = null;
    this.nightLights = null;
    this.nightLightLevels = null;
    this.pixels = null;
    this.surface.width = 0;
    this.surface.height = 0;
    this.canvas.width = 0;
    this.canvas.height = 0;
  }
}
