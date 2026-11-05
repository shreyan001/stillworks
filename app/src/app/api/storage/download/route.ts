import { NextRequest, NextResponse } from 'next/server';
import { Indexer } from '@0gfoundation/0g-storage-ts-sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rootHash = searchParams.get('rootHash');

    if (!rootHash || !rootHash.startsWith('0x')) {
      return NextResponse.json({ error: 'Valid 0x rootHash query parameter is required' }, { status: 400 });
    }

    const indexerRpc = process.env.NEXT_PUBLIC_0G_STORAGE_INDEXER || 'https://indexer-storage-testnet-turbo.0g.ai';
    const indexer = new Indexer(indexerRpc);

    const tempDownloadPath = path.join(os.tmpdir(), `zerog-download-${Date.now()}-${rootHash.slice(0, 10)}.bin`);

    try {
      // Third parameter = true enables cryptographic Merkle proof verification
      const err = await indexer.download(rootHash, tempDownloadPath, true);
      if (err) {
        throw new Error(`Download verification failed: ${JSON.stringify(err)}`);
      }

      if (!fs.existsSync(tempDownloadPath)) {
        throw new Error('Downloaded file not found on disk');
      }

      const fileBuffer = fs.readFileSync(tempDownloadPath);
      const contentStr = fileBuffer.toString('utf8');

      // Attempt JSON parse or return string
      let parsed = null;
      try {
        parsed = JSON.parse(contentStr);
      } catch {
        // Not JSON
      }

      return NextResponse.json({
        success: true,
        rootHash,
        verified: true,
        sizeBytes: fileBuffer.length,
        isJson: parsed !== null,
        data: parsed !== null ? parsed : contentStr,
      });
    } finally {
      if (fs.existsSync(tempDownloadPath)) {
        try {
          fs.unlinkSync(tempDownloadPath);
        } catch {
          // ignore unlink error
        }
      }
    }
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Download failed from 0G Storage',
      rootHash: req.nextUrl.searchParams.get('rootHash'),
    }, { status: 500 });
  }
}
