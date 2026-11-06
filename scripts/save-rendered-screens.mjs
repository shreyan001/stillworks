import fs from 'node:fs';

const pages = [
  { id: 'c6891e9a-5085-4f88-b860-68cdf1b06326', name: 'screen-1-landing' },
  { id: '631620b8-bffa-4b6b-a0e4-710e493747f7', name: 'screen-2-detail' },
  { id: '3e63f09a-06b2-4f3c-874f-f4f78471f7c6', name: 'screen-3-third' },
  { id: 'f67e52cf-ee0c-4032-a990-7c433049b0d0', name: 'screen-4-fourth' },
];

for (const p of pages) {
  const html = fs.readFileSync(`scripts/screen-${p.id}.html`, 'utf8');
  const tTag = '<script type="__bundler/template">';
  const tIdx = html.indexOf(tTag);
  if (tIdx !== -1) {
    const tEnd = html.indexOf('</script>', tIdx);
    const rawTemplate = html.slice(tIdx + tTag.length, tEnd);
    const decodedHtml = JSON.parse(rawTemplate);
    fs.writeFileSync(`scripts/${p.name}.html`, decodedHtml);
    console.log(`Saved scripts/${p.name}.html (${decodedHtml.length} chars)`);
  }
}
