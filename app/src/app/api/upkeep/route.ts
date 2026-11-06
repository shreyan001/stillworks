import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { ethers } from 'ethers';

export async function POST(request: Request) {
  try {
    const timestamp = new Date().toISOString();

    // Create a deterministic snapshot hash from current timestamp and salt
    const randomSalt = ethers.hexlify(ethers.randomBytes(32));
    const snapshotHash = ethers.keccak256(
      ethers.toUtf8Bytes(`stillworks-telemetry-snapshot-${timestamp}-${randomSalt}`)
    );

    // Save to Upstash Redis
    await redis.set('stillworks:telemetry:latestRoot', snapshotHash);
    await redis.set('stillworks:telemetry:lastUpkeep', timestamp);

    return NextResponse.json({
      success: true,
      epochTimestamp: timestamp,
      snapshotRootHash: snapshotHash,
      hubAddress: '0x6939b3e9FB99Ef0005a3e6dd8Ed223E121c51460',
      creTriggerReady: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
