import fs from 'node:fs';
import zlib from 'node:zlib';

const id = process.argv[2];
const text = fs.readFileSync('C:/Users/acer/Downloads/Sovereign — Launchpad Design System.html', 'utf8');
const key = `"${id}":{"mime":"text/html","compressed":true,"data":"`;
const at = text.indexOf(key);
if (at < 0) {
  console.error('missing', id);
  process.exit(1);
}
const dataStart = at + key.length;
const dataEnd = text.indexOf('"', dataStart);
const html = zlib.gunzipSync(Buffer.from(text.slice(dataStart, dataEnd), 'base64')).toString('utf8');
const out = new URL(`./screen-${id.slice(0, 8)}.html`, import.meta.url);
fs.writeFileSync(out, html);
console.log(id, html.length);
console.log(html.slice(0, 800));
