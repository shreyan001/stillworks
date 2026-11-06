import fs from 'node:fs';

const screens = [
  'screen-1-landing.html',
  'screen-2-detail.html',
  'screen-3-third.html',
  'screen-4-fourth.html'
];

for (const name of screens) {
  const content = fs.readFileSync(`scripts/${name}`, 'utf8');
  console.log(`\n======================================================`);
  console.log(`FILE: ${name} (${content.length} chars)`);
  
  // Extract visible texts
  const clean = content.replace(/<style[\s\S]*?<\/style>/gi, '')
                       .replace(/<script[\s\S]*?<\/script>/gi, '')
                       .replace(/<svg[\s\S]*?<\/svg>/gi, '')
                       .replace(/<[^>]+>/g, '\n')
                       .split('\n')
                       .map(s => s.trim())
                       .filter(s => s.length > 0);
  
  console.log('Top 30 lines of text:');
  console.log(clean.slice(0, 30).join('  |  '));
}
