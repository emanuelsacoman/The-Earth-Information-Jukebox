import {GlobeModel} from './globe-core.mjs';
import {GlobeRenderer} from './globe-renderer.mjs';

let instanceId = 0;
const destinations = [
  ['Amazônia', -3, -60], ['Atlântico', 5, -30],
  ['Saara', 23, 13], ['Japão', 36, 138], ['Antártida', -80, 0],
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
  root.setAttribute('aria-label', 'Observatório Âmbar — exploração livre da Terra');
  const helpId = `amber-help-${++instanceId}`;
  let renderer = null, disposed = false, lastSelection = '';
  const button = (text, title, handler, className = '') => {
    const node = element('button', `amber-button ${className}`, text);
    node.type = 'button';
    node.setAttribute('aria-label', title);
    node.title = title;
    node.addEventListener('click', handler, {signal});
    return node;
  };

  const header = element('header', 'amber-header');
  const brand = element('div', 'amber-brand');
  const symbol = element('span', 'amber-brand-symbol', '◉');
  symbol.setAttribute('aria-hidden', 'true');
  const brandText = element('div');
  brandText.append(element('span', 'amber-brand-name', 'EARTH JUKEBOX'), element('span', 'amber-brand-sub', 'OBSERVATÓRIO ÂMBAR'));
  brand.append(symbol, brandText);
  const mode = element('div', 'amber-mode');
  mode.append(element('span', 'amber-status-dot'), element('span', '', 'EXPLORAÇÃO LIVRE'));
  header.append(brand, mode);

  const layout = element('div', 'amber-layout');
  const intro = element('aside', 'amber-intro');
  intro.append(element('p', 'amber-eyebrow', '01 / NOSSO PLANETA'), element('h1', 'amber-title', 'Uma nova perspectiva da Terra.'), element('p', 'amber-description', 'Gire o mundo. Aproxime o olhar. Escolha onde explorar.'));
  const regionBlock = element('div', 'amber-regions');
  regionBlock.append(element('h2', 'amber-label', 'PONTOS DE PARTIDA'));
  const regionButtons = [];
  for (const [name, lat, lon] of destinations) {
    const node = button(name, `Explorar ${name}`, () => {
      model.select({lat, lon}, true);
      update();
    }, 'amber-destination');
    node.setAttribute('aria-pressed', 'false');
    regionButtons.push({node, lat, lon});
    regionBlock.append(node);
  }
  intro.append(regionBlock, element('p', 'amber-aside-note', 'Um mundo para descobrir, um ponto de cada vez.'));

  const viewport = element('div', 'amber-viewport');
  const canvas = element('canvas', 'amber-canvas');
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'application');
  canvas.setAttribute('aria-label', 'Globo interativo. Use setas para selecionar, mais e menos para zoom e Home para restaurar.');
  canvas.setAttribute('aria-describedby', helpId);
  const viewportTop = element('div', 'amber-viewport-caption');
  viewportTop.append(element('span', '', 'TERRA / VISTA ORBITAL'), element('span', '', 'MAPA-BASE GEOGRÁFICO'));
  const hint = element('p', 'amber-hint', 'ARRASTE PARA GIRAR  ·  CLIQUE PARA SELECIONAR');
  hint.id = helpId;
  const unavailable = element('p', 'amber-fallback');
  unavailable.hidden = true;
  unavailable.setAttribute('role', 'status');
  viewport.append(canvas, viewportTop, hint, unavailable);

  const inspector = element('aside', 'amber-inspector');
  inspector.setAttribute('aria-label', 'Ponto selecionado');
  inspector.append(element('p', 'amber-eyebrow', 'LOCALIZADOR'), element('h2', 'amber-inspector-title', 'Seu próximo ponto.'));
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
  const announcement = element('p', 'amber-selection-state', 'Selecione um ponto no globo ou escolha um destino.');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  const navigation = element('div', 'amber-direction-pad');
  navigation.setAttribute('role', 'group');
  navigation.setAttribute('aria-label', 'Mover o ponto selecionado');
  for (const [glyph, label, dLat, dLon] of [['↑','Mover ponto para norte',5,0], ['←','Mover ponto para oeste',0,-5], ['↓','Mover ponto para sul',-5,0], ['→','Mover ponto para leste',0,5]]) {
    navigation.append(button(glyph, label, () => {model.moveSelection(dLat, dLon); update();}));
  }
  const motionLabel = element('label', 'amber-motion');
  const motionInput = document.createElement('input');
  motionInput.type = 'checkbox';
  motionInput.checked = media.matches;
  model.setReducedMotion(media.matches);
  motionLabel.append(motionInput, element('span', '', 'Reduzir movimento'));
  motionInput.addEventListener('change', () => {model.setReducedMotion(motionInput.checked || media.matches); update();}, {signal});
  media.addEventListener('change', () => {model.setReducedMotion(motionInput.checked || media.matches); update();}, {signal});
  inspector.append(readout, announcement, navigation, motionLabel, element('p', 'amber-inspector-note', 'Coordenadas geográficas. Sem camada científica ou reprodução de áudio nesta versão.'));
  layout.append(intro, viewport, inspector);

  const footer = element('footer', 'amber-footer');
  const footerText = element('div', 'amber-footer-caption');
  footerText.append(element('span', 'amber-label', 'CONTROLE DE VISTA'), element('span', 'amber-small', 'O planeta é seu ponto de partida.'));
  const controls = element('div', 'amber-controls');
  const zoomOut = button('−', 'Afastar', () => {model.zoomBy(1 / 1.15); update();}, 'amber-square');
  const zoomValue = element('output', 'amber-zoom', '100%');
  zoomValue.dataset.zoom = '';
  zoomValue.setAttribute('aria-label', 'Nível de zoom');
  const zoomIn = button('+', 'Aproximar', () => {model.zoomBy(1.15); update();}, 'amber-square');
  const rotateButton = button('Ativar rotação', 'Ativar rotação automática', () => {model.setAutoRotate(!model.autoRotate); update();}, 'amber-rotate');
  rotateButton.dataset.rotation = '';
  const reset = button('Restaurar vista', 'Restaurar vista', () => {model.reset(); update();});
  controls.append(zoomOut, zoomValue, zoomIn, element('span', 'amber-control-separator'), rotateButton, reset);
  const credit = element('div', 'amber-credit');
  credit.append(element('span', '', 'GEOGRAFIA / NATURAL EARTH'), element('span', 'amber-small', 'MVP · 01'));
  footer.append(footerText, controls, credit);
  root.append(header, layout, footer);
  host.append(root);

  function update() {
    if (disposed) return;
    const format = (value, positive, negative) => `${Math.abs(value).toFixed(2)}° ${value >= 0 ? positive : negative}`;
    const selection = model.selection;
    latOutput.textContent = selection ? format(selection.lat, 'N', 'S') : '—';
    lonOutput.textContent = selection ? format(selection.lon, 'L', 'O') : '—';
    const key = selection ? `${selection.lat.toFixed(5)},${selection.lon.toFixed(5)}` : '';
    if (key !== lastSelection) {
      announcement.textContent = selection ? `Ponto selecionado: ${latOutput.textContent}, ${lonOutput.textContent}.` : 'Selecione um ponto no globo ou escolha um destino.';
      lastSelection = key;
      if (selection) options.onSelect?.({...selection});
    }
    for (const region of regionButtons) region.node.setAttribute('aria-pressed', String(Boolean(selection && selection.lat === region.lat && selection.lon === region.lon)));
    zoomValue.textContent = `${Math.round(model.zoom * 100)}%`;
    zoomOut.disabled = model.zoom <= 0.72;
    zoomIn.disabled = model.zoom >= 2.1;
    rotateButton.textContent = model.autoRotate ? 'Pausar rotação' : 'Ativar rotação';
    rotateButton.setAttribute('aria-label', model.autoRotate ? 'Pausar rotação automática' : 'Ativar rotação automática');
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
    canvas.setAttribute('aria-label', 'Exploração por coordenadas. Use setas ou os botões de direção.');
  }
  update();
  return {
    select(point) {if (model.select(point, true)) update();},
    dispose() {
      disposed = true;
      abort.abort();
      renderer?.dispose();
      root.remove();
    },
  };
}
