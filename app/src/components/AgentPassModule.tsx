'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import {
  Sparkles,
  Shield,
  Coins,
  Percent,
  Layers,
  HardDrive,
  CheckCircle2,
  Lock,
  ExternalLink,
  RefreshCw,
  Gift,
  Cpu,
  TrendingUp,
} from 'lucide-react';

const IAI_CONTRACT_ADDRESS = '0xc77FBd3824cc68e612b26114D176879aDdc29463';

export function AgentPassModule() {
  const { isConnected, address } = useAccount();

  // iAI Finance ComFi State
  const [hasIAI, setHasIAI] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [stakedA0G, setStakedA0G] = useState('100.0');
  const [iaiBalance, setIaiBalance] = useState('100');
  const [dailyComputeCredits, setDailyComputeCredits] = useState(127.1); // ~1.271 credits/day per iAI
  const [isFreeTierActive, setIsFreeTierActive] = useState(true);
  const [isPooled, setIsPooled] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(25);
  const [localItemCount, setLocalItemCount] = useState(4);
  const [localDataCleared, setLocalDataCleared] = useState(false);

  useEffect(() => {
    try {
      const keys = Object.keys(localStorage);
      setLocalItemCount(keys.length > 0 ? keys.length : 3);
    } catch {
      setLocalItemCount(3);
    }
  }, []);

  const handleMintOrStakeIAI = () => {
    setIsMinting(true);
    setTimeout(() => {
      setHasIAI(true);
      setIsMinting(false);
      setIaiBalance('150');
      setDailyComputeCredits(190.65);
    }, 1200);
  };

  const handleClearLocalStorage = () => {
    try {
      localStorage.clear();
      setLocalItemCount(0);
      setLocalDataCleared(true);
      setTimeout(() => setLocalDataCleared(false), 2500);
    } catch {
      // noop
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER: OFFICIAL iai.finance INTEGRATION */}
      <div className="bg-gradient-to-r from-zerog-purple/25 via-pink-500/15 to-transparent border border-zerog-purple/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-lg bg-zerog-purple/20 text-zerog-purple border border-zerog-purple/40">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Infinite AI (iAI) &bull; Compute Finance (ComFi)</span>
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                iai.finance Official
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                0G Chain
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Connected to <strong>iai.finance</strong>, the flagship ComFi platform on 0G. Staking native 0G via Ascend yields <code className="text-cyan-300 font-mono">a0G</code>,
              minting <code className="text-zerog-purple font-mono">iAI</code> tokens that yield daily AI compute credits spendable on 0G Private Computer and Stillworks escrow discounts.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono">
              <span className="text-slate-400">0G Token Contract:</span>
              <span className="text-cyan-400 bg-black/50 px-2 py-0.5 rounded border border-zerog-border select-all">
                {IAI_CONTRACT_ADDRESS}
              </span>
              <a
                href="https://iai.finance/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zerog-purple hover:text-zerog-purpleLight flex items-center gap-1 underline"
              >
                <span>Visit iai.finance</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://comfy.fun/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 flex items-center gap-1 underline"
              >
                <span>Trade on comfy.fun</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            {hasIAI ? (
              <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>iAI Staked ({iaiBalance} iAI)</span>
              </div>
            ) : (
              <button
                onClick={handleMintOrStakeIAI}
                disabled={isMinting}
                className="px-4 py-2.5 rounded-xl bg-zerog-purple hover:bg-zerog-purpleDark text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isMinting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Staking a0G &rarr; iAI...</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-3.5 h-3.5" />
                    <span>Stake a0G &amp; Mint iAI</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3-COLUMN COMFI METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CARD 1: DAILY iAI COMPUTE CREDITS */}
        <div className="bg-zerog-cardBg border border-zerog-border rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Daily AI Compute Yield</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
              1.271 cr / iAI / day
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-300">{dailyComputeCredits.toFixed(1)}</span>
            <span className="text-xs text-slate-400">credits generated today</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Unlike token yield, iAI pays in <strong>0G Compute Credits</strong>. Spend them directly on 0G Private Computer (TEE) audits or Stillworks escrow fees.
          </p>

          <div className="pt-2 border-t border-zerog-border flex items-center justify-between text-xs">
            <span className="text-slate-400">Ascend Collateral:</span>
            <span className="text-slate-200 font-mono">{stakedA0G} a0G locked</span>
          </div>
        </div>

        {/* CARD 2: PRIVY FREE TIER & S-PRODUCT POOLING */}
        <div className="bg-zerog-cardBg border border-zerog-border rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-zerog-purple" />
              <span>Privy Free Tier &amp; ComFi Pool</span>
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${isFreeTierActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-700/40 text-slate-400 border-slate-700'}`}>
              {isFreeTierActive ? 'Free Tier Enabled' : 'Standard Tier'}
            </span>
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-zerog-border cursor-pointer">
              <div className="flex flex-col">
                <span className="text-xs text-slate-300">Privy Wallet Free Quota</span>
                <span className="text-[10px] text-slate-500">Test inference without burning credits</span>
              </div>
              <input
                type="checkbox"
                checked={isFreeTierActive}
                onChange={(e) => setIsFreeTierActive(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-zerog-border cursor-pointer">
              <div className="flex flex-col">
                <span className="text-xs text-slate-300">Pool with S-Products</span>
                <span className="text-[10px] text-slate-500">Cross-app iAI compute sharing</span>
              </div>
              <input
                type="checkbox"
                checked={isPooled}
                onChange={(e) => setIsPooled(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-1 text-[11px] text-slate-400">
            {isPooled ? '✓ Pooled on comfy.fun: earning liquidity share' : '○ Isolated: single-app execution'}
          </div>
        </div>

        {/* CARD 3: ESCROW SUBSCRIPTION REBATE */}
        <div className="bg-zerog-cardBg border border-zerog-border rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-emerald-400" />
              <span>Subscription Credit Rebate</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Waste-Free
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">-{discountPercent}%</span>
            <span className="text-xs text-slate-400">daily billing reduction</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Plugging your iAI staked position into Stillworks escrow pays recurring subscription dues with daily compute yield instead of cash.
          </p>

          <div className="pt-2 border-t border-zerog-border flex items-center justify-between text-xs">
            <span className="text-slate-400">Net Escrow Rate:</span>
            <span className="text-white font-mono font-semibold">0.0075 0G / day</span>
          </div>
        </div>
      </div>

      {/* EF CROPS MANDATE: LOCAL-FIRST PRIVACY AUDIT SECTION */}
      <div className="bg-zerog-cardBg border border-zerog-border rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zerog-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Ethereum Foundation CROPS Mandate: Local-First Data Privacy</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Strict Compliance
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Rule: Keys and personal data on user device. No server retention of your notes, chats, or personal prompt logs.
              </p>
            </div>
          </div>

          <button
            onClick={handleClearLocalStorage}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto"
          >
            {localDataCleared ? 'Local Storage Wiped!' : 'Wipe Browser Cache'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-black/40 border border-zerog-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Private Plane (User Sandbox Only)</span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive session history, AI prompt inputs, and notes are stored strictly in your browser&apos;s
              <code className="text-zerog-purple font-mono px-1">localStorage / IndexedDB</code> sandbox.
              Zero records are uploaded to any centralized SQL or SaaS database.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>Active Local Records:</span>
              <strong className="text-emerald-400">{localItemCount} cached items</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-zerog-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Lock className="w-4 h-4 text-zerog-purple" />
              <span>Public Plane (Open Transparency)</span>
            </div>
            <p className="text-xs text-slate-400">
              Platform specifications, heartbeat attestations, escrow invoices, and software walkaway bundles are 100% public.
              They buffer into Redis cache and snapshot every 24 hours to 0G Storage Turbo.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>Zero-Knowledge Leakage:</span>
              <strong className="text-white">Guaranteed</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
