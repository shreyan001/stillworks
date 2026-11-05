import { ethers } from 'ethers';
import { ZgFile, Indexer } from '@0gfoundation/0g-storage-ts-sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface StorageUploadResult {
  rootHash: string;
  txHash: string;
}

export async function uploadToZeroGStorage(
  content: string | Buffer,
  filename: string = 'data.json'
): Promise<StorageUploadResult> {
  const indexerRpc = process.env.NEXT_PUBLIC_0G_STORAGE_INDEXER || 'https://indexer-storage-testnet-turbo.0g.ai';
  const chainRpc = process.env.STORAGE_RPC_URL || process.env.NEXT_PUBLIC_0G_RPC_URL || 'https://evmrpc-testnet.0g.ai';
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('PRIVATE_KEY environment variable is required for 0G Storage upload');
  }

  const provider = new ethers.JsonRpcProvider(chainRpc);
  const signer = new ethers.Wallet(privateKey, provider);
  const indexer = new Indexer(indexerRpc);

  const tempFilePath = path.join(os.tmpdir(), `zerog-${Date.now()}-${filename}`);
  fs.writeFileSync(tempFilePath, content);

  let zgFile: any = null;
  try {
    zgFile = await ZgFile.fromFilePath(tempFilePath);
    const [result, error] = await indexer.upload(zgFile, chainRpc, signer);

    if (error) {
      throw new Error(`0G Storage upload failed: ${JSON.stringify(error)}`);
    }

    if (!result) {
      throw new Error('0G Storage upload returned no result');
    }

    const txHash = 'txHash' in result ? (result.txHash as string) : (result.txHashes[0] as string);
    const rootHash = 'rootHash' in result ? (result.rootHash as string) : (result.rootHashes[0] as string);

    return { rootHash, txHash };
  } finally {
    if (zgFile && typeof zgFile.close === 'function') {
      try {
        await zgFile.close();
      } catch (e) {
        // file close ignore
      }
    }
    if (fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {
        // ignore unlink
      }
    }
  }
}
