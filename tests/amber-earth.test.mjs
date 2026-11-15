import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePoint, project, unproject, GlobeModel, isClickGesture } from '../src/app/view/screen-components/planet-earth/globe-core.mjs';

test('rejects non-finite coordinates and wraps longitude while clamping latitude', () => {
  assert.equal(normalizePoint({lat: NaN, lon: 0}), null);
  assert.equal(normalizePoint({lat: 0, lon: Infinity}), null);
  assert.deepEqual(normalizePoint({lat: 95, lon: 185}), {lat: 90, lon: -175});
  assert.deepEqual(normalizePoint({lat: 0, lon: 180}), {lat: 0, lon: -180});
});

test('projects the visible center and hides the antipode', () => {
  const front = project({lat: 0, lon: 0}, {lat: 0, lon: 0});
  assert.deepEqual(front, {x: 0, y: 0, z: 1});
  assert.ok(project({lat: 0, lon: 180}, {lat: 0, lon: 0}).z < 0);
  const east = project({lat: 0, lon: 90}, {lat: 0, lon: 0});
  assert.ok(Math.abs(east.x - 1) < 1e-9);
});

test('unprojects screen coordinates and rejects clicks beyond the limb', () => {
  assert.deepEqual(unproject(0, 0, {lat: 0, lon: 0}), {lat: 0, lon: 0});
  assert.equal(unproject(1.01, 0, {lat: 0, lon: 0}), null);
  assert.equal(unproject(NaN, 0, {lat: 0, lon: 0}), null);
  const point = unproject(0.5, 0, {lat: 0, lon: 0});
  assert.ok(Math.abs(point.lon - 30) < 1e-9);
  assert.equal(point.lat, 0);
});

test('roundtrips known places at different camera angles', () => {
  const cases = [
    [{lat: -23.55, lon: -46.63}, {lat: -12, lon: -35}],
    [{lat: 51.5, lon: -0.12}, {lat: 30, lon: 10}],
    [{lat: 15, lon: 179}, {lat: 0, lon: -175}],
    [{lat: 89.9, lon: 30}, {lat: 75, lon: 0}],
  ];
  for (const [point, center] of cases) {
    const p = project(point, center);
    assert.ok(p.z > 0);
    const result = unproject(p.x, p.y, center);
    assert.ok(Math.abs(result.lat - point.lat) < 1e-7);
    assert.ok(Math.abs(result.lon - point.lon) < 1e-7);
  }
});

test('drag gestures and multi-touch never become a selection', () => {
  assert.equal(isClickGesture(6, 1), true);
  assert.equal(isClickGesture(6.1, 1), false);
  assert.equal(isClickGesture(0, 2), false);
});

test('selection stops rotation and zoom stays bounded', () => {
  const model = new GlobeModel();
  model.setAutoRotate(true);
  model.select({lat: -3, lon: -60});
  assert.equal(model.autoRotate, false);
  model.zoomBy(100);
  assert.equal(model.zoom, 2.1);
  model.zoomBy(0.001);
  assert.equal(model.zoom, 0.72);
  const selection = {...model.selection};
  model.zoomBy(1.1);
  assert.deepEqual(model.selection, selection);
});

test('keyboard selection wraps dateline, clamps poles and brings point into view', () => {
  const model = new GlobeModel();
  model.select({lat: 88, lon: 178});
  model.moveSelection(5, 5);
  assert.deepEqual(model.selection, {lat: 90, lon: -177});
  assert.equal(model.autoRotate, false);
  assert.ok(project(model.selection, model.center).z > 0);
});

test('reduced motion prevents automatic rotation and reset restores view', () => {
  const model = new GlobeModel();
  model.setReducedMotion(true);
  model.setAutoRotate(true);
  assert.equal(model.autoRotate, false);
  model.rotateBy(100, 20);
  model.zoomBy(2);
  model.reset();
  assert.deepEqual(model.center, {lat: -12, lon: -35});
  assert.equal(model.zoom, 1);
  assert.equal(model.selection, null);
});
