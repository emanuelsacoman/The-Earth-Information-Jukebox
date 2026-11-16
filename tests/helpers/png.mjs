import assert from 'node:assert/strict';
import {inflateSync} from 'node:zlib';

// Small test-only PNG RGB8 decoder; hashes are verified separately. This does
// not participate in the browser loader or scientific processing pipeline.
export function decodeRgbPng(bytes) {
  assert.equal(bytes.subarray(0,8).toString('hex'), '89504e470d0a1a0a');
  const width=bytes.readUInt32BE(16), height=bytes.readUInt32BE(20);
  assert.equal(bytes[24],8); assert.equal(bytes[25],2); assert.equal(bytes[28],0);
  const chunks=[];
  for(let offset=8;offset<bytes.length;) {
    const size=bytes.readUInt32BE(offset), type=bytes.toString('ascii',offset+4,offset+8);
    if(type==='IDAT') chunks.push(bytes.subarray(offset+8,offset+8+size));
    offset+=size+12;
  }
  const raw=inflateSync(Buffer.concat(chunks)), stride=width*3;
  const rgb=new Uint8Array(stride*height);
  const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
  for(let y=0;y<height;y++) {
    const filter=raw[y*(stride+1)];
    assert.ok(filter<=4);
    for(let x=0;x<stride;x++) {
      const i=y*stride+x,a=x>=3?rgb[i-3]:0,b=y?rgb[i-stride]:0,c=y&&x>=3?rgb[i-stride-3]:0;
      rgb[i]=(raw[y*(stride+1)+1+x]+[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter])&255;
    }
  }
  const data=new Uint8Array(width*height);
  for(let i=0;i<data.length;i++) {
    assert.equal(rgb[i*3],rgb[i*3+1]); assert.equal(rgb[i*3],rgb[i*3+2]); data[i]=rgb[i*3];
  }
  return {width,height,data};
}
