import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import {access, mkdir, mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {basename, join, resolve, sep} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import {fileURLToPath} from 'node:url';

// Run with Node 24+ (native WebSocket), after npm run build. No autoplay-policy
// override is supplied: every Play is dispatched as an explicit user gesture.
assert.equal(typeof WebSocket, 'function', 'Use Node 24+ with native WebSocket');
const chromePath = process.env.CHROME_BIN ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await access(chromePath);
const dist = new URL('../dist/the-earth-information-jukebox/', import.meta.url);
const origin = 'http://127.0.0.1:47833';
const artifacts = resolve(process.env.SONIFICATION_SMOKE_ARTIFACTS ?? join(tmpdir(), 'earth-jukebox-sonification-smoke'));
await mkdir(artifacts, {recursive: true});
const profile = await mkdtemp(join(tmpdir(), 'earth-jukebox-cdp-'));
const server = spawn(process.execPath, [fileURLToPath(new URL('server/server.mjs', dist))], {
  env: {...process.env, HOST: '127.0.0.1', PORT: '47833'}, windowsHide: true,
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverErrors = '', chrome, cdp;
server.stderr.on('data', data => { serverErrors += data; });
server.stdout.resume();

class CDP {
  constructor(socket) {
    this.socket = socket;
    this.serial = 0;
    this.pending = new Map();
    this.errors = [];
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const request = this.pending.get(message.id);
        if (!request) return;
        this.pending.delete(message.id);
        clearTimeout(request.timeout);
        if (message.error) request.reject(new Error(JSON.stringify(message.error)));
        else request.resolve(message.result);
      } else if (message.method === 'Runtime.exceptionThrown') {
        this.errors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
      }
    });
    socket.addEventListener('close', () => {
      for (const request of this.pending.values()) {
        clearTimeout(request.timeout); request.reject(new Error('CDP closed'));
      }
      this.pending.clear();
    });
  }
  send(method, params = {}) {
    const id = ++this.serial;
    return new Promise((resolveRequest, reject) => {
      const timeout = setTimeout(() => { this.pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
      this.pending.set(id, {resolve: resolveRequest, reject, timeout});
      this.socket.send(JSON.stringify({id, method, params}));
    });
  }
  async evaluate(expression, userGesture = false) {
    const result = await this.send('Runtime.evaluate', {expression, userGesture, awaitPromise: true, returnByValue: true});
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    return result.result.value;
  }
}

function instrumentAudioAndReading() {
  const NativeContext = window.AudioContext;
  const stats = window.__sonificationSmoke = {
    contexts: [], voices: [], readings: [], canvasReads: [], errors: [],
    maximumAllocated: 0, maximumSimultaneous: 0,
  };
  window.addEventListener('error', event => stats.errors.push(event.message));
  const nativeGetImageData = CanvasRenderingContext2D.prototype.getImageData;
  CanvasRenderingContext2D.prototype.getImageData = function(...args) {
    const start = performance.now();
    const pixels = nativeGetImageData.apply(this, args);
    stats.canvasReads.push({width: pixels.width, height: pixels.height, milliseconds: performance.now() - start});
    return pixels;
  };
  window.AudioContext = class extends NativeContext {
    constructor(...args) {
      super(...args);
      const contextInfo = {context: this, master: null, analyser: super.createAnalyser()};
      contextInfo.analyser.fftSize = 2048;
      // A zero-gain monitoring branch pulls the real master signal without
      // changing the application's audible output or replacing its synthesis.
      const sink = super.createGain();
      sink.gain.value = 0;
      contextInfo.analyser.connect(sink);
      sink.connect(this.destination);
      stats.contexts.push(contextInfo);
      this.__smokeInfo = contextInfo;
    }
    createGain() {
      const gain = super.createGain();
      if (!this.__smokeInfo.master) {
        this.__smokeInfo.master = gain;
        gain.connect(this.__smokeInfo.analyser);
      }
      return gain;
    }
    createOscillator() {
      const oscillator = super.createOscillator();
      const voice = {context: this, start: Infinity, end: Infinity, frequencyHz: 0, ended: false, disconnected: false};
      stats.voices.push(voice);
      const nativeFrequency = oscillator.frequency.setValueAtTime.bind(oscillator.frequency);
      oscillator.frequency.setValueAtTime = (value, time) => { voice.frequencyHz = value; return nativeFrequency(value, time); };
      const nativeStart = oscillator.start.bind(oscillator);
      oscillator.start = time => {
        voice.start = time ?? this.currentTime;
        const simultaneous = stats.voices.filter(item => item.context === this && !item.disconnected && item.start <= voice.start && item.end > voice.start).length;
        stats.maximumSimultaneous = Math.max(stats.maximumSimultaneous, simultaneous);
        return nativeStart(time);
      };
      const nativeStop = oscillator.stop.bind(oscillator);
      oscillator.stop = time => { voice.end = time ?? this.currentTime; return nativeStop(time); };
      const nativeDisconnect = oscillator.disconnect.bind(oscillator);
      oscillator.disconnect = (...disconnectArgs) => { voice.disconnected = true; return nativeDisconnect(...disconnectArgs); };
      oscillator.addEventListener('ended', () => { voice.ended = true; });
      stats.maximumAllocated = Math.max(stats.maximumAllocated, stats.voices.filter(item => !item.disconnected).length);
      return oscillator;
    }
  };
  stats.snapshot = () => {
    const info = stats.contexts.at(-1);
    const signal = info ? new Float32Array(info.analyser.fftSize) : null;
    if (signal) info.analyser.getFloatTimeDomainData(signal);
    const rms = signal ? Math.sqrt(signal.reduce((sum, value) => sum + value * value, 0) / signal.length) : 0;
    return {
      contexts: stats.contexts.length, contextState: info?.context.state ?? null,
      masterGain: info?.master?.gain.value ?? null, rms,
      allocatedVoices: stats.voices.filter(voice => !voice.disconnected).length,
      liveVoices: stats.voices.filter(voice => !voice.disconnected && !voice.ended && voice.start <= voice.context.currentTime && voice.end > voice.context.currentTime).length,
      voiceCount: stats.voices.length, maximumAllocated: stats.maximumAllocated, maximumSimultaneous: stats.maximumSimultaneous,
      readings: stats.readings, canvasReads: stats.canvasReads,
      status: document.querySelector('.state[data-status]')?.dataset.status ?? null,
      frameId: document.querySelector('#scientific-frame')?.value ?? null,
      errors: stats.errors,
    };
  };
  let previousReading = '';
  new MutationObserver(() => {
    const text = document.querySelector('.reading p')?.textContent ?? '';
    const frameId = document.querySelector('#scientific-frame')?.value;
    const key = `${frameId}:${text}`;
    if (key === previousReading) return;
    previousReading = key;
    if (document.querySelector('.state[data-status]')?.dataset.status !== 'playing') return;
    const cellMatch = text.match(/^Cell (\d+):/);
    const frequencyMatch = text.match(/([\d.]+) Hz/);
    const marker = document.querySelector('.image-stage .cell');
    const info = stats.contexts.at(-1);
    if (!cellMatch || !frequencyMatch || !marker || !info) return;
    const now = info.context.currentTime;
    const voice = stats.voices.filter(item => item.context === info.context && item.start <= now && item.end > now).at(-1);
    if (!voice) return;
    const index = Number(cellMatch[1]) - 1;
    const x = Math.floor(Math.floor(index / 8) * 2048 / 24);
    const y = Math.floor((index % 8) * 1152 / 8);
    stats.readings.push({
      frameId, cell: index + 1, latencyMilliseconds: (now - voice.start) * 1000,
      textualFrequencyHz: Number(frequencyMatch[1]), oscillatorFrequencyHz: voice.frequencyHz,
      markerMatches: Math.abs(parseFloat(marker.style.left) - x * 100 / 2048) < 0.001
        && Math.abs(parseFloat(marker.style.top) - y * 100 / 1152) < 0.001,
    });
  }).observe(document, {subtree: true, childList: true, characterData: true});
}

async function waitFor(expression, description, milliseconds = 12000) {
  const deadline = Date.now() + milliseconds;
  while (Date.now() < deadline) {
    if (await cdp.evaluate(expression)) return;
    await delay(50);
  }
  throw new Error(`Timed out: ${description}; ${JSON.stringify(await snapshot())}`);
}
const snapshot = () => cdp.evaluate('window.__sonificationSmoke.snapshot()');
const statusIs = state => `document.querySelector('.state[data-status]')?.dataset.status === ${JSON.stringify(state)}`;
const click = selector => cdp.evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`, true);
const input = (selector, value, eventName = 'input') => cdp.evaluate(`(() => { const node = document.querySelector(${JSON.stringify(selector)}); node.value = ${JSON.stringify(String(value))}; node.dispatchEvent(new Event(${JSON.stringify(eventName)}, {bubbles:true})); })()`, true);
async function play() { await click('.transport .primary'); await waitFor(statusIs('playing'), 'playing state'); }
async function pause() { await click('.transport .primary'); await waitFor(statusIs('paused'), 'paused state'); await delay(80); }
async function select(year) {
  await input('#scientific-frame', `night-lights-${year}`, 'change');
  await waitFor(`${statusIs('ready')} && document.querySelector('.image-stage img')?.complete && document.querySelector('.image-stage img')?.naturalWidth === 2048`, `NASA ${year} decoded and ready`);
}
async function maxRms(milliseconds = 400) {
  let maximum = 0;
  const deadline = Date.now() + milliseconds;
  while (Date.now() < deadline) { maximum = Math.max(maximum, (await snapshot()).rms); await delay(30); }
  return maximum;
}
async function screenshot(name) {
  const capture = await cdp.send('Page.captureScreenshot', {format: 'png', captureBeyondViewport: false});
  await writeFile(join(artifacts, name), Buffer.from(capture.data, 'base64'));
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(`SSR server exited: ${serverErrors}`);
    try { if ((await fetch(origin)).ok) { ready = true; break; } } catch { /* Server starting. */ }
    await delay(100);
  }
  assert.ok(ready, 'Production SSR server must start');
  const manifest = await (await fetch(`${origin}/data/night-lights/manifest.json`)).json();
  for (const frame of manifest.frames) {
    const response = await fetch(new URL(frame.resourceUrl, origin));
    assert.equal(response.status, 200);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(createHash('sha256').update(bytes).digest('hex'), frame.sha256);
  }
  let chromeLogs = '';
  chrome = spawn(chromePath, [
    '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--window-size=1440,1000', 'about:blank',
  ], {windowsHide: true, stdio: ['ignore', 'ignore', 'pipe']});
  chrome.stderr.on('data', data => { chromeLogs += data; });
  for (let attempt = 0; attempt < 100 && !chromeLogs.includes('DevTools listening on'); attempt++) {
    if (chrome.exitCode !== null) throw new Error(`Chrome exited: ${chromeLogs}`);
    await delay(100);
  }
  const debuggingUrl = chromeLogs.match(/DevTools listening on (ws:\/\/[^\s]+)/)?.[1];
  assert.ok(debuggingUrl, `Chrome DevTools endpoint unavailable: ${chromeLogs}`);
  const debuggingPort = new URL(debuggingUrl).port;
  const targets = await (await fetch(`http://127.0.0.1:${debuggingPort}/json/list`)).json();
  const page = targets.find(target => target.type === 'page');
  assert.ok(page, 'Chrome page target must exist');
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolveOpen, reject) => { socket.addEventListener('open', resolveOpen, {once: true}); socket.addEventListener('error', reject, {once: true}); });
  cdp = new CDP(socket);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Performance.enable');
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: `(${instrumentAudioAndReading.toString()})();`});
  await cdp.send('Emulation.setDeviceMetricsOverride', {width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false});
  await cdp.send('Page.navigate', {url: origin});
  await waitFor(statusIs('ready'), 'initial verified NASA frame');
  await waitFor('document.querySelectorAll(".amber-canvas").length === 1', 'preserved observatory');
  assert.equal((await snapshot()).contexts, 0, 'Loading must not create an AudioContext');
  assert.ok((await snapshot()).canvasReads.some(read => read.width === 2048 && read.height === 1152), 'Loader must read real decoded pixels');
  await screenshot('desktop.png');
  console.log('PASS — real NASA assets/hash, canvas extraction, SSR/browser and no autoplay');

  for (let cycle = 0; cycle < 10; cycle++) {
    await select(cycle % 2 ? 2023 : 2012);
    await play();
    await delay(120);
    await pause();
    const current = await snapshot();
    assert.equal(current.contexts, 1);
    assert.equal(current.allocatedVoices, 0, `Cycle ${cycle + 1}: no allocated voice after pause`);
    assert.equal(current.liveVoices, 0);
    assert.equal(current.status, 'paused');
  }
  console.log('PASS — ten Play/Pause cycles and source changes; one context, zero orphan voices');

  await select(2012);
  await input('#audio-volume', 20);
  await play();
  const quietRms = await maxRms(650);
  await pause();
  await input('#sweep-position', 0);
  await input('#audio-volume', 80);
  await play();
  const loudRms = await maxRms(650);
  assert.ok(quietRms > 0.00001 && loudRms > quietRms * 2.5 && loudRms < quietRms * 6, `Volume affects the real signal: quiet=${quietRms}, loud=${loudRms}`);
  await click('.transport button:nth-child(3)');
  await delay(150);
  const mutedRms = await maxRms(300);
  assert.ok(mutedRms < 0.000001, `Mute must silence the actual master signal: ${mutedRms}`);
  assert.equal((await snapshot()).contextState, 'running');
  await click('.transport button:nth-child(3)');
  await delay(100);
  assert.ok(await maxRms() > 0.00001, 'Unmute must restore the real signal');
  await input('#audio-speed', 2, 'change');
  await waitFor(statusIs('paused'), 'speed change pauses');
  await input('#sweep-position', 4.8);
  assert.match(await cdp.evaluate('document.querySelector(".reading p").textContent'), /Cell 21:/);
  await play();
  await delay(550);
  const speedStarts = await cdp.evaluate('window.__sonificationSmoke.voices.slice(-4).map(voice => voice.start)');
  const speedIntervals = speedStarts.slice(1).map((time, index) => time - speedStarts[index]);
  assert.ok(speedIntervals.every(interval => Math.abs(interval - 0.12) < 0.003), `2× event spacing: ${speedIntervals}`);
  await pause();
  assert.ok(await maxRms(200) < 0.000001, 'Pause must silence the actual output');
  await input('#sweep-position', 45.84);
  await play();
  await waitFor(statusIs('ended'), 'end of spatial sweep');
  console.log('PASS — real waveform, volume, mute/unmute, speed, seek and ended state');

  await select(2023);
  await input('#audio-speed', 1, 'change');
  await input('#audio-volume', 30);
  const performanceStart = await cdp.send('Performance.getMetrics');
  const sampleStart = Date.now();
  await play();
  for (let checkpoint = 1; checkpoint <= 3; checkpoint++) {
    const target = sampleStart + checkpoint * 20000;
    while (Date.now() < target) {
      const current = await snapshot();
      if (current.status === 'ended') await play();
      else assert.equal(current.status, 'playing', '60-second sample must keep playing');
      await delay(250);
    }
    console.log(`Progress — ${checkpoint * 20}/60 seconds of real audio-clock/text/marker sampling`);
  }
  await pause();
  const performanceEnd = await cdp.send('Performance.getMetrics');
  const sample = await snapshot();
  assert.ok(sample.readings.length >= 200, `Trace must include real executed readings: ${sample.readings.length}`);
  const maximumLatencyMilliseconds = Math.max(...sample.readings.map(reading => reading.latencyMilliseconds));
  assert.ok(maximumLatencyMilliseconds <= 100, `Audio-clock to DOM text latency exceeds 100 ms: ${maximumLatencyMilliseconds}`);
  assert.ok(sample.readings.every(reading => reading.markerMatches), 'Every traced marker must match its textual cell');
  assert.ok(sample.readings.every(reading => Math.abs(reading.textualFrequencyHz - reading.oscillatorFrequencyHz) < 0.06), 'Text and actual oscillator frequency must agree');
  assert.ok(sample.maximumAllocated <= 4 && sample.maximumSimultaneous <= 4, 'Audio nodes and simultaneous voices must remain bounded');
  assert.equal(sample.allocatedVoices, 0);
  assert.equal(sample.contexts, 1);

  const beforeGlobe = sample.voiceCount;
  await click('.amber-destination[aria-label="Explore Amazon"]');
  await waitFor('document.querySelector(".audio-panel details").textContent.includes("Last globe point: -3°")', 'Angular receives globe point');
  await cdp.evaluate('document.querySelector(".amber-canvas").focus()', true);
  await cdp.send('Input.dispatchKeyEvent', {type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight'});
  await cdp.send('Input.dispatchKeyEvent', {type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight'});
  await waitFor('document.querySelector(".audio-panel details").textContent.includes("-55°")', 'globe keyboard movement');
  await click('.amber-button[aria-label="Zoom in"]');
  assert.equal((await snapshot()).voiceCount, beforeGlobe, 'Geographic selection must not synthesize unverified scientific audio');
  await cdp.send('Emulation.setDeviceMetricsOverride', {width: 320, height: 900, deviceScaleFactor: 1, mobile: true});
  await delay(150);
  assert.equal(await cdp.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth'), true, '320px viewport must have no horizontal overflow');
  await cdp.evaluate('document.querySelector("#sonification").scrollIntoView()');
  await screenshot('mobile-320.png');
  assert.deepEqual(cdp.errors, []);
  assert.deepEqual(sample.errors, []);
  assert.doesNotMatch(serverErrors, /ReferenceError|ERROR|Unhandled/i);
  const metrics = result => Object.fromEntries(result.metrics.map(metric => [metric.name, metric.value]));
  const before = metrics(performanceStart), after = metrics(performanceEnd);
  const report = {
    measuredOn: new Date().toISOString(), origin,
    browser: await cdp.send('Browser.getVersion'),
    sampleDurationSeconds: (Date.now() - sampleStart) / 1000,
    maximumLatencyMilliseconds, signal: {quietRms, loudRms, mutedRms},
    cpuTaskDurationSeconds: after.TaskDuration - before.TaskDuration,
    jsHeapUsedBytes: after.JSHeapUsedSize,
    ...sample,
    limitations: ['Human listening PENDING: a signal measurement does not prove physical audibility.', 'Screen-reader and physical mobile-device validation remain pending.', 'Navigation closes the page; Coordinator teardown is covered by unit tests.'],
  };
  await writeFile(join(artifacts, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  await cdp.send('Page.navigate', {url: 'about:blank'});
  console.log(`PASS — 60s trace (${sample.readings.length} readings, max ${maximumLatencyMilliseconds.toFixed(2)} ms), globe preserved, mobile320; artifacts: ${artifacts}`);
  console.log('AUDITORY VALIDATION PENDING — real signal was measured; human listening and assistive review remain necessary.');
} finally {
  if (cdp) { try { await cdp.send('Browser.close'); } catch { /* Closing Chrome also closes CDP. */ } }
  if (chrome && chrome.exitCode === null) {
    await Promise.race([new Promise(resolveExit => chrome.once('exit', resolveExit)), delay(2000)]);
    if (chrome.exitCode === null && chrome.signalCode === null) {
      if (process.platform === 'win32') {
        const killer = spawn('taskkill.exe', ['/PID', String(chrome.pid), '/T', '/F'], {windowsHide: true, stdio: 'ignore'});
        await new Promise(resolveExit => killer.once('exit', resolveExit));
      } else chrome.kill('SIGKILL');
    }
  }
  if (server.exitCode === null && server.signalCode === null) server.kill();
  if (server.exitCode === null && server.signalCode === null) await new Promise(resolveExit => server.once('exit', resolveExit));
  // Only remove the unique, explicitly created Chrome profile below os.tmpdir.
  assert.ok(resolve(profile).startsWith(resolve(tmpdir()) + sep) && basename(profile).startsWith('earth-jukebox-cdp-'));
  await rm(profile, {recursive: true, force: true, maxRetries: 5, retryDelay: 100});
}
