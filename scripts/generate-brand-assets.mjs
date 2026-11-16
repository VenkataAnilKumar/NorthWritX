// Render the authored SVG mark into web, Word and desktop distribution formats.
// Requires the existing tests/browser Playwright workspace and Chromium.
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'tests/browser/package.json'));
const { chromium } = require('playwright');
const svg = await fs.readFile(path.join(root, 'apps/web/src/app/icon.svg'), 'utf8');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
 const page = await browser.newPage();
 const rasters = new Map();
 for (const size of [16, 32, 48, 64, 80, 128, 180, 256, 512, 1024]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>body{margin:0;background:transparent}svg{width:100vw;height:100vh;display:block}</style>${svg}`);
  rasters.set(size, await page.screenshot({ omitBackground: true }));
 }
 for (const [file, size] of [
  ['apps/web/public/apple-touch-icon.png',180],['apps/desktop/assets/icon-1024.png',1024],
  ['apps/word-addin/assets/icon-16.png',16],['apps/word-addin/assets/icon-32.png',32],['apps/word-addin/assets/icon-80.png',80],
 ]) await fs.writeFile(path.join(root,file),rasters.get(size));
 const sizes=[16,32,48,256],header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);let offset=header.length;
 for(const [i,size] of sizes.entries()){const at=6+i*16,bytes=rasters.get(size);header[at]=size%256;header[at+1]=size%256;header.writeUInt16LE(1,at+4);header.writeUInt16LE(32,at+6);header.writeUInt32LE(bytes.length,at+8);header.writeUInt32LE(offset,at+12);offset+=bytes.length;}
 await fs.writeFile(path.join(root,'apps/web/src/app/favicon.ico'),Buffer.concat([header,...sizes.map(s=>rasters.get(s))]));
 const chunks=[];
 for(const [tag,size] of [['icp4',16],['icp5',32],['icp6',64],['ic07',128],['ic08',256],['ic09',512],['ic10',1024]]){const bytes=rasters.get(size),h=Buffer.alloc(8);h.write(tag);h.writeUInt32BE(8+bytes.length,4);chunks.push(h,bytes);}
 const icns=Buffer.alloc(8);icns.write('icns');icns.writeUInt32BE(8+chunks.reduce((n,b)=>n+b.length,0),4);
 await fs.writeFile(path.join(root,'apps/desktop/assets/icon.icns'),Buffer.concat([icns,...chunks]));
 await page.setViewportSize({width:1200,height:630});
 await page.setContent(`<style>body{margin:0;background:#F7F4EC;color:#173449;font-family:Georgia,serif}main{padding:90px}svg{width:110px;height:110px}h1{font-size:88px;margin:26px 0 12px;font-weight:500}p{font:26px/1.5 Arial,sans-serif;margin:0;color:#22766F}.lines{position:absolute;right:80px;top:90px;width:220px;height:400px;border-left:3px solid #22766F;transform:skewY(-18deg);background:repeating-linear-gradient(transparent 0 43px,#22766F33 44px 46px)}</style><main>${svg}<h1>NorthWrit</h1><p>Your documents. Your review process.<br>One focused workspace.</p><div class="lines"></div></main>`);
 const social=await page.screenshot({type:'jpeg',quality:92});
 for(const file of ['northwrit-social.jpg','link-image.jpg'])await fs.writeFile(path.join(root,'apps/web/public',file),social);
 console.log('Rendered web, Word, desktop and social assets from the NorthWrit mark.');
} finally {await browser.close();}
