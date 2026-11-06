import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ethers } from '../infra/node_modules/ethers/lib.esm/index.js';

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
const CHAIN_ID = 16602;
const rawKey = process.env.PRIVATE_KEY || readEnv('PRIVATE_KEY') || readEnv('DEPLOYER_PRIVATE_KEY');
const PRIVATE_KEY = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;

const STILLWORKS_HUB_ADDRESS = '0x6939b3e9FB99Ef0005a3e6dd8Ed223E121c51460';
const CLEAN_ESCROW_ADDRESS = '0x153badA8AB7C65DAF3a90f581E6b34AB7cAC543a';
const MOCK_USDT_ADDRESS = '0x6A8c371B01A9b9657c3bfbF8677c96408145B512';

const HUB_ABI = [
  'function productCount() view returns (uint256)',
  'function currentEpoch() view returns (uint256)',
  'function totalProtocolFeesCollected() view returns (uint256)',
  'function getProductHealth(uint256 productId) view returns (uint8 currentStatus, uint256 secondsSinceHeartbeat)',
  'function recordHeartbeat(uint256 productId, bytes32 newStorageHash) external',
  'function performUpkeep(bytes32 snapshotHash) external',
  'function listings(uint256) view returns (uint256 productId, bytes32 slugHash, address steward, address escrowContract, bytes32 latest0GStorageHash, uint256 lastHeartbeat, uint256 totalServiceFeesContributed, uint8 status, bool registered)',
  'event UpkeepPerformed(uint256 indexed epoch, bytes32 snapshotHash, uint256 feePoolBalance, uint256 timestamp)',
  'event HeartbeatRecorded(uint256 indexed productId, uint256 timestamp, bytes32 newStorageHash)'
];

async function fetchRedisCatalog() {
  const url = process.env.UPSTASH_REDIS_REST_URL || readEnv('UPSTASH_REDIS_REST_URL') || 'https://easy-magpie-192739.upstash.io';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || readEnv('UPSTASH_REDIS_REST_TOKEN') || 'gQAAAAAAAvDjAAIgcDIwYjI3OGQ0NjIxYjk0M2ExODgxZWM5MDA0YjYzNmUyNw';

  try {
    const res = await fetch(`${url}/get/stillworks:catalog:products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.result) {
      return JSON.parse(data.result);
    }
  } catch (err) {
    console.warn('[Redis] Warning: could not fetch catalog from Redis:', err.message);
  }
  return null;
}

async function main() {
  console.log('================================================================');
  console.log('       STILLWORKS 0G GALILEO CRE / UPKEEP SYNC RUNNER');
  console.log('================================================================\n');

  console.log(`[Config] Target Chain: 0G Galileo Testnet (${CHAIN_ID})`);
  console.log(`[Config] RPC URL:      ${RPC_URL}`);
  console.log(`[Config] Hub Contract: ${STILLWORKS_HUB_ADDRESS}`);

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log(`[Signer] Keeper Address: ${wallet.address}`);

  const balance = await provider.getBalance(wallet.address);
  console.log(`[Signer] 0G Balance:     ${ethers.formatEther(balance)} 0G\n`);

  const hub = new ethers.Contract(STILLWORKS_HUB_ADDRESS, HUB_ABI, wallet);

  // 1. Query Current Hub State
  const count = await hub.productCount();
  const epoch = await hub.currentEpoch();
  const fees = await hub.totalProtocolFeesCollected();
  console.log(`[Hub State] Total Products:   ${count}`);
  console.log(`[Hub State] Current Epoch:    ${epoch}`);
  console.log(`[Hub State] Fees Collected:   ${fees} raw (${Number(fees) / 1e6} USDT)\n`);

  // 2. Fetch Catalog from Redis
  console.log('[Snapshot] Fetching latest catalog state from Upstash Redis...');
  const catalog = await fetchRedisCatalog();
  const productSlugs = catalog ? catalog.map(p => p.slug) : ['clean', 'gleam', 'venus'];
  console.log(`[Snapshot] Catalog items tracked: ${productSlugs.length} (${productSlugs.join(', ')})`);

  // 3. Compute Merkle / Snapshot Root Hash
  const timestamp = Math.floor(Date.now() / 1000);
  const snapshotPayload = {
    protocol: 'Stillworks',
    cadence: '24-hour',
    timestamp,
    trackedSlugs: productSlugs,
    hubAddress: STILLWORKS_HUB_ADDRESS,
    escrowAddress: CLEAN_ESCROW_ADDRESS
  };
  const snapshotBytes = ethers.toUtf8Bytes(JSON.stringify(snapshotPayload));
  const snapshotHash = ethers.keccak256(snapshotBytes);
  console.log(`[Snapshot] Computed Root Hash: ${snapshotHash}\n`);

  // 4. Record Heartbeat for Clean (Product ID 1)
  console.log('[Heartbeat] Posting liveness heartbeat for Product #1 (Clean)...');
  const cleanProofHash = ethers.keccak256(ethers.toUtf8Bytes(`clean-health-${timestamp}`));
  const hbTx = await hub.recordHeartbeat(1, cleanProofHash);
  console.log(`[Heartbeat] Tx submitted: ${hbTx.hash}`);
  const hbReceipt = await hbTx.wait();
  console.log(`[Heartbeat] Confirmed in block ${hbReceipt.blockNumber} (Gas used: ${hbReceipt.gasUsed.toString()})\n`);

  // 5. Perform Platform Upkeep (Trigger CRE Epoch Advance)
  console.log('[Upkeep] Executing performUpkeep with snapshot hash...');
  const upkeepTx = await hub.performUpkeep(snapshotHash);
  console.log(`[Upkeep] Tx submitted: ${upkeepTx.hash}`);
  const upkeepReceipt = await upkeepTx.wait();
  console.log(`[Upkeep] Confirmed in block ${upkeepReceipt.blockNumber} (Gas used: ${upkeepReceipt.gasUsed.toString()})\n`);

  // 6. Verify Updated State
  const newEpoch = await hub.currentEpoch();
  const [healthStatus, secondsSince] = await hub.getProductHealth(1);
  const statusStr = healthStatus === 0n ? 'Active' : healthStatus === 1n ? 'GracePeriod' : 'Abandoned';
  console.log('================================================================');
  console.log('       UPKEEP CYCLE COMPLETED & VERIFIED ONCHAIN');
  console.log('================================================================');
  console.log(`  New Epoch:           ${newEpoch}`);
  console.log(`  Product #1 Health:   ${statusStr} (${secondsSince}s since heartbeat)`);
  console.log(`  Upkeep Tx Hash:      ${upkeepTx.hash}`);
  console.log(`  ChainScan Link:      https://chainscan-galileo.0g.ai/tx/${upkeepTx.hash}`);
  console.log('================================================================\n');
}

main().catch((err) => {
  console.error('[Error in sync-cre-heartbeats]:', err);
  process.exit(1);
});
