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
const rawKey = process.env.PRIVATE_KEY || readEnv('PRIVATE_KEY') || readEnv('DEPLOYER_PRIVATE_KEY');
const PRIVATE_KEY = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;

const USDT_ADDRESS = '0x6A8c371B01A9b9657c3bfbF8677c96408145B512';
const CLEAN_ESCROW_ADDRESS = '0x153badA8AB7C65DAF3a90f581E6b34AB7cAC543a';
const ZEROG_SERVING_BROKER = '0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log('🚀 Deploying Stillworks Hourly & Waterfall Protocol Hubs to 0G Galileo...');
  console.log(`Deployer: ${wallet.address}`);
  const balance = await provider.getBalance(wallet.address);
  console.log(`Deployer Balance: ${ethers.formatEther(balance)} 0G`);

  // 1. Load Artifacts
  const hourlyHubArtifact = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'contracts/out/StillworksHourlyProtocolHub.sol/StillworksHourlyProtocolHub.json'), 'utf8')
  );
  const waterfallHubArtifact = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'contracts/out/WaterfallContingencyHub.sol/WaterfallContingencyHub.json'), 'utf8')
  );

  // 2. Deploy StillworksHourlyProtocolHub
  console.log('\n[1/4] Deploying StillworksHourlyProtocolHub...');
  const HourlyHubFactory = new ethers.ContractFactory(hourlyHubArtifact.abi, hourlyHubArtifact.bytecode.object, wallet);
  const hourlyHub = await HourlyHubFactory.deploy(USDT_ADDRESS, wallet.address);
  await hourlyHub.waitForDeployment();
  const hourlyHubAddress = await hourlyHub.getAddress();
  const hourlyHubDeployTx = hourlyHub.deploymentTransaction();
  console.log(`✅ StillworksHourlyProtocolHub deployed at: ${hourlyHubAddress}`);
  console.log(`   Deploy Tx: ${hourlyHubDeployTx?.hash}`);

  // 3. Deploy WaterfallContingencyHub
  console.log('\n[2/4] Deploying WaterfallContingencyHub...');
  const WaterfallHubFactory = new ethers.ContractFactory(waterfallHubArtifact.abi, waterfallHubArtifact.bytecode.object, wallet);
  const waterfallHub = await WaterfallHubFactory.deploy(USDT_ADDRESS);
  await waterfallHub.waitForDeployment();
  const waterfallHubAddress = await waterfallHub.getAddress();
  const waterfallHubDeployTx = waterfallHub.deploymentTransaction();
  console.log(`✅ WaterfallContingencyHub deployed at: ${waterfallHubAddress}`);
  console.log(`   Deploy Tx: ${waterfallHubDeployTx?.hash}`);

  // 4. Register Clean on Hourly Hub
  console.log('\n[3/4] Registering Clean flagship product on StillworksHourlyProtocolHub...');
  const cleanSlugHash = ethers.id('clean');
  const initialStorageHash = '0x20e807406258f81de5e4f5da6c479d8db2492bd952b1e56e040ef69a53db5c69';
  const regTx = await hourlyHub.registerListing(
    cleanSlugHash,
    wallet.address,
    CLEAN_ESCROW_ADDRESS,
    ZEROG_SERVING_BROKER,
    initialStorageHash
  );
  await regTx.wait();
  console.log(`✅ Clean registered on Hourly Hub! Tx: ${regTx.hash}`);

  // 5. Link Escrow to Waterfall Hub
  console.log('\n[4/4] Linking Clean Escrow on WaterfallContingencyHub...');
  const linkTx = await waterfallHub.linkProductEscrow(1, CLEAN_ESCROW_ADDRESS);
  await linkTx.wait();
  console.log(`✅ Clean Escrow linked to Waterfall Hub! Tx: ${linkTx.hash}`);

  // 6. Save Deployment Manifest
  const deploymentManifest = {
    network: '0G Galileo Testnet',
    chainId: 16602,
    deployedAt: new Date().toISOString(),
    contracts: {
      usdt: USDT_ADDRESS,
      cleanEscrow: CLEAN_ESCROW_ADDRESS,
      zerogServingBroker: ZEROG_SERVING_BROKER,
      hourlyProtocolHub: hourlyHubAddress,
      waterfallContingencyHub: waterfallHubAddress,
    },
    txHashes: {
      hourlyProtocolHubDeploy: hourlyHubDeployTx?.hash,
      waterfallContingencyHubDeploy: waterfallHubDeployTx?.hash,
      registerClean: regTx.hash,
      linkCleanEscrow: linkTx.hash,
    }
  };

  const manifestPath = path.join(rootDir, 'contracts/deployed-0g-galileo.json');
  fs.writeFileSync(manifestPath, JSON.stringify(deploymentManifest, null, 2), 'utf8');
  console.log(`\n🎉 All contracts deployed and verified on 0G Galileo! Manifest saved to: ${manifestPath}`);
}

main().catch((err) => {
  console.error('Deployment error:', err);
  process.exit(1);
});
