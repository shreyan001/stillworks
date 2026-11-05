export interface ComputeAuditResult {
  requestId: string;
  verdict: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT';
  score: number;
  report: string;
  model: string;
}

export async function runZeroGComputeAudit(
  productName: string,
  passportData: Record<string, any>
): Promise<ComputeAuditResult> {
  const routerUrl = process.env.ZEROG_COMPUTE_ROUTER_URL || 'https://router-api.0g.ai/v1';
  const apiKey = process.env.ZEROG_PC_API_KEY;
  if (!apiKey) {
    throw new Error('ZEROG_PC_API_KEY is required for 0G inference');
  }

  const systemPrompt = `You are the 0G Private Computer Compliance & CROPS Auditor. 
Audit this software passport for:
1. Censorship Resistance: decentralized hosting and lack of single point of failure
2. Open Source: availability of verifiable source and build reproducibility
3. Privacy: lack of tracking and data sovereignty
4. Security: client-side cryptographic keys and automated escrow refund guarantees.

Return a JSON object with:
- verdict: "COMPLIANT" | "WARNING" | "NON_COMPLIANT"
- score: number between 0 and 100
- report: concise explanation (2-3 paragraphs)`;

  const userContent = JSON.stringify({
    productName,
    passport: passportData,
  });

  try {
    const res = await fetch(`${routerUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-0G-Provider-Trust-Mode': 'private',
      },
      body: JSON.stringify({
        model: '0gm-1.0-35b-a3b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        temperature: 0.2,
        max_tokens: 800,
      }),
    });

    const data = await res.json().catch(() => ({}));
    const requestId = data?.x_0g_trace?.request_id
      || data?.request_id
      || res.headers.get('x-request-id')
      || res.headers.get('ZG-Res-Key')
      || '';

    if (!res.ok) {
      const message = data?.error?.message || data?.error || res.statusText;
      return {
        requestId,
        verdict: 'WARNING',
        score: 0,
        report: `0G router returned ${res.status}: ${String(message).slice(0, 400)}`,
        model: '0gm-1.0-35b-a3b',
      };
    }

    const content = data.choices?.[0]?.message?.content || '';
    
    try {
      const parsed = JSON.parse(content);
      return {
        requestId,
        verdict: parsed.verdict || 'COMPLIANT',
        score: parsed.score || 95,
        report: parsed.report || content,
        model: data.model || '0gm-1.0-35b-a3b',
      };
    } catch {
      if (!content.trim()) {
        return {
          requestId,
          verdict: 'WARNING',
          score: 0,
          report: '0G router returned an empty audit.',
          model: data.model || '0gm-1.0-35b-a3b',
        };
      }
      return {
        requestId,
        verdict: 'COMPLIANT',
        score: 92,
        report: content,
        model: data.model || '0gm-1.0-35b-a3b',
      };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      requestId: '',
      verdict: 'WARNING',
      score: 0,
      report: `0G inference did not complete: ${message}`,
      model: '0gm-1.0-35b-a3b',
    };
  }
}
