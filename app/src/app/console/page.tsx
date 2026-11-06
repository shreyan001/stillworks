'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WalletButton } from '@/components/WalletButton';
import { InferenceNoteModule } from '@/components/InferenceNoteModule';
import { AgentPassModule } from '@/components/AgentPassModule';
import { UpkeepMonitor } from '@/components/UpkeepMonitor';
import { MemData, Indexer } from '@0gfoundation/0g-storage-ts-sdk';
import {
  Database,
  Upload,
  Download,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Cpu,
  Layers,
  ShieldCheck,
} from 'lucide-react';

const INDEXER_URL = 'https://indexer-storage-testnet-turbo.0g.ai';
const DEMO_TESTNET_HASH = '0xf004c8fb08c6c208a40320d96901b737f62d7e9ed2505f3349861c3f606987e2';

export default function ConsolePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'storage' | 'pipeline' | 'agentpass' | 'upkeep'>('overview');

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
          appId: 'clean-v1',
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

      const rootHash = (tree as any).root();
      const numSegments = (tree as any).numSegments();
      const numChunks = memData.numChunks();

      setExportResult({
        rootHash,
        numChunks,
        numSegments,
        paddedSize: numSegments * 256 * 1024,
        rawSize: bytes.length,
      });
    } catch (err: any) {
      setExportError(err?.message || 'Failed to compute Merkle Tree');
    } finally {
      setIsExporting(false);
    }
  };

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
        err?.message || 'Failed to download verified data. Ensure root hash is finalized on 0G storage nodes.'
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

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-6 h-6 animate-spin text-purple-700" />
      </div>
    );
  }

  return (
    <div className="wrap">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 pt-6 pb-4 text-xs font-mono" style={{ color: 'var(--mut)' }}>
        <Link href="/" className="hover:text-purple-700">Marketplace</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>Console</span>
      </div>

      {/* Header Box */}
      <div className="box mk">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="mono text-purple-700">0G Galileo Testnet (Chain ID 16602)</span>
            </div>
            <h1 className="d text-3xl mt-1">Maker Console · Clean</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--mut)' }}>
              Autonomous telemetry, escrow release management, and client-side 0G Storage Turbo sync.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://chainscan-galileo.0g.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="btn text-xs font-mono"
              style={{ height: '36px', padding: '0 12px' }}
            >
              <span>Galileo Scan</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
            <WalletButton />
          </div>
        </div>
      </div>

      {/* Overview Indicators */}
      <div className="grid-cells c4 mk mt-6">
        <div>
          <div className="mono">Verified MRR</div>
          <div className="d text-3xl mt-1">$6,240</div>
        </div>
        <div>
          <div className="mono">In Escrow Vault</div>
          <div className="d text-3xl mt-1">$42,800</div>
        </div>
        <div>
          <div className="mono">Released Upfront</div>
          <div className="d text-3xl mt-1">70%</div>
        </div>
        <div>
          <div className="mono">Visitors (30d)</div>
          <div className="d text-3xl mt-1">14.8k</div>
        </div>
      </div>

      {/* Console Tabs */}
      <div className="flex flex-wrap gap-2 mt-8 border-b pb-3" style={{ borderColor: 'var(--line)' }}>
        {[
          { id: 'overview', label: 'Overview & Receivables', icon: Layers },
          { id: 'pipeline', label: '0G Private AI TEE', icon: Cpu },
          { id: 'storage', label: '0G Storage Station', icon: Database },
          { id: 'agentpass', label: 'ComFi AgentPass (iAI)', icon: ShieldCheck },
          { id: 'upkeep', label: 'Autonomous Upkeep', icon: RefreshCw },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`chip cursor-pointer transition flex items-center gap-1.5 ${
                isActive ? 'p' : 'hover:bg-neutral-100'
              }`}
              style={{ height: '34px', padding: '0 14px', fontSize: '12px' }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {/* TAB 1: OVERVIEW & RECEIVABLES */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="box">
                <span className="mono">Stewardship Cashflow Split</span>
                <div className="space-y-3 mt-4 text-xs font-mono">
                  <div className="flex justify-between pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
                    <span className="text-neutral-500">30% Operations Reserve (Gas Subsidy):</span>
                    <b>$1,872 USDT</b>
                  </div>
                  <div className="flex justify-between pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
                    <span className="text-neutral-500">20% Contingency Vault (Bug Fixes):</span>
                    <b>$1,248 USDT</b>
                  </div>
                  <div className="flex justify-between pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
                    <span className="text-neutral-500">50% Developer Review Disbursed:</span>
                    <b className="text-purple-700">$3,120 USDT</b>
                  </div>
                </div>
              </div>

              <div className="box">
                <span className="mono">Live Uptime Attestation</span>
                <div className="space-y-3 mt-4 text-xs font-mono">
                  <div className="flex justify-between pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
                    <span className="text-neutral-500">Heartbeat Status:</span>
                    <span className="text-emerald-700 font-bold">100% Attested (Epoch #142)</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
                    <span className="text-neutral-500">Next Scheduled Heartbeat:</span>
                    <span>in 3h 12m (Chainlink CRE)</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
                    <span className="text-neutral-500">Grace Window:</span>
                    <span>2 hours remaining</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="box" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Agreement</th>
                    <th>Subscriber</th>
                    <th>Amount</th>
                    <th>Audit Request ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'INV-1042', ag: '0x9f81…2c4e', sub: '0x400…500', amt: '10.00 USDT', trace: '0g-audit-7f9a', stat: 'Released' },
                    { id: 'INV-1041', ag: '0x3a12…9812', sub: '0x712…123', amt: '10.00 USDT', trace: '0g-audit-12bc', stat: 'Released' },
                    { id: 'INV-1040', ag: '0x88ff…1200', sub: '0x992…441', amt: '7.00 USDT', trace: '0g-audit-88a1', stat: 'Review Lock' },
                  ].map((inv) => (
                    <tr key={inv.id}>
                      <td className="font-mono font-bold text-xs">{inv.id}</td>
                      <td className="font-mono text-xs">{inv.ag}</td>
                      <td className="font-mono text-xs">{inv.sub}</td>
                      <td className="font-mono text-xs font-semibold">{inv.amt}</td>
                      <td className="font-mono text-xs text-neutral-400">{inv.trace}</td>
                      <td>
                        <span className={`chip ${inv.stat === 'Released' ? 'p' : ''}`}>
                          {inv.stat}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: 0G PRIVATE AI TEE */}
        {activeTab === 'pipeline' && (
          <div className="box">
            <InferenceNoteModule onDirectQuery={handleFetchImport} />
          </div>
        )}

        {/* TAB 3: STORAGE STATION */}
        {activeTab === 'storage' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* EXPORT SECTION */}
            <div className="box space-y-4">
              <div>
                <span className="mono text-purple-700">Client-Side Export</span>
                <h3 className="d text-xl mt-1">Compute 0G Merkle Root</h3>
                <p className="text-xs text-neutral-500">
                  Runs purely in your browser memory via @0gfoundation/0g-storage-ts-sdk MemData.
                </p>
              </div>

              <textarea
                value={exportInput}
                onChange={(e) => setExportInput(e.target.value)}
                className="w-full h-44 p-3 border font-mono text-xs bg-neutral-50 rounded-sm"
              />

              {exportError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                  {exportError}
                </div>
              )}

              <button
                onClick={handleComputeAndExport}
                disabled={isExporting}
                className="btn p w-full font-mono text-xs"
              >
                {isExporting ? 'Computing Merkle Tree...' : 'Compute 32-Byte Merkle Root'}
              </button>

              {exportResult && (
                <div className="p-4 bg-purple-50/50 border border-purple-200 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Root Hash:</span>
                    <button
                      onClick={() => copyToClipboard(exportResult.rootHash)}
                      className="text-purple-700 underline font-bold"
                    >
                      {copiedRoot ? 'Copied!' : exportResult.rootHash.slice(0, 18) + '…'}
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Chunks:</span>
                    <b>{exportResult.numChunks}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Padded Size:</span>
                    <b>{(exportResult.paddedSize / 1024).toFixed(0)} KB</b>
                  </div>
                </div>
              )}
            </div>

            {/* IMPORT SECTION */}
            <div className="box space-y-4">
              <div>
                <span className="mono text-purple-700">Decentralized Retrieval</span>
                <h3 className="d text-xl mt-1">Download from 0G Turbo</h3>
                <p className="text-xs text-neutral-500">
                  Fetches binary chunks by 32-byte Merkle root directly from storage nodes.
                </p>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="0x... (32-byte Merkle root)"
                  value={importHash}
                  onChange={(e) => setImportHash(e.target.value)}
                  className="w-full h-10 px-3 border border-neutral-300 font-mono text-xs rounded-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImportHash(DEMO_TESTNET_HASH);
                    handleFetchImport(DEMO_TESTNET_HASH);
                  }}
                  className="text-[11px] text-purple-700 underline font-mono mt-1 inline-block"
                >
                  Load demo testnet root hash
                </button>
              </div>

              {importError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                  {importError}
                </div>
              )}

              <button
                onClick={() => handleFetchImport()}
                disabled={isImporting}
                className="btn w-full font-mono text-xs"
              >
                {isImporting ? 'Downloading from 0G Turbo...' : 'Download & Rehydrate Data'}
              </button>

              {importResult && (
                <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs font-mono space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Retrieved Size:</span>
                    <b>{importResult.sizeBytes} bytes</b>
                  </div>
                  <pre className="p-2 bg-white border max-h-40 overflow-y-auto text-[10px]">
                    {importResult.isJson
                      ? JSON.stringify(importResult.data, null, 2)
                      : String(importResult.data)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AGENTPASS */}
        {activeTab === 'agentpass' && (
          <div className="box">
            <AgentPassModule />
          </div>
        )}

        {/* TAB 5: UPKEEP MONITOR */}
        {activeTab === 'upkeep' && (
          <div className="box">
            <UpkeepMonitor />
          </div>
        )}
      </div>
    </div>
  );
}
