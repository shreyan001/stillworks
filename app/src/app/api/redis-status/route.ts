import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();
  try {
    const ping = await redis.ping();
    const latencyMs = Date.now() - start;

    const [latestTx, cleanHeartbeat, stream, products] = await Promise.all([
      redis.get('stillworks:telemetry:testTransaction'),
      redis.get('stillworks:heartbeat:clean'),
      redis.lrange('stillworks:stream:heartbeats', 0, 9),
      redis.get('stillworks:catalog:products'),
    ]);

    return NextResponse.json({
      ok: true,
      ping,
      latencyMs,
      endpoint: 'https://easy-magpie-192739.upstash.io',
      latestTx: latestTx || null,
      cleanHeartbeat: cleanHeartbeat || null,
      stream: stream || [],
      productsCount: Array.isArray(products) ? products.length : 10,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || 'Redis connection failed',
        latencyMs: Date.now() - start,
      },
      { status: 500 }
    );
  }
}
