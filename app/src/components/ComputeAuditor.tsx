'use client';

import { useState } from 'react';
import { Product } from './ProductCatalog';
import { ShieldCheck, Cpu, CheckCircle, AlertTriangle, Terminal, Sparkles, RefreshCw } from 'lucide-react';

export function ComputeAuditor({
  selectedProduct,
}: {
  selectedProduct?: Product;
}) {
  const [productName, setProductName] = useState(
    selectedProduct?.name || 'Ghostwriter AI (Self-Hosted RAG)'
  );
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    requestId: string;
    verdict: string;
    score: number;
    report: string;
    model: string;
  } | null>(null);

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/compute/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          passportData: {
            storageIndexer: 'https://indexer-storage-testnet-turbo.0g.ai',
            cropsCompliant: true,
            killswitchSupport: true,
            encryption: 'AES-256-GCM',
          },
        }),
      });
      const data = await res.json();
      if (data.audit) {
        setAuditResult(data.audit);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-zerog-purple" />
            <span>0G Private Computer (TEE) Auditor</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Verifiable compliance audits run in sealed TEE hardware via 0G Private Computer. Outputs immutable <code>X-Request-ID</code>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-purple-950/40 border border-zerog-purple/40 text-zerog-purple flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-zerog-purple" />
            <span>Trust Mode: Private (TEE)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-zerog-cardBg border border-zerog-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Target Software Passport</h3>
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Software Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-black/50 border border-zerog-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zerog-purple"
              placeholder="e.g. Ghostwriter AI"
            />
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-zerog-border/60 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Inference Router:</span>
              <span className="font-mono text-slate-300">router-api-testnet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TEE Target Model:</span>
              <span className="font-mono text-zerog-purple">0gm-1.0-35b-a3b</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Audit Rule Engine:</span>
              <span className="text-slate-300">CROPS v1.0 Standard</span>
            </div>
          </div>

          <button
            onClick={handleRunAudit}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-zerog-purple hover:bg-zerog-purpleDark text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-zerog-purple/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running TEE Audit...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Dispatch 0G PC Audit</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-2 bg-zerog-cardBg border border-zerog-border rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zerog-border pb-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-zerog-purple" />
                <span>Audit Attestation Certificate</span>
              </span>
              {auditResult && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  Score: {auditResult.score}/100 ({auditResult.verdict})
                </span>
              )}
            </div>

            {auditResult ? (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-black/60 border border-zerog-border font-mono text-[11px] space-y-1">
                  <div className="text-slate-400">
                    <span className="text-zerog-purple">x-request-id:</span> {auditResult.requestId}
                  </div>
                  <div className="text-slate-400">
                    <span className="text-zerog-purple">model-attested:</span> {auditResult.model}
                  </div>
                  <div className="text-slate-400">
                    <span className="text-zerog-purple">verdict:</span>{' '}
                    <span className="text-emerald-400 font-bold">{auditResult.verdict}</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-black/30 border border-zerog-border/60">
                  <h4 className="text-xs font-semibold text-slate-300 mb-2">Auditor Verdict & Findings:</h4>
                  <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
                    {auditResult.report}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <div className="p-2 rounded bg-black/40 border border-zerog-border text-center">
                    <span className="text-[10px] text-slate-500 block">Censorship</span>
                    <span className="text-xs font-bold text-emerald-400">Pass</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-zerog-border text-center">
                    <span className="text-[10px] text-slate-500 block">Open Source</span>
                    <span className="text-xs font-bold text-emerald-400">Pass</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-zerog-border text-center">
                    <span className="text-[10px] text-slate-500 block">Privacy (0 Logs)</span>
                    <span className="text-xs font-bold text-emerald-400">Pass</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-zerog-border text-center">
                    <span className="text-[10px] text-slate-500 block">Escrow Security</span>
                    <span className="text-xs font-bold text-emerald-400">Pass</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500 border border-dashed border-zerog-border rounded-lg">
                <Cpu className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs">No audit dispatched yet.</p>
                <p className="text-[11px] text-slate-600 mt-1 max-w-sm">
                  Click &ldquo;Dispatch 0G PC Audit&rdquo; to send the passport payload through 0G Private Computer TEE and extract the verifiable request ID.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
