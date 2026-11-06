import fs from 'node:fs';
import zlib from 'node:zlib';

const text = fs.readFileSync(new URL('./sovereign-home.html', import.meta.url), 'utf8');
const marker = text.indexOf('H4sI');
const key = text.lastIndexOf('"data":"', marker);
const dataStart = key + '"data":"'.length;
const dataEnd = text.indexOf('"', dataStart);
const html = zlib.gunzipSync(Buffer.from(text.slice(dataStart, dataEnd), 'base64')).toString('utf8');
fs.writeFileSync(new URL('./sovereign-inner.html', import.meta.url), html);
const styleEnd = html.indexOf('</style>');
console.log(html.slice(html.indexOf('<style'), styleEnd + 8).slice(0, 5000));
