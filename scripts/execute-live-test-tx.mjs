import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ethers } from '../infra/node_modules/ethers/lib.esm/index.js';
import { Redis } from '../app/node_modules/@upstash/redis/nodejs.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readEnv(name) {
  try {
    const text = fs.readFileSync(path.join(rootDir, '.env'), 'utf8');
    const line = text.split(/\r?\n/).find((entry) => entry.startsWith(`${name}=`));
    return line ? line.slice(name.length + 1).trim().replace(/^["']|["']$/g, '') : '';
  } catch {
    return '';
  }
}

const RPC_URL = process.env.RPC_URL || readEnv('RPC_URL') || 'https://evmrpc-testnet.0g.ai';
const rawKey = process.env.PRIVATE_KEY || readEnv('PRIVATE_KEY') || readEnv('DEPLOYER_PRIVATE_KEY');
const PRIVATE_KEY = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || readEnv('UPSTASH_REDIS_REST_URL') || 'https://easy-magpie-192739.upstash.io';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || readEnv('UPSTASH_REDIS_REST_TOKEN') || 'gQAAAAAAAvDjAAIgcDIwYjI3OGQ0NjIxYjk0M2ExODgxZWM5MDA0YjYzNmUyNw';

const HOURLY_HUB = '0xb2b264386d3b88085ca7e4114a6B0eF0358aC450';
const USDT_ADDRESS = '0x6A8c371B01A9b9657c3bfbF8677c96408145B512';

async function main() {
  console.log('🔗 Connecting to 0G Galileo & Upstash Redis...');
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });

  const pingStart = Date.now();
  const redisPing = await redis.ping();
  const redisLatency = Date.now() - pingStart;
  console.log(`✅ Redis Ping: ${redisPing} (${redisLatency}ms latency)`);

  const balance = await provider.getBalance(wallet.address);
  console.log(`Deployer: ${wallet.address} (Balance: ${ethers.formatEther(balance)} 0G)`);

  // 1. Send Test Transaction to StillworksHourlyProtocolHub (recordHeartbeat)
  console.log('\n[1/3] Broadcasting test heartbeat transaction to 0G Galileo...');
  const hubArtifact = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'contracts/out/StillworksHourlyProtocolHub.sol/StillworksHourlyProtocolHub.json'), 'utf8')
  );
  const hub = new ethers.Contract(HOURLY_HUB, hubArtifact.abi, wallet);

  const newHash = ethers.keccak256(ethers.toUtf8Bytes(`stillworks-heartbeat-ping-${Date.now()}`));
  const tx = await hub.recordHeartbeat(1, newHash);
  console.log(`Tx submitted! Hash: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`✅ Tx confirmed in Block: ${receipt.blockNumber} (Gas Used: ${receipt.gasUsed.toString()})`);

  // 2. Prepare Verified Telemetry Payload
  console.log('\n[2/3] Writing live heartbeat & transaction telemetry to Upstash Redis...');
  const telemetryData = {
    testTxHash: tx.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    timestamp: new Date().toISOString(),
    epochTimestamp: Math.floor(Date.now() / 1000),
    caller: wallet.address,
    contract: HOURLY_HUB,
    chain: '0G Galileo Testnet',
    chainId: 16602,
    heartbeatStorageHash: newHash,
    status: 'Confirmed & Verified Onchain',
    explorerUrl: `https://chainscan-galileo.0g.ai/tx/${tx.hash}`,
  };

  // Push to Redis keys
  await redis.set('stillworks:telemetry:testTransaction', telemetryData);
  await redis.set('stillworks:heartbeat:clean', {
    timestamp: Date.now(),
    status: 'Active',
    root: newHash,
    txHash: tx.hash,
    blockNumber: receipt.blockNumber,
  });

  // Record into live telemetry stream list
  await redis.lpush('stillworks:stream:heartbeats', JSON.stringify({
    productId: 1,
    product: 'clean',
    timestamp: Date.now(),
    root: newHash,
    txHash: tx.hash,
  }));
  await redis.ltrim('stillworks:stream:heartbeats', 0, 49); // Keep latest 50

  console.log(`✅ Saved to Redis: stillworks:telemetry:testTransaction`);
  console.log(`✅ Saved to Redis: stillworks:heartbeat:clean`);
  console.log(`✅ Streamed to Redis: stillworks:stream:heartbeats`);

  // 3. Read back and confirm
  console.log('\n[3/3] Verifying read-back from Redis...');
  const readBack = await redis.get('stillworks:telemetry:testTransaction');
  console.log('Readback verification:', readBack);

  console.log('\n🎉 SUCCESS! Test transaction executed on 0G Galileo and synced to Upstash Redis.');
}

main().catch((err) => {
  console.error('Error executing test tx:', err);
  process.exit(1);
});
