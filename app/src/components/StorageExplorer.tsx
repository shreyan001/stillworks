'use client';

import { useState } from 'react';
import { Database, Upload, Download, CheckCircle2, Copy, RefreshCw, FileText, Search, ArrowRight, ShieldCheck } from 'lucide-react';

export function StorageExplorer() {
  const [activeMode, setActiveMode] = useState<'export' | 'import'>('export');

  // Export State
  const [exportPayload, setExportPayload] = useState(
    JSON.stringify(
      {
        type: '0G Storage Verification Payload',
        timestamp: new Date().toISOString(),
        network: '0G Galileo (Chain ID 16602)',
        storageTier: 'Turbo Indexer',
        metadata: {
          author: 'Stillworks Verified Operator',
          purpose: 'Decentralized Data Persistence Test',
        },
      },
      null,
      2
    )
  );
  const [exportFilename, setExportFilename] = useState('payload.json');
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<{
    rootHash: string;
    txHash: string;
    indexer: string;
    note?: string;
  } | null>(null);

  // Import State
  const [importHash, setImportHash] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    rootHash: string;
    verified: boolean;
    sizeBytes: number;
    isJson: boolean;
    data: any;
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    setExportResult(null);
    try {
      let contentToSend = exportPayload;
      try {
        contentToSend = JSON.parse(exportPayload);
      } catch {
        // Raw string
      }

      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: contentToSend,
          filename: exportFilename,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExportResult(data);
        setImportHash(data.rootHash);
      } else {
        alert(data.error || 'Export failed');
      }
    } catch (err: any) {
      alert(`Export error: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (targetHash?: string) => {
    const hash = targetHash || importHash;
    if (!hash || !hash.startsWith('0x')) {
      setImportError('Please enter a valid 0x-prefixed 32-byte Merkle root hash');
      return;
    }

    setImporting(true);
    setImportError(null);
    setImportResult(null);

    try {
      const res = await fetch(`/api/storage/download?rootHash=${encodeURIComponent(hash)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        setImportError(data.error || 'Failed to retrieve file from 0G storage nodes');
      } else {
        setImportResult(data);
      }
    } catch (err: any) {
      setImportError(err.message || 'Network error querying 0G indexer');
    } finally {
      setImporting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zerog-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-zerog-purple" />
            <span>0G Storage Station: Import & Export</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Publish data to 0G Turbo Indexer and retrieve verified payloads using 32-byte cryptographic Merkle roots.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-black/60 p-1 rounded-lg border border-zerog-border">
          <button
            onClick={() => setActiveMode('export')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'export'
                ? 'bg-zerog-purple text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Export (Upload)</span>
          </button>
          <button
            onClick={() => setActiveMode('import')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'import'
                ? 'bg-zerog-purple text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Import (Download)</span>
          </button>
        </div>
      </div>

      {/* EXPORT MODE */}
      {activeMode === 'export' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zerog-cardBg border border-zerog-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-zerog-purple" />
                <span>Data Payload to Export</span>
              </h3>
              <input
                type="text"
                value={exportFilename}
                onChange={(e) => setExportFilename(e.target.value)}
                className="text-[11px] font-mono bg-black/50 border border-zerog-border rounded px-2 py-1 text-slate-300"
                placeholder="filename.json"
              />
            </div>

            <textarea
              rows={12}
              value={exportPayload}
              onChange={(e) => setExportPayload(e.target.value)}
              className="w-full bg-black/60 border border-zerog-border rounded-lg p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-zerog-purple"
            />

            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full py-2.5 px-4 rounded-lg bg-zerog-purple hover:bg-zerog-purpleDark text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Merkle Tree & Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Export to 0G Turbo Storage</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-zerog-cardBg border border-zerog-border rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Export Result & Merkle Root</h3>

              {exportResult ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Payload successfully indexed! Merkle root calculated.</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-black/60 border border-zerog-border space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">32-Byte Merkle Root Hash:</span>
                        <button
                          onClick={() => copyToClipboard(exportResult.rootHash)}
                          className="text-[10px] text-zerog-purple hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <span className="text-xs font-mono text-zerog-purple break-all select-all block">
                        {exportResult.rootHash}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-black/60 border border-zerog-border space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Submission Tx Hash:</span>
                      <span className="text-xs font-mono text-slate-300 break-all select-all block">
                        {exportResult.txHash}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveMode('import');
                        handleImport(exportResult.rootHash);
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-white font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>Verify & Download in Import Tab</span>
                      <ArrowRight className="w-3.5 h-3.5 text-zerog-purple" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500 border border-dashed border-zerog-border rounded-lg">
                  <Database className="w-8 h-8 text-slate-600 mb-2" />
                  <p className="text-xs">No export performed yet.</p>
                  <p className="text-[11px] text-slate-600 mt-1 max-w-sm">
                    Click &ldquo;Export to 0G Turbo Storage&rdquo; to publish your payload and receive the verifiable 32-byte root hash.
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-zerog-border/60 text-xs text-slate-400 mt-4">
              <strong>Storage Invariant:</strong> The root hash represents the cryptographic root of the Merkle tree constructed from the file segments, enabling verifiable downloads.
            </div>
          </div>
        </div>
      )}

      {/* IMPORT MODE */}
      {activeMode === 'import' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zerog-cardBg border border-zerog-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-zerog-purple" />
              <span>Query by 0G Merkle Root Hash</span>
            </h3>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Root Hash (32-Byte hex)</label>
              <input
                type="text"
                value={importHash}
                onChange={(e) => setImportHash(e.target.value)}
                placeholder="0x..."
                className="w-full bg-black/60 border border-zerog-border rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-zerog-purple"
              />
            </div>

            <button
              onClick={() => handleImport()}
              disabled={importing || !importHash}
              className="w-full py-2.5 px-4 rounded-lg bg-zerog-purple hover:bg-zerog-purpleDark text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {importing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Fetching & Validating Merkle Proof...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Retrieve from 0G Storage</span>
                </>
              )}
            </button>

            {importError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {importError}
              </div>
            )}
          </div>

          <div className="bg-zerog-cardBg border border-zerog-border rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Retrieved Information</h3>
                {importResult && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Merkle Verified ({importResult.sizeBytes} bytes)</span>
                  </span>
                )}
              </div>

              {importResult ? (
                <div className="space-y-3">
                  <div className="p-3 bg-black/60 rounded-lg border border-zerog-border max-h-72 overflow-y-auto">
                    <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap">
                      {typeof importResult.data === 'object'
                        ? JSON.stringify(importResult.data, null, 2)
                        : String(importResult.data)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500 border border-dashed border-zerog-border rounded-lg">
                  <Download className="w-8 h-8 text-slate-600 mb-2" />
                  <p className="text-xs">No file imported yet.</p>
                  <p className="text-[11px] text-slate-600 mt-1 max-w-sm">
                    Enter any 0G root hash to query the storage nodes and fetch the verified content.
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-zerog-border/60 text-xs text-slate-400 mt-4">
              <strong>Cryptographic Verification:</strong> Data is reconstructed from 0G storage fragment nodes and validated against the Merkle root hash before delivery.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
