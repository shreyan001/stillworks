import fs from 'node:fs';
import zlib from 'node:zlib';

const text = fs.readFileSync(new URL('./sovereign-home.html', import.meta.url), 'utf8');
const start = text.indexOf('<script type="__bundler/manifest">');
const jsonStart = text.indexOf('{', start);
const jsonEnd = text.indexOf('</script>', jsonStart);
const manifest = JSON.parse(text.slice(jsonStart, jsonEnd));
console.log('assets', Object.keys(manifest).length);
for (const [id, asset] of Object.entries(manifest)) {
  let preview = '';
  try {
    const buf = asset.compressed ? zlib.gunzipSync(Buffer.from(asset.data, 'base64')) : Buffer.from(asset.data, 'base64');
    preview = buf.toString('utf8').slice(0, 120).replace(/\s+/g, ' ');
    console.log(id, asset.mime, buf.length, preview);
  } catch (error) {
    console.log(id, asset.mime, 'fail', error.message);
  }
}
