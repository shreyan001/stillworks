'use client';

import { useState } from 'react';
import {
  Activity,
  Database,
  Clock,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Server,
  Layers,
  Fuel,
} from 'lucide-react';

export function UpkeepMonitor() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [snapshotHash, setSnapshotHash] = useState(
    '0x9a82f3e826b1527bbba64a138c4d59a721d019f39d2c88461abdc09f872194a'
  );
  const [copied, setCopied] = useState(false);
  const [bufferedEvents, setBufferedEvents] = useState(148);
  const [lastSyncTime, setLastSyncTime] = useState('Today at 05:00 IST');
  const [opsBudget, setOpsBudget] = useState('0.485 0G');

  const handleTriggerSnapshot = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const randomHash =
        '0x' +
        Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
      setSnapshotHash(randomHash);
      setBufferedEvents(0);
      setLastSyncTime('Just now');
      setIsSyncing(false);
    }, 1500);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(snapshotHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-zerog-cardBg border border-zerog-border rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zerog-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Autonomous Upkeep &amp; 24h Snapshot Pipeline</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Zero Traditional DB
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Public state streams into in-memory Redis telemetry, flushes every 24 hours to 0G Storage Turbo, and anchors to 0G Galileo.
              </p>
            </div>
          </div>

          <button
            onClick={handleTriggerSnapshot}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Flushing Snapshot to 0G...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Trigger 24h Celery Snapshot</span>
              </>
            )}
          </button>
        </div>

        {/* 3-COLUMN METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          {/* METRIC 1: REDIS CACHE BUFFER */}
          <div className="p-4 rounded-xl bg-black/40 border border-zerog-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Redis In-Memory Buffer</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Live &lt;1ms
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{bufferedEvents} events</div>
            <p className="text-[11px] text-slate-400">
              Heartbeats, listing proposals, and passport diffs buffered in cache before next 0G Turbo batch.
            </p>
          </div>

          {/* METRIC 2: CELERY 24H CADENCE */}
          <div className="p-4 rounded-xl bg-black/40 border border-zerog-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-zerog-purple" />
                <span>Celery Batch Cadence</span>
              </span>
              <span className="text-[10px] font-mono text-zerog-purple bg-zerog-purple/10 px-1.5 py-0.5 rounded">
                Next in 6h 18m
              </span>
            </div>
            <div className="text-sm font-semibold text-white">Last Batch: {lastSyncTime}</div>
            <p className="text-[11px] text-slate-400">
              Orchestrated sidecar daemon compiling structured JSON and computing 32-byte 0G Merkle roots.
            </p>
          </div>

          {/* METRIC 3: DEVELOPER OPERATIONS BUDGET */}
          <div className="p-4 rounded-xl bg-black/40 border border-zerog-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Fuel className="w-3.5 h-3.5 text-amber-400" />
                <span>Developer Ops Budget</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                Sustained
              </span>
            </div>
            <div className="text-2xl font-bold text-amber-300">{opsBudget}</div>
            <p className="text-[11px] text-slate-400">
              Automated 3% escrow routing covering 0G storage gas &amp; compute upkeep. Runway: ~240 days.
            </p>
          </div>
        </div>
      </div>

      {/* LATEST 0G STORAGE MERKLE ROOT SNAPSHOT CARD */}
      <div className="bg-zerog-cardBg border border-zerog-border rounded-2xl p-6 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Active 0G Storage Turbo Checkpoint Hash</h3>
          </div>
          <button
            onClick={handleCopyHash}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Hash'}</span>
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-black/70 border border-zerog-border font-mono text-xs text-cyan-300 break-all select-all">
          {snapshotHash}
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 gap-2">
          <span>Target Indexer: <strong className="text-slate-300">indexer-storage-testnet-turbo.0g.ai</strong></span>
          <span>Target Contract: <strong className="text-slate-300">ProductRegistry.sol (16602)</strong></span>
          <a
            href="https://chainscan-galileo.0g.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zerog-purple hover:underline flex items-center gap-1"
          >
            <span>View Galileo Explorer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
