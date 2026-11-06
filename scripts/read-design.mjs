import fs from 'node:fs';

const text = fs.readFileSync('C:/Users/acer/Downloads/Sovereign — Launchpad Design System.html', 'utf8');
const colors = [...text.matchAll(/#[0-9a-fA-F]{6}/g)].map((match) => match[0].toLowerCase());
const counts = new Map();
for (const color of colors) counts.set(color, (counts.get(color) || 0) + 1);
const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30);
console.log(top.map(([color, count]) => `${color} ${count}`).join('\n'));

const idx = text.indexOf('html{background');
console.log('---snippet---');
console.log(text.slice(idx, idx + 2500));
