import fs from 'node:fs';

const html = fs.readFileSync(new URL('./screen-f67e52cf.html', import.meta.url), 'utf8');
const svg = html.indexOf('<svg');
console.log('svg', svg, 'len', html.length);
console.log(html.slice(svg, svg + 1500));
const colors = [...html.matchAll(/#[0-9a-fA-F]{6}/g)].map((match) => match[0].toLowerCase());
const counts = new Map();
for (const color of colors) counts.set(color, (counts.get(color) || 0) + 1);
console.log([...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([color, count]) => `${color} ${count}`).join('\n'));
