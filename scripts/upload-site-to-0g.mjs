import { Indexer, ZgFile } from '../app/node_modules/@0gfoundation/0g-storage-ts-sdk/lib.esm/index.js';
import { ethers } from '../app/node_modules/ethers/lib.esm/index.js';
import * as fs from 'fs';
import * as path from 'path';

function readEnvKey(key) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) return '';
    const text = fs.readFileSync(envPath, 'utf8');
    const match = text.split(/\r?\n/).find(line => line.startsWith(`${key}=`));
    return match ? match.slice(key.length + 1).trim().replace(/^["']|["']$/g, '') : '';
  } catch {
    return '';
  }
}

const RPC_URL = process.env.RPC_URL || readEnvKey('RPC_URL') || 'https://evmrpc-testnet.0g.ai';
const STORAGE_INDEXER = process.env.STORAGE_INDEXER || readEnvKey('STORAGE_INDEXER') || 'https://indexer-storage-testnet-turbo.0g.ai';
const rawKey = process.env.PRIVATE_KEY || readEnvKey('PRIVATE_KEY') || readEnvKey('DEPLOYER_PRIVATE_KEY');

if (!rawKey) {
  console.error('Missing PRIVATE_KEY');
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`, provider);
const indexer = new Indexer(STORAGE_INDEXER);

async function uploadSingleFile(filePath, label) {
  console.log(`\n======================================================`);
  console.log(` Uploading ${label} to 0G Storage Turbo`);
  console.log(` File Path: ${filePath}`);
  const stats = fs.statSync(filePath);
  console.log(` File Size: ${stats.size} bytes`);
  console.log(`======================================================`);

  const file = await ZgFile.fromFilePath(filePath);
  try {
    const [tree, treeErr] = await file.merkleTree();
    if (treeErr || !tree) throw new Error(`Merkle tree error: ${treeErr}`);
    const rootHash = tree.rootHash();
    console.log(`✓ 32-Byte Merkle Tree Root: ${rootHash}`);

    const [result, uploadErr] = await indexer.upload(file, RPC_URL, wallet);
    if (uploadErr) {
      throw new Error(`Upload error: ${uploadErr.message || uploadErr}`);
    }

    const txHash = 'txHash' in result ? result.txHash : (result.txHashes ? result.txHashes[0] : 'N/A');
    console.log(`✓ Onchain Transaction Hash: ${txHash}`);
    console.log(`✓ 0G Storage Retrieval Link: ${STORAGE_INDEXER}/file?root=${rootHash}`);
    return { rootHash, txHash, size: stats.size };
  } finally {
    await file.close();
  }
}

async function main() {
  console.log('Deployer Address:', wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log('Deployer Balance:', ethers.formatEther(balance), '0G');

  // 1. Upload the static index.html storefront
  const htmlPath = path.resolve(process.cwd(), 'app/out/index.html');
  const htmlResult = await uploadSingleFile(htmlPath, 'Static Storefront (index.html)');

  // 2. Upload the full deployable site bundle archive
  const zipPath = path.resolve(process.cwd(), 'stillworks-site-bundle.zip');
  const zipResult = await uploadSingleFile(zipPath, 'Full Site Distribution Bundle (ZIP)');

  console.log(`\n======================================================`);
  console.log(`           0G LIVE SITE UPLOAD SUMMARY                `);
  console.log(`======================================================`);
  console.log(`Storefront HTML Root: ${htmlResult.rootHash}`);
  console.log(`Storefront HTML Tx:   ${htmlResult.txHash}`);
  console.log(`Site Gateway Link:    ${STORAGE_INDEXER}/file?root=${htmlResult.rootHash}`);
  console.log(`------------------------------------------------------`);
  console.log(`Full Bundle Root:     ${zipResult.rootHash}`);
  console.log(`Full Bundle Tx:       ${zipResult.txHash}`);
  console.log(`Bundle Gateway Link:  ${STORAGE_INDEXER}/file?root=${zipResult.rootHash}`);
  console.log(`======================================================\n`);

  // Write deployment result to file for reference
  const deploymentRecord = {
    deployedAt: new Date().toISOString(),
    network: '0G Galileo Testnet (16602)',
    storefrontHtml: {
      merkleRoot: htmlResult.rootHash,
      txHash: htmlResult.txHash,
      gatewayUrl: `${STORAGE_INDEXER}/file?root=${htmlResult.rootHash}`,
    },
    siteBundleZip: {
      merkleRoot: zipResult.rootHash,
      txHash: zipResult.txHash,
      gatewayUrl: `${STORAGE_INDEXER}/file?root=${zipResult.rootHash}`,
    },
    indexerEndpoint: STORAGE_INDEXER,
    deployer: wallet.address,
  };

  fs.writeFileSync(
    path.resolve(process.cwd(), '0g-live-site-deployment.json'),
    JSON.stringify(deploymentRecord, null, 2)
  );
  console.log('Saved deployment record to 0g-live-site-deployment.json');
}

main().catch(err => {
  console.error('Upload failed:', err);
  process.exit(1);
});
