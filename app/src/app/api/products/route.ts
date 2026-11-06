import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { products as seedProducts, type Product } from '@/data/products';

const REDIS_KEY = 'stillworks:catalog:products';

export async function GET() {
  try {
    const cached = await redis.get<Product[]>(REDIS_KEY);

    if (cached && Array.isArray(cached) && cached.length > 0) {
      return NextResponse.json({
        source: 'redis',
        count: cached.length,
        products: cached,
      });
    }

    // Seed Redis with the 10 products if not present
    await redis.set(REDIS_KEY, seedProducts);

    return NextResponse.json({
      source: 'seed-initialized',
      count: seedProducts.length,
      products: seedProducts,
    });
  } catch (error: any) {
    console.error('Redis fetch error:', error);
    // Fallback to static seed data
    return NextResponse.json({
      source: 'fallback',
      count: seedProducts.length,
      products: seedProducts,
      error: error?.message,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.tagline || !body.slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const current = (await redis.get<Product[]>(REDIS_KEY)) || seedProducts;

    const newProduct: Product = {
      slug: body.slug,
      name: body.name,
      tagline: body.tagline,
      pitch: body.pitch || `${body.name} is a sovereign software tool with verified 0G Storage proofs.`,
      category: body.category || 'Developer Tools',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
      stage: 0,
      maxStages: 3,
      cropsMet: { c: true, r: false, o: true, p: true, s: false },
      capitalReleasedPct: 20,
      mrr: '$0',
      vault: '$0',
      backers: 1,
      status: 'launching',
      friends: 1,
      score: 75,
      license: body.license || 'MIT',
      repoUrl: body.repoUrl || 'https://github.com',
      heartbeatUptime: '100%',
      escrowAddress: body.escrowAddress || undefined,
      pricing: {
        free: { name: 'Preview Tier', price: '$0', period: 'Free daily', quota: '1.271 iAI daily compute allowance' },
        pro: { name: 'Pro Monthly', price: '$10', period: '/ month', quota: 'Unlimited local execution, priority keeper upkeep' },
        premium: { name: 'Premium Annual', price: '$7', period: '/ year', quota: 'Prepaid 1-year escrow lock, offline walkaway export' },
      },
      details: [
        { label: 'Storage', value: '0G Storage Turbo Layer (Galileo Chain 16602)' },
        { label: 'Stewardship', value: `${body.opsSlice || 30}% Ops, ${body.contingencySlice || 20}% Contingency, 47.5% Review Lock, 2.5% Hub Upkeep` },
      ],
      cropsEvidence: [
        { code: 'C', label: 'Censorship-Resistant', evidence: '0G Storage decentralized client', status: 'Met' },
        { code: 'O', label: 'Open Source', evidence: body.license || 'MIT', status: 'Met' },
        { code: 'P', label: 'Privacy-First', evidence: 'Local browser memory execution', status: 'Met' },
      ],
      attestationLogs: [
        { date: 'Just now', message: 'Registered in Upstash Redis buffer; queued for 0G Galileo DON anchoring' },
      ],
    };

    // Prepend to catalog and save to Redis
    const updated = [newProduct, ...current.filter((p) => p.slug !== newProduct.slug)];
    await redis.set(REDIS_KEY, updated);

    // Also record initial heartbeat
    await redis.set(`stillworks:heartbeat:${newProduct.slug}`, {
      timestamp: Date.now(),
      status: 'Active',
      root: '0x' + Math.random().toString(16).slice(2).padStart(64, '0'),
    });

    return NextResponse.json({
      success: true,
      product: newProduct,
      totalCount: updated.length,
    });
  } catch (error: any) {
    console.error('Redis save error:', error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
