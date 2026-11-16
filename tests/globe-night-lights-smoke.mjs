import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,basename,sep} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import {fileURLToPath} from 'node:url';
import {decodeRgbPng} from './helpers/png.mjs';
import {sampleNightLight,NIGHT_LIGHTS} from '../src/app/view/screen-components/planet-earth/night-lights.mjs';
import {unproject} from '../src/app/view/screen-components/planet-earth/globe-core.mjs';

const origin='http://127.0.0.1:47835';
const artifacts=resolve(process.env.GLOBE_SMOKE_ARTIFACTS??join(tmpdir(),'earth-jukebox-globe-night-lights'));
await mkdir(artifacts,{recursive:true});
const profile=await mkdtemp(join(tmpdir(),'earth-jukebox-globe-'));
const server=spawn(process.execPath,[fileURLToPath(new URL('../dist/the-earth-information-jukebox/server/server.mjs',import.meta.url))],{env:{...process.env,PORT:'47835',HOST:'127.0.0.1'},windowsHide:true,stdio:['ignore','ignore','pipe']});
let chrome,cdp,serverErrors='';
server.stderr.on('data',data=>serverErrors+=data);
class CDP {
  constructor(socket) {
    this.socket = socket;
    this.serial = 0;
    this.pending = new Map();
    this.errors = [];
    this.handlers = new Map();
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
      this.handlers.get(message.method)?.(message.params);
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
async function wait(expression,label) {
  for(let i=0;i<200;i++){if(await cdp.evaluate(expression))return;await delay(50);}
  throw new Error('Timed out: '+label+'; focus='+await cdp.evaluate('document.activeElement.outerHTML'));
}
const click=selector=>cdp.evaluate('document.querySelector('+JSON.stringify(selector)+').click()',true);
async function capture(name){const result=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(join(artifacts,name),Buffer.from(result.data,'base64'));}
async function layer(enabled) {
  await cdp.evaluate('(()=>{const node=document.querySelector("[data-night-lights-toggle]");if(node.checked!=='+enabled+')node.click()})()',true);
  await wait('document.querySelector("[data-night-lights]").dataset.nightLights==='+JSON.stringify(enabled?'ready':'off'),'layer state');
  await delay(100);
}
const instrument=`(() => {
  const stats=window.__globeQA={timings:[],paintCount:0,decodes:0,layerReads:0};
  const clear=CanvasRenderingContext2D.prototype.clearRect,put=CanvasRenderingContext2D.prototype.putImageData,get=CanvasRenderingContext2D.prototype.getImageData;
  let start=0;
  CanvasRenderingContext2D.prototype.clearRect=function(...args){if(this.canvas.classList.contains('amber-canvas'))start=performance.now();return clear.apply(this,args);};
  CanvasRenderingContext2D.prototype.putImageData=function(data,...args){if(data.width===440&&data.height===440){stats.lastSurface=data;stats.paintCount++;stats.timings.push(performance.now()-start);if(stats.timings.length>512)stats.timings.shift();}return put.call(this,data,...args);};
  CanvasRenderingContext2D.prototype.getImageData=function(...args){if(args[2]===1800&&args[3]===900)stats.layerReads++;return get.apply(this,args);};
})();`;
try {
  for(let i=0;i<100;i++){try{if((await fetch(origin)).ok)break;}catch{}await delay(100);}
  let logs='';
  chrome=spawn(process.env.CHROME_BIN??'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--remote-debugging-port=0','--user-data-dir='+profile,'--no-first-run','--no-default-browser-check','about:blank'],{windowsHide:true,stdio:['ignore','ignore','pipe']});
  chrome.stderr.on('data',data=>logs+=data);
  for(let i=0;i<100&&!logs.includes('DevTools listening on');i++)await delay(100);
  const debugging=logs.match(/DevTools listening on (ws:\/\/[^\s]+)/)?.[1];
  assert.ok(debugging,logs);
  const targets=await(await fetch('http://127.0.0.1:'+new URL(debugging).port+'/json/list')).json();
  const socket=new WebSocket(targets.find(target=>target.type==='page').webSocketDebuggerUrl);
  await new Promise((accept,reject)=>{socket.addEventListener('open',accept,{once:true});socket.addEventListener('error',reject,{once:true});});
  cdp=new CDP(socket);
  await cdp.send('Page.enable');await cdp.send('Runtime.enable');await cdp.send('Performance.enable');await cdp.send('Network.enable');
  let layerRequests=0;
  cdp.handlers.set('Network.requestWillBeSent',({request})=>{if(request.url.endsWith('/black-marble-2012.png'))layerRequests++;});
  await cdp.send('Page.addScriptToEvaluateOnNewDocument',{source:instrument});
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:origin});
  await wait('document.querySelector("[data-night-lights]")?.dataset.nightLights==="ready"','real verified layer');
  await click('[aria-label="Close science panel"]');
  await layer(false); await capture('globe-layer-off.png');
  await layer(true); await capture('globe-layer-on.png');
  const raster=decodeRgbPng(await readFile(new URL('../public'+NIGHT_LIGHTS.url,import.meta.url)));
  const alignment=[];
  for(const [name,lat,lon] of [['Japan',36,138],['Sahara',23,13],['Amazon',-3,-60]]) {
    await cdp.evaluate('document.querySelector(".amber-explore").open=true');
    await click('[aria-label="Explore '+name+'"]');
    await cdp.evaluate('document.querySelector(".amber-explore").open=false');
    await layer(false);
    const before=await cdp.evaluate('Array.from(window.__globeQA.lastSurface.data)');
    await layer(true);
    const after=await cdp.evaluate('Array.from(window.__globeQA.lastSurface.data)');
    let checked=0,zeroSource=0,maxError=0,worst=null;
    for(let row=30;row<410;row+=13) for(let col=30;col<410;col+=13) {
      const x=(col+.5)/220-1,y=1-(row+.5)/220,z2=1-x*x-y*y;
      if(z2<=0)continue;
      const point=unproject(x,y,{lat,lon}),brightness=Math.pow(Math.round(sampleNightLight(raster,point.lat,point.lon))/255,.85)*.9,fade=.65+Math.sqrt(z2)*.35;
      const index=(row*440+col)*4;
      for(const [channel,baseScale,gain] of [[0,.42,245],[1,.42,205],[2,.55,125]]) {
        const error=Math.abs(after[index+channel]-(before[index+channel]*baseScale*(1-brightness)+brightness*gain*fade));
        if(error>maxError){maxError=error;worst={row,col,point,brightness,channel,before:before[index+channel],after:after[index+channel]};}
      }
      checked++;if(brightness===0)zeroSource++;
    }
    assert.ok(maxError<=1.1,name+' texture shifted or mismatched: '+maxError+' '+JSON.stringify(worst));
    assert.ok(zeroSource>50,'Unlit source patches must remain unlit');
    alignment.push({center:{lat,lon},checked,zeroSource,maxChannelError:maxError});
    await capture('globe-'+name.toLowerCase()+'.png');
    await click('[aria-label="Zoom in"]'); await delay(100);
    assert.equal(await cdp.evaluate('document.querySelector("[data-coordinate=lat]").textContent.includes('+JSON.stringify(Math.abs(lat).toFixed(2))+')'),true,'Zoom preserves selection');
    await capture('globe-'+name.toLowerCase()+'-zoom.png');
    await click('[aria-label="Reset view"]');
  }
  const performanceRuns=[];
  for(const enabled of [false,true]) {
    await layer(enabled);await cdp.evaluate('window.__globeQA.timings=[]');
    await click('[data-rotation]');await delay(4000);await click('[data-rotation]');
    const timings=await cdp.evaluate('window.__globeQA.timings.slice()');
    timings.sort((a,b)=>a-b);
    const p95=timings[Math.floor(timings.length*.95)];
    assert.ok(timings.length>=40,'Rotation renders enough real frames');
    assert.ok(p95<40,'Surface paint must stay within measured desktop budget: '+p95);
    performanceRuns.push({enabled,frames:timings.length,medianMs:timings[Math.floor(timings.length*.5)],p95Ms:p95});
  }
  await cdp.send('HeapProfiler.collectGarbage');
  const heap=async()=>{const metrics=await cdp.send('Performance.getMetrics');return metrics.metrics.find(metric=>metric.name==='JSHeapUsedSize').value;};
  const heapBefore=await heap();
  for(let i=0;i<40;i++){await layer(i%2===0);}
  await cdp.send('HeapProfiler.collectGarbage');const heapAfter=await heap();
  assert.ok(heapAfter-heapBefore<1500000,'Repeated toggles must not grow retained raster memory');
  assert.equal(layerRequests,1,'Toggles and rotation reuse one fetched raster');
  assert.equal(await cdp.evaluate('window.__globeQA.layerReads'),1,'The raster is decoded/read once');
  await layer(true);
  await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await wait('document.querySelector("[data-rotation]").disabled','reduced-motion media change');
  await capture('globe-reduced-motion.png');
  await cdp.send('Emulation.setEmulatedMedia',{features:[]});
  await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.setBlockedURLs',{urls:['*black-marble-2012.png']});
  await cdp.send('Page.navigate',{url:origin});
  await wait('document.querySelector("[data-night-lights]")?.dataset.nightLights==="error"','layer request failure fallback');
  await capture('globe-layer-error.png');
  await cdp.evaluate('document.querySelector(".amber-explore").open=true');await click('[aria-label="Explore Japan"]');
  await wait('document.querySelector("[data-coordinate=lat]").textContent.includes("36.00")','fallback selection');
  await cdp.send('Network.setBlockedURLs',{urls:[]});
  await layer(false);await layer(true);
  await capture('globe-layer-recovered.png');
  assert.deepEqual(cdp.errors,[]);assert.doesNotMatch(serverErrors,/ReferenceError|Unhandled|ERROR/);
  const report={measuredOn:new Date().toISOString(),alignment,performanceRuns,heapBefore,heapAfter,retainedHeapGrowth:heapAfter-heapBefore,initialLayerRequests:1,rasterBytes:1800*900,layerFailureRecovered:true,limitations:['Desktop emulation; physical mobile, native 200% zoom, screen-reader review and human listening remain pending.','Heap and CPU measurements cover this controlled sample, not a universal performance guarantee.']};
  await writeFile(join(artifacts,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log('PASS globe raster alignment/rotation/zoom/cache/fallback/performance: '+JSON.stringify(report));
} finally {
  if(cdp){try{await cdp.send('Browser.close');}catch{}}
  if(chrome&&chrome.exitCode===null){await Promise.race([new Promise(done=>chrome.once('exit',done)),delay(2000)]);if(chrome.exitCode===null&&chrome.signalCode===null)chrome.kill();}
  if(server.exitCode===null&&server.signalCode===null){server.kill();await new Promise(done=>server.once('exit',done));}
  assert.ok(resolve(profile).startsWith(resolve(tmpdir())+sep)&&basename(profile).startsWith('earth-jukebox-globe-'));
  await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}

