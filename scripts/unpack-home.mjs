import fs from 'node:fs';
import zlib from 'node:zlib';

const text = fs.readFileSync('C:/Users/acer/Downloads/Sovereign — Launchpad Design System.html', 'utf8');
const marker = '{"c6891e9a-5085-4f88-b860-68cdf1b06326"';
const start = text.indexOf(marker);
const jsonStart = text.lastIndexOf('{', start);
const scriptEnd = text.indexOf('</script>', start);
const raw = text.slice(jsonStart, scriptEnd).trim();
const manifest = JSON.parse(raw);
const home = manifest['c6891e9a-5085-4f88-b860-68cdf1b06326'];
const html = zlib.gunzipSync(Buffer.from(home.data, 'base64')).toString('utf8');
fs.writeFileSync('scripts/sovereign-home.html', html);
const style = html.match(/<style[\s\S]*?<\/style>/i)?.[0] || '';
console.log('html bytes', html.length);
console.log(style.slice(0, 4000));
