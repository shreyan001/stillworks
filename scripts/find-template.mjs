import fs from 'node:fs';

const html = fs.readFileSync(new URL('./sovereign-home.html', import.meta.url), 'utf8');
const cut = html.indexOf('<script type="__bundler/manifest">');
const head = html.slice(0, cut);
console.log('head length', head.length);
const marks = ['x-dc', 'background', 'Sovereign', 'Stillworks', 'Launch', '#1', 'font-family'];
for (const mark of marks) {
  const at = head.indexOf(mark);
  console.log(mark, at);
}
console.log(head.slice(0, 1500));
