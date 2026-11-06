import fs from 'node:fs';
import zlib from 'node:zlib';

const pages = [
  { id: 'c6891e9a-5085-4f88-b860-68cdf1b06326', name: 'Screen 1' },
  { id: '631620b8-bffa-4b6b-a0e4-710e493747f7', name: 'Screen 2' },
  { id: '3e63f09a-06b2-4f3c-874f-f4f78471f7c6', name: 'Screen 3' },
  { id: 'f67e52cf-ee0c-4032-a990-7c433049b0d0', name: 'Screen 4' },
];

for (const p of pages) {
  const html = fs.readFileSync(`scripts/screen-${p.id}.html`, 'utf8');
  console.log(`\n========================================`);
  console.log(`${p.name} (${p.id})`);
  
  // Look for __bundler/template
  const tTag = '<script type="__bundler/template">';
  const tIdx = html.indexOf(tTag);
  if (tIdx !== -1) {
    const tEnd = html.indexOf('</script>', tIdx);
    const rawTemplate = html.slice(tIdx + tTag.length, tEnd);
    console.log(`Template length: ${rawTemplate.length}`);
    try {
      const template = JSON.parse(rawTemplate);
      console.log('Template parsed:', typeof template, Object.keys(template));
      if (template.html) {
        fs.writeFileSync(`scripts/rendered-${p.id}.html`, template.html);
        console.log(`Saved rendered HTML: scripts/rendered-${p.id}.html (${template.html.length} chars)`);
      }
    } catch (e) {
      // Maybe it's raw HTML or base64
      console.log(`Template is not JSON (${e.message}), first 300 chars:`, rawTemplate.slice(0, 300));
    }
  }

  // Also look for text/x-dc
  const dcMatch = html.match(/<script type=\\"text\/x-dc\\"[^>]*>([\s\S]*?)<\/script>/);
  if (dcMatch) {
    console.log(`text/x-dc length: ${dcMatch[1].length}`);
    fs.writeFileSync(`scripts/dc-${p.id}.js`, dcMatch[1]);
  }
}
