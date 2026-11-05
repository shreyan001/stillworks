'use client';

import { useState } from 'react';
import { Skull, AlertTriangle, ShieldCheck, Download, RefreshCw, DollarSign, CheckCircle2 } from 'lucide-react';

export function EscrowKillswitch() {
  const [stage, setStage] = useState<'HEALTHY' | 'MISSED_HEARTBEAT' | 'REFUNDED'>('HEALTHY');
  const [refundAmount, setRefundAmount] = useState('0.0416 0G');
  const [downloadedBundle, setDownloadedBundle] = useState(false);

  const handleKillServer = () => {
    setStage('MISSED_HEARTBEAT');
  };

  const handleClaimRefund = () => {
    setStage('REFUNDED');
  };

  const handleDownloadWalkaway = () => {
    const bundleText = `# Stillworks Sovereign Walkaway Bundle
# Extracted from 0G Storage Turbo Layer
version: "3.8"
services:
  sovereign-tool:
    image: ghcr.io/stillworks/ghostwriter-core:latest
    environment:
      - OFFLINE_MODE=true
      - ZERO_G_STORAGE_ROOT=0x4f82c9e782631527bbba64a138c4d59a721d019f
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
`;
    const blob = new Blob([bundleText], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'walkaway-docker-compose.yml';
    a.click();
    URL.revokeObjectURL(url);
    setDownloadedBundle(true);
  };

  const handleReset = () => {
    setStage('HEALTHY');
    setDownloadedBundle(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Skull className="w-5 h-5 text-rose-500" />
            <span>CROPS Lead Property: Kill-Switch & Walkaway Rehearsal</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate founder server abandonment, demonstrate automated 0G pro-rata escrow refunds, and claim your walkaway deployment package.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-lg border border-zerog-border hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Simulation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={`p-5 rounded-xl border transition-all ${
          stage === 'HEALTHY'
            ? 'bg-zerog-cardBg border-emerald-500/50 shadow-lg shadow-emerald-500/10'
            : 'bg-black/30 border-zerog-border opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 1: Operational</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h3 className="font-semibold text-white text-sm">Active Heartbeat Escrow</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Deposit of <strong>0.05 0G</strong> locked in <code>SubscriptionEscrow.sol</code>. Founder must post attestations to unlock monthly tranches.
          </p>
          <div className="mt-4 pt-3 border-t border-zerog-border text-xs text-slate-300">
            Current Status: <span className="text-emerald-400 font-semibold">100% Healthy</span>
          </div>
        </div>

        <div className={`p-5 rounded-xl border transition-all ${
          stage === 'MISSED_HEARTBEAT'
            ? 'bg-rose-950/20 border-rose-500/60 shadow-lg shadow-rose-500/10'
            : 'bg-black/30 border-zerog-border'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Step 2: Failure Mode</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <h3 className="font-semibold text-white text-sm">Kill Server / Miss Heartbeat</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Founder server goes dark or company disappears. Grace period expires on 0G Chain without valid heartbeat.
          </p>
          <button
            onClick={handleKillServer}
            disabled={stage !== 'HEALTHY'}
            className="mt-4 w-full py-2 px-3 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Simulate Server Shutdown
          </button>
        </div>

        <div className={`p-5 rounded-xl border transition-all ${
          stage === 'REFUNDED'
            ? 'bg-zerog-cardBg border-zerog-purple shadow-lg shadow-zerog-purple/20'
            : 'bg-black/30 border-zerog-border'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zerog-purple uppercase tracking-wider">Step 3: Sovereign Exit</span>
            <ShieldCheck className="w-4 h-4 text-zerog-purple" />
          </div>
          <h3 className="font-semibold text-white text-sm">Refund & Self-Host</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Escrow unfreezes remaining capital for subscriber. Walkaway bundle on 0G Storage unlocks instantly.
          </p>
          <button
            onClick={handleClaimRefund}
            disabled={stage !== 'MISSED_HEARTBEAT'}
            className="mt-4 w-full py-2 px-3 rounded-lg bg-zerog-purple hover:bg-zerog-purpleDark text-white font-semibold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            Claim Pro-Rata Refund ({refundAmount})
          </button>
        </div>
      </div>

      {stage === 'REFUNDED' && (
        <div className="p-6 rounded-xl bg-gradient-to-r from-zerog-cardBg to-purple-950/30 border border-zerog-purple/40 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Escrow Refund Successfully Claimed on 0G Galileo</span>
              </span>
              <h4 className="text-base font-bold text-white">Your Unlocked Walkaway Package</h4>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Because the founder failed their heartbeat pledge, your remaining <strong>{refundAmount}</strong> was returned to your wallet. You also receive the full standalone docker compose configuration and database snapshot from 0G Storage.
              </p>
            </div>
            <button
              onClick={handleDownloadWalkaway}
              className="px-4 py-2.5 rounded-lg bg-zerog-purple hover:bg-zerog-purpleDark text-white font-semibold text-xs flex items-center gap-2 shadow-lg hover:shadow-zerog-purple/20 transition-all shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloadedBundle ? 'Downloaded!' : 'Download Docker Manifest'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
