import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {fileURLToPath} from 'node:url';

const dist = new URL('../dist/the-earth-information-jukebox/', import.meta.url);
const prerendered = await readFile(new URL('browser/index.html', dist), 'utf8');
assert.match(prerendered, /<app-planet-earth[\s>]/, 'Prerender must include the Angular Earth component');
assert.match(prerendered, /Preparing the Earth observatory/, 'Prerender must provide server-rendered content');
assert.match(prerendered, /<app-audio-panel[\s>]/, 'Prerender must include the sonification panel');
assert.match(prerendered, /Night lights/);
assert.doesNotMatch(prerendered, /ReferenceError|window is not defined|document is not defined/);
await access(new URL('server/server.mjs', dist));

// Call the compiled renderer directly: CommonEngine can return cached prerendered HTML.
const {renderApplication} = await import(new URL('server/render-utils.server.mjs', dist));
const {default: bootstrap} = await import(new URL('server/main.server.mjs', dist));
const template = await readFile(new URL('server/index.server.html', dist), 'utf8');
let bootstrapCalled = false;
const rendered = await renderApplication(context => {
  bootstrapCalled = true;
  assert.ok(context?.platformRef, 'Runtime SSR must provide a platform context');
  return bootstrap(context);
}, {document: template, url: 'http://127.0.0.1/'});
assert.equal(bootstrapCalled, true, 'Runtime SSR must invoke the compiled bootstrap');
assert.doesNotMatch(rendered, /ng-server-context="ssg"/, 'This check must not use cached prerendered HTML');
assert.match(rendered, /<app-planet-earth[\s>]/);
assert.match(rendered, /Preparing the Earth observatory/);
assert.match(rendered, /<app-audio-panel[\s>]/);
assert.match(rendered, /Night lights/);

const port = 47831;
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [fileURLToPath(new URL('server/server.mjs', dist))], {
  env: {...process.env, PORT: String(port), HOST: '127.0.0.1'},
  stdio: ['ignore', 'pipe', 'pipe'],
});
let stdout = '', stderr = '';
server.stdout.on('data', data => stdout += data.toString());
server.stderr.on('data', data => stderr += data.toString());
try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    if (server.exitCode !== null) throw new Error(`Server exited: ${stderr}`);
    if (stdout.includes(`http://127.0.0.1:${port}`)) {ready = true; break;}
    await delay(100);
  }
  assert.ok(ready, 'Production server must start within eight seconds');
  const response = await fetch(origin);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.equal(response.headers.get('cache-control'), null, 'The root must exercise runtime SSR, not the one-year static asset cache');
  const html = await response.text();
  assert.match(html, /<app-planet-earth[\s>]/);
  assert.match(html, /<app-audio-panel[\s>]/);
  const manifest = await (await fetch(`${origin}/data/night-lights/manifest.json`)).json();
  for (const frame of manifest.frames) {
    const asset = await fetch(new URL(frame.resourceUrl, origin));
    assert.equal(asset.status, 200);
    assert.match(asset.headers.get('content-type'), /image\/png/);
    assert.equal((await asset.arrayBuffer()).byteLength, frame.bytes);
  }
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1]);
  assert.ok(scripts.length > 0, 'Angular scripts must be present');
  for (const path of scripts) {
    const asset = await fetch(new URL(path, origin));
    assert.equal(asset.status, 200, `Missing production script: ${path}`);
    assert.match(asset.headers.get('content-type'), /javascript/);
  }
  assert.doesNotMatch(stderr, /ReferenceError|ERROR|Unhandled/i);
  console.log(`PASS — Angular prerender, production server and ${scripts.length} JavaScript assets`);
} finally {
  server.kill();
  await new Promise(resolve => {
    if (server.exitCode !== null) resolve();
    else server.once('exit', resolve);
  });
}
