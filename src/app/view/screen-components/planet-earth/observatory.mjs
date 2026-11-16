import {GlobeModel} from './globe-core.mjs';
import {GlobeRenderer} from './globe-renderer.mjs';
import {loadNightLights} from './night-lights.mjs';

let instanceId = 0;
const destinations = [
  ['Amazon', -3, -60], ['Atlantic', 5, -30],
  ['Sahara', 23, 13], ['Japan', 36, 138], ['Antarctica', -80, 0],
];

// All UI strings are static; coordinates are written with textContent, never HTML.
function element(tag, className = '', text = '') {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

export function mountObservatory(host, options = {}) {
  const model = new GlobeModel();
  const abort = new AbortController();
  const signal = abort.signal;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = element('section', 'amber-app');
  root.setAttribute('aria-label', 'Earth observatory — free exploration');
  const helpId = `amber-help-${++instanceId}`;
  let renderer = null, disposed = false, lastSelection = '';
  let nightRaster = null, nightLoading = false;
  const button = (text, title, handler, className = '') => {
    const node = element('button', `amber-button ${className}`, text);
    node.type = 'button';
    node.setAttribute('aria-label', title);
    node.title = title;
    node.addEventListener('click', handler, {signal});
    return node;
  };

  // The Angular composition owns branding and the scientific player. This
  // disclosure contains only geographic exploration, never playback state.
  const exploration = element('details', 'amber-explore');
  const explorationSummary = element('summary', 'amber-explore-summary', 'Places & coordinates');
  const explorationContent = element('div', 'amber-explore-content');
  const regionBlock = element('div', 'amber-regions');
  regionBlock.append(element('h2', 'amber-label', 'PLACES'));
  const regionButtons = [];
  for (const [name, lat, lon] of destinations) {
    const node = button(name, `Explore ${name}`, () => {
      model.select({lat, lon}, true);
      update();
    }, 'amber-destination');
    node.setAttribute('aria-pressed', 'false');
    regionButtons.push({node, lat, lon});
    regionBlock.append(node);
  }

  const viewport = element('div', 'amber-viewport');
  const canvas = element('canvas', 'amber-canvas');
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'application');
  canvas.setAttribute('aria-label', 'Interactive globe. Use arrow keys to select, plus and minus to zoom, and Home to reset.');
  canvas.setAttribute('aria-describedby', helpId);
  const viewportTop = element('div', 'amber-viewport-caption');
  const layerCaption = element('span', '', 'Natural Earth · geographic base map');
  layerCaption.dataset.layerCaption = '';
  viewportTop.append(element('span', '', 'EARTH OBSERVATORY'), layerCaption);
  const hint = element('p', 'amber-hint', 'DRAG TO ROTATE · CLICK TO SELECT');
  hint.id = helpId;
  const unavailable = element('p', 'amber-fallback');
  unavailable.hidden = true;
  unavailable.setAttribute('role', 'status');
  viewport.append(canvas, viewportTop, hint, unavailable);

  const inspector = element('aside', 'amber-inspector');
  inspector.setAttribute('aria-label', 'Selected point');
  const readout = element('div', 'amber-readout');
  const coordinate = (label, key) => {
    const wrap = element('div', 'amber-coordinate');
    const value = element('output', 'amber-coordinate-value', '—');
    value.dataset.coordinate = key;
    value.setAttribute('aria-label', label);
    wrap.append(element('span', 'amber-label', label), value);
    readout.append(wrap);
    return value;
  };
  const latOutput = coordinate('LATITUDE', 'lat');
  const lonOutput = coordinate('LONGITUDE', 'lon');
  const announcement = element('p', 'amber-selection-state', 'Select on the globe or choose a place.');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  const navigation = element('div', 'amber-direction-pad');
  navigation.setAttribute('role', 'group');
  navigation.setAttribute('aria-label', 'Move the selected point');
  for (const [glyph, label, dLat, dLon] of [['↑','Move north',5,0], ['←','Move west',0,-5], ['↓','Move south',-5,0], ['→','Move east',0,5]]) {
    navigation.append(button(glyph, label, () => {model.moveSelection(dLat, dLon); update();}));
  }
  const motionLabel = element('label', 'amber-motion');
  const motionInput = document.createElement('input');
  motionInput.type = 'checkbox';
  motionInput.checked = media.matches;
  model.setReducedMotion(media.matches);
  motionLabel.append(motionInput, element('span', '', 'Reduce motion'));
  motionInput.addEventListener('change', () => {model.setReducedMotion(motionInput.checked || media.matches); update();}, {signal});
  media.addEventListener('change', () => {model.setReducedMotion(motionInput.checked || media.matches); update();}, {signal});
  inspector.append(readout, navigation, motionLabel, element('p', 'amber-inspector-note', 'Geographic selection only. This point does not control the sound.'));
  explorationContent.append(regionBlock, inspector);
  const layerCredit = element('p', 'amber-layer-credit', 'Globe layer: NASA Earth Observatory / Joshua Stevens, Suomi NPP VIIRS / Miguel Román, NASA GSFC. 2012 composite, independent of the audio year. Display brightness, not calibrated radiance. ');
  for (const [text, href] of [
    ['NASA source', 'https://science.nasa.gov/earth/earth-observatory/earth-at-night/maps/'],
    ['Layer manifest', '/data/globe-night-lights/manifest.json'],
  ]) {
    const link = element('a', '', text);
    link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer';
    layerCredit.append(link, document.createTextNode(' · '));
  }
  explorationContent.append(layerCredit);
  exploration.append(explorationSummary, explorationContent);

  const footer = element('footer', 'amber-footer');
  const controls = element('div', 'amber-controls');
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Globe view controls');
  const zoomOut = button('−', 'Zoom out', () => {model.zoomBy(1 / 1.15); update();}, 'amber-square');
  const zoomValue = element('output', 'amber-zoom', '100%');
  zoomValue.dataset.zoom = '';
  zoomValue.setAttribute('aria-label', 'Zoom level');
  const zoomIn = button('+', 'Zoom in', () => {model.zoomBy(1.15); update();}, 'amber-square');
  const rotateButton = button('Rotate', 'Start automatic rotation', () => {model.setAutoRotate(!model.autoRotate); update();}, 'amber-rotate');
  rotateButton.dataset.rotation = '';
  const reset = button('Reset view', 'Reset view', () => {model.reset(); update();});
  controls.append(zoomOut, zoomValue, zoomIn, element('span', 'amber-control-separator'), rotateButton, reset);
  const layerControl = element('div', 'amber-layer-control');
  const layerLabel = element('label', 'amber-layer-toggle');
  const layerInput = document.createElement('input');
  layerInput.type = 'checkbox';
  layerInput.checked = true;
  layerInput.dataset.nightLightsToggle = '';
  layerLabel.append(layerInput, element('span', '', 'NASA lights · 2012'));
  const layerStatus = element('span', 'amber-layer-status');
  layerStatus.setAttribute('role', 'status');
  layerStatus.setAttribute('aria-live', 'polite');
  layerStatus.dataset.nightLights = 'loading';
  layerControl.append(layerLabel, layerStatus);
  layerInput.addEventListener('change', applyNightLayer, {signal});
  footer.append(controls, layerControl, exploration);
  // Keep selection feedback outside the closed disclosure so keyboard users
  // still hear their selected coordinates while exploring the canvas.
  root.append(viewport, announcement, footer);
  host.append(root);

  async function applyNightLayer() {
    if (disposed || !renderer) return;
    renderer.setNightLights(layerInput.checked ? nightRaster : null);
    if (!layerInput.checked) {
      layerStatus.dataset.nightLights = 'off';
      layerStatus.textContent = 'Base map';
      layerCaption.textContent = 'Natural Earth · geographic base map';
      return;
    }
    if (nightRaster) {
      layerStatus.dataset.nightLights = 'ready';
      layerStatus.textContent = '2012 layer ready';
      layerCaption.textContent = 'NASA night lights · 2012';
      return;
    }
    layerStatus.dataset.nightLights = 'loading';
    layerStatus.textContent = 'Loading NASA layer…';
    if (nightLoading) return;
    nightLoading = true;
    try {
      const raster = await loadNightLights(signal);
      if (disposed) return;
      nightRaster = raster;
    } catch {
      if (disposed) return;
      layerStatus.dataset.nightLights = layerInput.checked ? 'error' : 'off';
      layerStatus.textContent = layerInput.checked ? 'Unavailable · base map. Toggle to retry.' : 'Base map';
      return;
    } finally { nightLoading = false; }
    void applyNightLayer();
  }

  function update() {
    if (disposed) return;
    const format = (value, positive, negative) => `${Math.abs(value).toFixed(2)}° ${value >= 0 ? positive : negative}`;
    const selection = model.selection;
    latOutput.textContent = selection ? format(selection.lat, 'N', 'S') : '—';
    lonOutput.textContent = selection ? format(selection.lon, 'E', 'W') : '—';
    const key = selection ? `${selection.lat.toFixed(5)},${selection.lon.toFixed(5)}` : '';
    if (key !== lastSelection) {
      announcement.textContent = selection ? `Selected point: ${latOutput.textContent}, ${lonOutput.textContent}.` : 'Select on the globe or choose a place.';
      lastSelection = key;
      if (selection) options.onSelect?.({...selection});
    }
    for (const region of regionButtons) region.node.setAttribute('aria-pressed', String(Boolean(selection && selection.lat === region.lat && selection.lon === region.lon)));
    zoomValue.textContent = `${Math.round(model.zoom * 100)}%`;
    zoomOut.disabled = model.zoom <= 0.72;
    zoomIn.disabled = model.zoom >= 2.1;
    const rotationLabel = model.autoRotate ? 'Pause rotation' : 'Rotate';
    rotateButton.textContent = rotationLabel;
    rotateButton.setAttribute('aria-label', rotationLabel);
    rotateButton.setAttribute('aria-pressed', String(model.autoRotate));
    rotateButton.disabled = model.reducedMotion || !renderer;
    renderer?.invalidate();
  }

  canvas.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const movement = {ArrowUp:[5,0], ArrowDown:[-5,0], ArrowLeft:[0,-5], ArrowRight:[0,5]}[event.key];
    if (movement) model.moveSelection(...movement);
    else if (event.key === '+' || event.key === '=') model.zoomBy(1.15);
    else if (event.key === '-') model.zoomBy(1 / 1.15);
    else if (event.key === 'Home') model.reset();
    else return;
    event.preventDefault();
    update();
  }, {signal});

  try { renderer = new GlobeRenderer(canvas, model, update); }
  catch (error) {
    unavailable.textContent = error.message;
    unavailable.hidden = false;
    canvas.setAttribute('aria-label', 'Coordinate exploration. Use arrow keys or the direction buttons.');
  }
  if (renderer) void applyNightLayer();
  else {
    layerInput.disabled = true;
    layerStatus.dataset.nightLights = 'error';
    layerStatus.textContent = 'Base map controls available';
  }
  update();
  return {
    select(point) {if (model.select(point, true)) update();},
    dispose() {
      disposed = true;
      abort.abort();
      renderer?.dispose();
      nightRaster = null;
      root.remove();
    },
  };
}
