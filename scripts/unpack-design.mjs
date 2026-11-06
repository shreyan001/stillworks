import fs from 'node:fs';

const text = fs.readFileSync('C:/Users/acer/Downloads/Sovereign — Launchpad Design System.html', 'utf8');
const ids = [
  'c6891e9a-5085-4f88-b860-68cdf1b06326',
  'f67e52cf-ee0c-4032-a990-7c433049b0d0',
];

for (const id of ids) {
  const at = text.indexOf(id);
  console.log('\n====', id, 'at', at);
  console.log(text.slice(Math.max(0, at - 200), at + 500).replace(/\n/g, ' '));
}

const styleAt = text.indexOf(':root');
console.log('\n==== root count', text.split(':root').length - 1);
const tokenAt = text.lastIndexOf('--paper');
console.log('paper at', tokenAt);
if (tokenAt > 0) console.log(text.slice(tokenAt - 100, tokenAt + 800));
