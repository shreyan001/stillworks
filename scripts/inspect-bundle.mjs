import fs from 'node:fs';
import zlib from 'node:zlib';

const text = fs.readFileSync('C:/Users/acer/Downloads/Sovereign — Launchpad Design System.html', 'utf8');
const regex = /"([a-f0-9-]{36})":\{"mime":"([^"]+)"(?:,"compressed":true)?,"data":"([^"]+)"/g;
let m;
const screens = [];
while ((m = regex.exec(text)) !== null) {
  const id = m[1];
  const mime = m[2];
  const data = m[3];
  console.log(`Found: ${id} (${mime}, ${data.length} bytes base64)`);
  if (mime === 'text/html') {
    try {
      const html = zlib.gunzipSync(Buffer.from(data, 'base64')).toString('utf8');
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : 'No title';
      console.log(`  HTML Title: ${title}, decoded length: ${html.length}`);
      screens.push({ id, title, html });
      fs.writeFileSync(`scripts/screen-${id}.html`, html);
    } catch (e) {
      console.log(`  Error gunzipping: ${e.message}`);
    }
  }
}

// Check page_order if present
const pageOrderTag = '<script type="__bundler/page_order">';
const poIdx = text.indexOf(pageOrderTag);
if (poIdx !== -1) {
  const poEnd = text.indexOf('</script>', poIdx);
  const poContent = text.slice(poIdx + pageOrderTag.length, poEnd);
  console.log('\nPage Order:', poContent);
}
