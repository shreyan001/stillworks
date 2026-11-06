import fs from 'node:fs';

function inspectHtml(filename) {
  const html = fs.readFileSync(`scripts/${filename}`, 'utf8');
  // strip fonts and style
  const bodyText = html.replace(/<style[\s\S]*?<\/style>/gi, '')
                       .replace(/<helmet[\s\S]*?<\/helmet>/gi, '');
  console.log(`\n================== ${filename} ==================`);
  
  // Find major containers/sections
  const matches = [...bodyText.matchAll(/<(?:div|header|section|nav|main|table)[^>]*class="([^"]*)"[^>]*>/gi)];
  const classes = matches.map(m => m[1]);
  console.log('Key classes used:', Array.from(new Set(classes.join(' ').split(/\s+/))).filter(c => c.length > 1).join(', '));
  
  // Let's print out the clean HTML outline
  const lines = bodyText.split('\n')
                        .map(l => l.trim())
                        .filter(l => l.length > 0 && !l.startsWith('@font-face') && !l.startsWith('unicode-range') && !l.startsWith('src:'));
  console.log('Sample content outline:');
  console.log(lines.slice(0, 80).join('\n'));
}

inspectHtml('screen-1-landing.html');
inspectHtml('screen-2-detail.html');
