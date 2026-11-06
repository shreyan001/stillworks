import fs from 'node:fs';

const html = fs.readFileSync(new URL('./sovereign-inner.html', import.meta.url), 'utf8');
const needles = ['#faf9f5', '#f5f4ef', 'Sovereign', 'Launch', 'Inter', 'Space Grotesk', '--bg', 'background:'];
for (const needle of needles) {
  const at = html.indexOf(needle);
  console.log(needle, at);
  if (at >= 0) console.log(html.slice(at - 80, at + 240).replace(/\n/g, ' '));
}
