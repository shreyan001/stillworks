import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Indexer, ZgFile } from '../app/node_modules/@0gfoundation/0g-storage-ts-sdk/lib.esm/index.js';
import { ethers } from '../app/node_modules/ethers/lib.esm/index.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readEnv(name) {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return '';
  const text = fs.readFileSync(envPath, 'utf8');
  const line = text.split(/\r?\n/).find((entry) => entry.startsWith(`${name}=`));
  return line ? line.slice(name.length + 1).trim().replace(/^["']|["']$/g, '') : '';
}

const rpc = process.env.RPC_URL || readEnv('RPC_URL') || 'https://evmrpc-testnet.0g.ai';
const indexerUrl = process.env.STORAGE_INDEXER || readEnv('STORAGE_INDEXER') || 'https://indexer-storage-testnet-turbo.0g.ai';
const rawKey = process.env.PRIVATE_KEY || readEnv('PRIVATE_KEY') || readEnv('DEPLOYER_PRIVATE_KEY');

if (!rawKey) {
  console.error('ERROR: No private key found.');
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(rpc);
const wallet = new ethers.Wallet(rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`, provider);

async function uploadTo0G(filePath, label) {
  console.log(`\n======================================================`);
  console.log(`Uploading ${label} to 0G Storage Turbo...`);
  console.log(`File: ${filePath} (${fs.statSync(filePath).size} bytes)`);
  
  const indexer = new Indexer(indexerUrl);
  const file = await ZgFile.fromFilePath(filePath);
  
  try {
    const [tree, treeErr] = await file.merkleTree();
    if (treeErr || !tree) throw new Error(`Tree error: ${String(treeErr)}`);
    const rootHash = tree.rootHash();
    console.log(`Calculated 32-Byte Merkle Root: ${rootHash}`);

    console.log(`Submitting onchain storage transaction to 0G Galileo...`);
    const [result, uploadErr] = await indexer.upload(file, rpc, wallet);
    if (uploadErr) throw new Error(uploadErr.message || String(uploadErr));

    const txHash = 'txHash' in result ? result.txHash : result.txHashes[0];
    const uploadedRoot = 'rootHash' in result ? result.rootHash : result.rootHashes[0];
    
    console.log(`✓ Upload Succeeded!`);
    console.log(`  Tx Hash:   ${txHash}`);
    console.log(`  Root Hash: ${uploadedRoot}`);
    console.log(`  Live URL:  ${indexerUrl}/file/${uploadedRoot}`);
    
    return {
      label,
      filePath,
      rootHash: uploadedRoot,
      txHash,
      gatewayUrl: `${indexerUrl}/file/${uploadedRoot}`,
      explorerUrl: `https://chainscan-galileo.0g.ai/tx/${txHash}`
    };
  } finally {
    await file.close();
  }
}

async function main() {
  console.log(`Deployer Wallet: ${wallet.address}`);
  const balance = await provider.getBalance(wallet.address);
  console.log(`Galileo Balance: ${ethers.formatEther(balance)} 0G`);

  const indexHtmlPath = path.join(rootDir, 'app', 'out', 'index.html');
  const bundleZipPath = path.join(rootDir, 'stillworks-site-bundle.zip');

  const indexUpload = await uploadTo0G(indexHtmlPath, 'Stillworks Live Web App (index.html)');
  const bundleUpload = await uploadTo0G(bundleZipPath, 'Stillworks Full Static Site Bundle (ZIP)');

  console.log(`\n======================================================`);
  console.log(`   STILLWORKS OFFICIALLY DEPLOYED ON 0G STORAGE!`);
  console.log(`======================================================`);
  console.log(`1. Live Web App Online URL:\n   ${indexUpload.gatewayUrl}`);
  console.log(`2. Full Static Bundle Online URL:\n   ${bundleUpload.gatewayUrl}`);
  console.log(`3. 0G Galileo Onchain Transactions:`);
  console.log(`   - App Tx:    ${indexUpload.explorerUrl}`);
  console.log(`   - Bundle Tx: ${bundleUpload.explorerUrl}`);
  console.log(`======================================================`);
}

main().catch(console.error);
