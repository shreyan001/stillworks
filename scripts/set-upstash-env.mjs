import fs from 'node:fs';

const file = new URL('../.env', import.meta.url);
let text = fs.readFileSync(file, 'utf8');
const url = process.env.UP_URL || '';
const token = process.env.UP_TOKEN || '';
if (!url.startsWith('https://') || token.length < 20) {
  console.error('missing upstash env');
  process.exit(1);
}

function setKey(name, value) {
  const pattern = new RegExp(`^${name}=.*$`, 'm');
  if (pattern.test(text)) text = text.replace(pattern, `${name}=${value}`);
  else text += `\n${name}=${value}\n`;
}

setKey('UPSTASH_REDIS_REST_URL', url);
setKey('UPSTASH_REDIS_REST_TOKEN', token);
fs.writeFileSync(file, text);
console.log('redis_env_set');
