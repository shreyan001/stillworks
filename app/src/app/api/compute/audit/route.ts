import { NextRequest, NextResponse } from 'next/server';
import { runZeroGComputeAudit } from '@/lib/zerog/compute';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, passportData } = body;

    if (!productName) {
      return NextResponse.json({ error: 'productName is required' }, { status: 400 });
    }

    const audit = await runZeroGComputeAudit(productName, passportData || {});
    return NextResponse.json({
      success: true,
      audit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Audit failed' }, { status: 500 });
  }
}
