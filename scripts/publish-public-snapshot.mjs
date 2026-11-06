import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Indexer, ZgFile } from '../infra/node_modules/@0gfoundation/0g-storage-ts-sdk/lib.esm/index.js';
import { ethers } from '../infra/node_modules/ethers/lib.esm/index.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readEnv(name) {
  const text = fs.readFileSync(path.join(rootDir, '.env'), 'utf8');
  const line = text.split(/\r?\n/).find((entry) => entry.startsWith(`${name}=`));
  return line ? line.slice(name.length + 1).trim().replace(/^["']|["']$/g, '') : '';
}

async function redis(command) {
  const url = readEnv('UPSTASH_REDIS_REST_URL');
  const token = readEnv('UPSTASH_REDIS_REST_TOKEN');
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const body = await response.json();
  if (!response.ok || body.error) throw new Error(body.error || `Redis ${response.status}`);
  return body.result;
}

async function uploadFile(filePath, wallet, rpc, indexerUrl) {
  const indexer = new Indexer(indexerUrl);
  const file = await ZgFile.fromFilePath(filePath);
  try {
    const [tree, treeErr] = await file.merkleTree();
    if (treeErr || !tree) throw new Error(String(treeErr));
    const [result, uploadErr] = await indexer.upload(file, rpc, wallet);
    if (uploadErr) throw new Error(uploadErr.message || String(uploadErr));
    return {
      rootHash: 'rootHash' in result ? result.rootHash : result.rootHashes[0],
      txHash: 'txHash' in result ? result.txHash : result.txHashes[0],
    };
  } finally {
    await file.close();
  }
}

const rpc = readEnv('RPC_URL') || 'https://evmrpc-testnet.0g.ai';
const indexerUrl = readEnv('STORAGE_INDEXER') || 'https://indexer-storage-testnet-turbo.0g.ai';
const rawKey = readEnv('PRIVATE_KEY');
const wallet = new ethers.Wallet(rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`, new ethers.JsonRpcProvider(rpc));

const catalog = {
  protocol: 'Stillworks',
  pages: ['/', '/app', '/leaderboard', '/launch', '/clean', '/gleam', '/venus', '/calmcal', '/hushnote', '/listmonk-crops'],
  note: 'Public display buffer only. Private notes are not written here.',
};
await redis(['SET', 'stillworks:catalog', JSON.stringify(catalog)]);
const stored = await redis(['GET', 'stillworks:catalog']);
if (!stored) throw new Error('Redis did not return the catalog');

const inferenceKey = readEnv('ZEROG_PC_API_KEY');
const inferenceResponse = await fetch('https://router-api.0g.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${inferenceKey}`,
    'X-0G-Provider-Trust-Mode': 'private',
  },
  body: JSON.stringify({
    model: '0gm-1.0-35b-a3b',
    messages: [{ role: 'user', content: 'In one sentence, say Clean is locked on 0G storage.' }],
    max_tokens: 200,
  }),
});
const inferenceBody = await inferenceResponse.json();
if (!inferenceResponse.ok) {
  throw new Error(inferenceBody.error?.message || `Inference ${inferenceResponse.status}`);
}

const cleanPath = path.join(rootDir, 'scripts', 'products', 'clean.mjs');
fs.mkdirSync(path.dirname(cleanPath), { recursive: true });
fs.writeFileSync(cleanPath, "export const name = 'Clean';\nexport const locked = true;\n");
const clean = await uploadFile(cleanPath, wallet, rpc, indexerUrl);

const snapshot = {
  protocol: 'Stillworks',
  cadence: '24-hour',
  timestamp: new Date().toISOString(),
  redis: 'upstash-buffer',
  cron: 'Chainlink CRE 24-hour workflow trigger',
  inference: {
    text: inferenceBody.choices?.[0]?.message?.content?.trim() || '',
    requestId: inferenceBody.x_0g_trace?.request_id || inferenceBody.request_id || '',
    model: '0gm-1.0-35b-a3b',
    trust: 'private',
  },
  clean,
  snapshotRoot: null,
};

const snapshotPath = path.join(rootDir, 'app', 'src', 'data', 'live-snapshot.json');
fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
const uploaded = await uploadFile(snapshotPath, wallet, rpc, indexerUrl);
snapshot.snapshotRoot = uploaded.rootHash;
fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));

console.log(JSON.stringify({
  redis: 'ok',
  clean,
  snapshotTx: uploaded.txHash,
  snapshotRoot: uploaded.rootHash,
  inferenceRequestId: snapshot.inference.requestId,
}, null, 2));
