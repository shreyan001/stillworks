import fs from 'node:fs';

const pages = [
  { id: 'c6891e9a-5085-4f88-b860-68cdf1b06326', name: 'Page 1' },
  { id: '631620b8-bffa-4b6b-a0e4-710e493747f7', name: 'Page 2' },
  { id: '3e63f09a-06b2-4f3c-874f-f4f78471f7c6', name: 'Page 3' },
  { id: 'f67e52cf-ee0c-4032-a990-7c433049b0d0', name: 'Page 4' },
];

for (const p of pages) {
  const html = fs.readFileSync(`scripts/screen-${p.id}.html`, 'utf8');
  console.log(`\n========================================`);
  console.log(`${p.name} (${p.id}) - Length: ${html.length}`);
  
  // Strip tags, get visible texts
  // Let's look for main navigation, headings, badges, tabs
  const textWithoutTags = html.replace(/<style[\s\S]*?<\/style>/gi, '')
                              .replace(/<script[\s\S]*?<\/script>/gi, '')
                              .replace(/<svg[\s\S]*?<\/svg>/gi, ' [SVG] ')
                              .replace(/<[^>]+>/g, '\n')
                              .split('\n')
                              .map(s => s.trim())
                              .filter(s => s.length > 2);
  
  console.log(`Key text samples (first 40 distinct items):`);
  const unique = Array.from(new Set(textWithoutTags)).slice(0, 40);
  console.log(unique.join(' | '));
}
