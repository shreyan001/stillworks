'use client';

import { useState } from 'react';
import { Database, Upload, CheckCircle2, Copy, ExternalLink, FileText, ArrowRight } from 'lucide-react';

export function StorageExplorer() {
  const [content, setContent] = useState(
    JSON.stringify(
      {
        product: 'Stillworks Demo Sovereign Tool',
        version: '1.0.0',
        heartbeat_interval_sec: 3600,
        docker_compose: 'version: "3.8"\nservices:\n  app:\n    image: stillworks/demo:latest\n    ports:\n      - "8080:8080"',
        killswitch_refund_rail: 'SubscriptionEscrow.sol',
        storage_tier: '0G Turbo Log Layer',
      },
      null,
      2
    )
  );

  const [filename, setFilename] = useState('product-passport.json');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    rootHash: string;
    txHash: string;
    indexer: string;
    note?: string;
  } | null>(null);

  const handleUpload = async () => {
    setUploading(true);
    try {
      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: JSON.parse(content),
          filename,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUploadResult(data);
      }
    } catch (err) {
      console.error('Storage upload error', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-zerog-purple" />
            <span>0G Storage (Turbo Layer) Station</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Persist immutable software passports and encrypted walkaway packages to decentralized 0G Storage.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Indexer: <span className="text-zerog-purple">indexer-storage-testnet-turbo.0g.ai</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zerog-cardBg border border-zerog-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-zerog-purple" />
              <span>Passport & Walkaway Payload</span>
            </h3>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="text-[11px] font-mono bg-black/50 border border-zerog-border rounded px-2 py-1 text-slate-300"
              placeholder="filename.json"
            />
          </div>

          <textarea
            rows={11}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-black/60 border border-zerog-border rounded-lg p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-zerog-purple"
          />

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full py-2.5 px-4 rounded-lg bg-zerog-purple hover:bg-zerog-purpleDark text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Publishing to 0G Storage...' : 'Publish to 0G Turbo Storage'}</span>
          </button>
        </div>

        <div className="bg-zerog-cardBg border border-zerog-border rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">0G Storage Attestation Outcome</h3>

            {uploadResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Payload indexed on 0G Storage Turbo! Merkle root verified.</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-black/60 border border-zerog-border space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">32-Byte Merkle Root Hash:</span>
                    <span className="text-xs font-mono text-zerog-purple break-all select-all">
                      {uploadResult.rootHash}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-black/60 border border-zerog-border space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">0G Chain Storage Submission Tx:</span>
                    <span className="text-xs font-mono text-slate-300 break-all select-all">
                      {uploadResult.txHash}
                    </span>
                  </div>

                  {uploadResult.note && (
                    <p className="text-[11px] text-amber-400/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                      {uploadResult.note}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500 border border-dashed border-zerog-border rounded-lg">
                <Database className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs">No file published to storage yet.</p>
                <p className="text-[11px] text-slate-600 mt-1 max-w-sm">
                  Upload payload to obtain the 32-byte Merkle root required by <code>ProductRegistry.sol</code> and <code>SubscriptionAgreement.sol</code>.
                </p>
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-zerog-border/60 text-xs text-slate-400 mt-4">
            <span className="text-white font-semibold">CROPS Invariant:</span> Passports stored here are pinned permanently across independent 0G storage nodes, ensuring no centralized domain takedown can remove the software blueprint.
          </div>
        </div>
      </div>
    </div>
  );
}
