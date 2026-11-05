'use client';

import { useState, useEffect } from 'react';
import { WalletButton } from '@/components/WalletButton';
import { InferenceNoteModule } from '@/components/InferenceNoteModule';
import { MemData, Indexer } from '@0gfoundation/0g-storage-ts-sdk';
import {
  Database,
  Upload,
  Download,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  FileCode2,
  Hash,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Cpu,
  Layers,
} from 'lucide-react';

const INDEXER_URL = 'https://indexer-storage-testnet-turbo.0g.ai';
const DEMO_TESTNET_HASH = '0xf004c8fb08c6c208a40320d96901b737f62d7e9ed2505f3349861c3f606987e2';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'storage' | 'all'>('pipeline');

  // Section 1: Storage Export State
  const [exportInput, setExportInput] = useState(() =>
    JSON.stringify(
      {
        protocol: 'Stillworks',
        version: '1.0.0',
        network: '0G Galileo (Chain ID 16602)',
        storageTier: '0G Turbo Indexer',
        timestamp: new Date().toISOString(),
        passport: {
          appId: 'stillworks-v1',
          author: '0g-sovereign-operator',
          spec: 'Neutral CROPS escrow & verifiable TEE software release',
          invariants: ['censorship-resistant', 'cryptographically-proven', 'sovereign'],
        },
      },
      null,
      2
    )
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<{
    rootHash: string;
    numChunks: number;
    numSegments: number;
    paddedSize: number;
    rawSize: number;
  } | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [copiedRoot, setCopiedRoot] = useState(false);

  // Section 2: Storage Import State
  const [importHash, setImportHash] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    rootHash: string;
    sizeBytes: number;
    isJson: boolean;
    data: any;
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute 0G Merkle Root client-side
  const handleComputeAndExport = async () => {
    if (!exportInput.trim()) {
      setExportError('Please enter text or JSON content to export');
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(exportInput);
      const memData = new MemData(bytes);

      const [tree, err] = await memData.merkleTree();
      if (err || !tree) {
        throw new Error(err?.message || 'Failed to construct 0G Merkle Tree');
      }

      const rootHash = tree.rootHash();
      if (!rootHash) {
        throw new Error('Calculated Merkle root hash is null');
      }

      setExportResult({
        rootHash,
        numChunks: memData.numChunks(),
        numSegments: memData.numSegments(),
        paddedSize: memData.paddedSize(),
        rawSize: bytes.length,
      });
    } catch (err: any) {
      setExportError(err?.message || 'Error calculating 0G Merkle tree');
    } finally {
      setIsExporting(false);
    }
  };

  // Fetch verified data from 0G Turbo Indexer
  const handleFetchImport = async (targetHash?: string) => {
    const hash = (targetHash || importHash).trim();

    if (!hash || !hash.startsWith('0x') || hash.length !== 66) {
      setImportError('Please enter a valid 32-byte hex root hash (0x + 64 hex chars)');
      return;
    }

    setIsImporting(true);
    setImportError(null);
    setImportResult(null);

    try {
      const indexer = new Indexer(INDEXER_URL);
      const [blob, err] = await indexer.downloadToBlob(hash);

      if (err || !blob) {
        throw new Error(err?.message || 'Unable to retrieve root hash from 0G storage nodes');
      }

      const text = await blob.text();
      let parsed = null;
      let isJson = false;

      try {
        parsed = JSON.parse(text);
        isJson = true;
      } catch {
        parsed = text;
      }

      setImportResult({
        rootHash: hash,
        sizeBytes: blob.size,
        isJson,
        data: parsed,
      });
    } catch (err: any) {
      setImportError(
        err?.message ||
          'Failed to download verified data. Ensure root hash is finalized on 0G storage nodes.'
      );
    } finally {
      setIsImporting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedRoot(true);
      setTimeout(() => setCopiedRoot(false), 2000);
    }
  };

  const handleDirectQueryFromPipeline = (rootHash: string) => {
    setActiveTab('storage');
    setImportHash(rootHash);
    handleFetchImport(rootHash);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-6 h-6 animate-spin text-zerog-purple" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* HEADER: 0G Galileo Network + Wagmi Connect Wallet */}
      <header className="rounded-2xl bg-gradient-to-r from-zerog-cardBg via-zerog-cardBg to-black/80 border border-zerog-border p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h1 className="text-xl font-black text-white tracking-tight">
                0G Galileo Network <span className="text-xs font-mono text-zerog-purple bg-zerog-purple/10 px-2 py-0.5 rounded border border-zerog-purple/30">Chain ID: 16602</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Stillworks Bare-Minimum UI — Client-Side 0G Storage Export & Import
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <a
              href="https://chainscan-galileo.0g.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-zerog-purple transition-colors flex items-center gap-1 font-mono"
            >
              <span>Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* TABS NAVIGATION */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zerog-border pb-3">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'pipeline'
              ? 'bg-zerog-purple text-white shadow-lg shadow-zerog-purple/20'
              : 'bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white border border-zerog-border'
          }`}
        >
          <Cpu className="w-4 h-4 text-purple-300" />
          <span>0G Private AI Pipeline</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-purple-200 border border-purple-400/20">
            TEE Enclave
          </span>
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'storage'
              ? 'bg-zerog-purple text-white shadow-lg shadow-zerog-purple/20'
              : 'bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white border border-zerog-border'
          }`}
        >
          <Database className="w-4 h-4 text-purple-300" />
          <span>0G Storage Station</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-300 border border-slate-700">
            Turbo Export &amp; Import
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-zerog-purple text-white shadow-lg shadow-zerog-purple/20'
              : 'bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white border border-zerog-border'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Modules</span>
        </button>
      </div>

      {/* TAB 1: 0G PRIVATE AI PIPELINE */}
      {(activeTab === 'pipeline' || activeTab === 'all') && (
        <InferenceNoteModule onDirectQuery={handleDirectQueryFromPipeline} />
      )}

      {/* TAB 2: STORAGE STATION (SECTIONS 1 & 2) */}
      {(activeTab === 'storage' || activeTab === 'all') && (
        <>
          {/* SECTION 1: STORAGE EXPORT */}
      <section className="bg-zerog-cardBg border border-zerog-border rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-zerog-border/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zerog-purple/10 border border-zerog-purple/30 flex items-center justify-center text-zerog-purple">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Section 1: Storage Export</h2>
              <p className="text-xs text-slate-400">
                Input text/JSON payload and compute authentic 0G cryptographic Merkle tree root client-side.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-black/40 px-2 py-1 rounded border border-zerog-border">
            0G Merkle Tree Engine
          </span>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <FileCode2 className="w-3.5 h-3.5 text-zerog-purple" />
            <span>Payload Data (Text / JSON):</span>
          </label>
          <textarea
            rows={8}
            value={exportInput}
            onChange={(e) => setExportInput(e.target.value)}
            className="w-full bg-black/60 border border-zerog-border rounded-xl p-3.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-zerog-purple transition-all"
            placeholder="Enter JSON or plain text..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleComputeAndExport}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-xl bg-zerog-purple hover:bg-zerog-purpleDark text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Computing Merkle Root...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Compute 0G Merkle Root</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setExportInput(
                JSON.stringify(
                  {
                    timestamp: new Date().toISOString(),
                    sample: 'Stillworks Sovereign Software Assertion',
                    random: Math.random().toString(36).substring(7),
                  },
                  null,
                  2
                )
              );
              setExportResult(null);
            }}
            type="button"
            className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-zerog-border text-xs text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            Reset Sample
          </button>
        </div>

        {exportError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{exportError}</span>
          </div>
        )}

        {exportResult && (
          <div className="rounded-xl bg-black/50 border border-zerog-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>0G Merkle Root Successfully Computed</span>
              </span>
              <button
                onClick={() => copyToClipboard(exportResult.rootHash)}
                className="text-xs text-zerog-purple hover:text-zerog-purpleLight flex items-center gap-1 cursor-pointer font-medium"
              >
                {copiedRoot ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRoot ? 'Copied' : 'Copy Hash'}</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-black/80 border border-zerog-border font-mono text-xs text-zerog-purple break-all select-all">
              {exportResult.rootHash}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 pt-1">
              <div className="p-2 rounded bg-zerog-cardBg border border-zerog-border">
                Raw Size: <strong className="text-white">{exportResult.rawSize} B</strong>
              </div>
              <div className="p-2 rounded bg-zerog-cardBg border border-zerog-border">
                Padded Size: <strong className="text-white">{exportResult.paddedSize} B</strong>
              </div>
              <div className="p-2 rounded bg-zerog-cardBg border border-zerog-border">
                Chunks: <strong className="text-white">{exportResult.numChunks}</strong>
              </div>
              <div className="p-2 rounded bg-zerog-cardBg border border-zerog-border">
                Segments: <strong className="text-white">{exportResult.numSegments}</strong>
              </div>
            </div>

            <button
              onClick={() => {
                setImportHash(exportResult.rootHash);
                handleFetchImport(exportResult.rootHash);
              }}
              className="mt-2 w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Test Query in Section 2 (Import)</span>
              <ArrowRight className="w-3.5 h-3.5 text-zerog-purple" />
            </button>
          </div>
        )}
      </section>

      {/* SECTION 2: STORAGE IMPORT */}
      <section className="bg-zerog-cardBg border border-zerog-border rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-zerog-border/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zerog-purple/10 border border-zerog-purple/30 flex items-center justify-center text-zerog-purple">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Section 2: Storage Import</h2>
              <p className="text-xs text-slate-400">
                Query 0G Turbo Indexer and reconstruct verified payload directly by Merkle root.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-black/40 px-2 py-1 rounded border border-zerog-border">
            0G Turbo Indexer
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-zerog-purple" />
              <span>Root Hash (32-Byte Hex):</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setImportHash(DEMO_TESTNET_HASH);
                handleFetchImport(DEMO_TESTNET_HASH);
              }}
              className="text-[11px] text-zerog-purple hover:underline cursor-pointer"
            >
              Use Verified Testnet Hash
            </button>
          </div>
          <input
            type="text"
            value={importHash}
            onChange={(e) => setImportHash(e.target.value)}
            placeholder="0x..."
            className="w-full bg-black/60 border border-zerog-border rounded-xl px-3.5 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-zerog-purple transition-all"
          />
        </div>

        <button
          onClick={() => handleFetchImport()}
          disabled={isImporting || !importHash.trim()}
          className="px-5 py-2.5 rounded-xl bg-zerog-purple hover:bg-zerog-purpleDark text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          {isImporting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Fetching from 0G Storage Nodes...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Fetch & Verify from 0G Storage</span>
            </>
          )}
        </button>

        {importError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{importError}</span>
          </div>
        )}

        {importResult && (
          <div className="rounded-xl bg-black/50 border border-zerog-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Payload Verified ({importResult.sizeBytes} bytes)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Format: {importResult.isJson ? 'JSON' : 'Plain Text'}
              </span>
            </div>

            <div className="p-3.5 bg-black/80 rounded-lg border border-zerog-border max-h-80 overflow-y-auto">
              <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap break-all">
                {importResult.isJson
                  ? JSON.stringify(importResult.data, null, 2)
                  : String(importResult.data)}
              </pre>
            </div>
          </div>
        )}
      </section>
        </>
      )}
    </div>
  );
}
