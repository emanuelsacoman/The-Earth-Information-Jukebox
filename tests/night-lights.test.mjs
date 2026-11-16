import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {sampleNightLight, NIGHT_LIGHTS, loadNightLights} from '../src/app/view/screen-components/planet-earth/night-lights.mjs';
import {project,unproject} from '../src/app/view/screen-components/planet-earth/globe-core.mjs';
import {decodeRgbPng} from './helpers/png.mjs';

test('PixelIsArea centers, north/south orientation and antimeridian interpolation',()=>{
  const raster={width:4,height:2,data:new Uint8Array([10,20,30,40,50,60,70,80])}; // synthetic test fixture
  assert.equal(sampleNightLight(raster,45,-135),10);
  assert.equal(sampleNightLight(raster,-45,135),80);
  assert.equal(sampleNightLight(raster,0,-135),30);
  assert.equal(sampleNightLight(raster,45,180),25);
  assert.equal(sampleNightLight(raster,45,-180),25);
  assert.equal(sampleNightLight(raster,90,-135),10);
  assert.equal(sampleNightLight(raster,-90,-135),50);
  assert.equal(sampleNightLight(raster,NaN,0),0);
});

test('qualified NASA asset, GeoTIFF transform and distributed geographic control patches',async()=>{
  const manifest=JSON.parse(await readFile(new URL('../public/data/globe-night-lights/manifest.json',import.meta.url)));
  const bytes=await readFile(new URL('../public'+NIGHT_LIGHTS.url,import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),NIGHT_LIGHTS.sha256);
  assert.equal(bytes.length,manifest.derivative.bytes);
  assert.deepEqual(manifest.source.pixelScale,[0.1,0.1,0]);
  assert.deepEqual(manifest.source.tiePoint,[0,0,0,-180,90,0]);
  assert.equal(manifest.source.inlineGeoKeys['2048'],4326);
  assert.equal(manifest.source.inlineGeoKeys['1025'],1);
  const raster=decodeRgbPng(bytes);
  assert.equal(raster.width,1800); assert.equal(raster.height,900);
  // Reference coordinates identify patches, not inferred cities or a physical quantity.
  for(const [name,lat,lon] of [['New York',40.71,-74.01],['London',51.5,-0.12],['Tokyo',35.68,139.69],['Sao Paulo',-23.55,-46.63],['Sydney',-33.87,151.21],['Cairo',30.04,31.24]]) {
    let maximum=0;
    for(let dy=-0.4;dy<=0.4;dy+=0.1) for(let dx=-0.4;dx<=0.4;dx+=0.1) maximum=Math.max(maximum,sampleNightLight(raster,lat+dy,lon+dx));
    assert.ok(maximum>60,`${name} must coincide with a bright source patch, got ${maximum}`);
    const center={lat,lon};
    const p=project({lat,lon},center), recovered=unproject(p.x,p.y,center);
    assert.ok(Math.abs(sampleNightLight(raster,lat,lon)-sampleNightLight(raster,recovered.lat,recovered.lon))<1e-8);
  }
  assert.equal(sampleNightLight(raster,0,-140),0,'The central Pacific is not filled with invented lights');
});

test('loader rejects HTTP/integrity failure before bitmap decode',async()=>{
  const nativeFetch=globalThis.fetch;
  try {
    globalThis.fetch=async()=>({ok:false});
    await assert.rejects(loadNightLights(new AbortController().signal),/unavailable/);
    globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>new Uint8Array([1,2,3]).buffer});
    await assert.rejects(loadNightLights(new AbortController().signal),/integrity/);
  } finally {globalThis.fetch=nativeFetch;}
});
