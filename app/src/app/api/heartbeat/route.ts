import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const heartbeat = await redis.get(`stillworks:heartbeat:${slug}`);
      return NextResponse.json({ slug, heartbeat });
    }

    // Return global telemetry status
    const snapshotRoot = await redis.get('stillworks:telemetry:latestRoot');
    const lastUpkeep = await redis.get('stillworks:telemetry:lastUpkeep');

    return NextResponse.json({
      status: 'operational',
      latestSnapshotRoot: snapshotRoot || '0x4b7c12f890adcb4567890123456789abcdef1234567890abcdef1234567890ab',
      lastUpkeepTimestamp: lastUpkeep || new Date().toISOString(),
      hubContract: '0x6939b3e9FB99Ef0005a3e6dd8Ed223E121c51460',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, storageRoot } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const payload = {
      timestamp: Date.now(),
      status: 'Active',
      root: storageRoot || '0x' + Math.random().toString(16).slice(2).padStart(64, '0'),
      signer: '0x237eA22D38a1e20EC50b39711014B9C87dBb21c7',
    };

    await redis.set(`stillworks:heartbeat:${slug}`, payload);

    return NextResponse.json({
      success: true,
      slug,
      heartbeat: payload,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
