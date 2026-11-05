import { NextRequest, NextResponse } from 'next/server';
import { uploadToZeroGStorage } from '@/lib/zerog/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, filename } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const payload = typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content);

    // If private key is configured, perform live upload to 0G Turbo Indexer
    if (process.env.PRIVATE_KEY) {
      const result = await uploadToZeroGStorage(payload, filename || 'passport.json');
      return NextResponse.json({
        success: true,
        rootHash: result.rootHash,
        txHash: result.txHash,
        indexer: process.env.NEXT_PUBLIC_0G_STORAGE_INDEXER || 'https://indexer-storage-testnet-turbo.0g.ai',
      });
    }

    // Mock response if no private key configured yet
    const crypto = await import('crypto');
    const mockHash = '0x' + crypto.createHash('sha256').update(payload).digest('hex');
    return NextResponse.json({
      success: true,
      rootHash: mockHash,
      txHash: '0xmock' + crypto.randomBytes(30).toString('hex'),
      note: 'Offline simulation mode: Add PRIVATE_KEY to .env to broadcast live to 0G Turbo Indexer',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
