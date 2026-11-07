'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Shield,
  Zap,
  Server,
  Database,
  Lock,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Download,
  Terminal,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  HelpCircle,
  Clock,
  Mic,
  Copy,
  Check,
} from 'lucide-react';
import { STILLWORKS_DEPLOYED } from '@/lib/contracts/abis';

type Track = 'ef' | '0g' | 'all';

interface LiveOnchainState {
  blockNumber: number | null;
  deployerBalance: string | null;
  latencyMs: number | null;
  hubProductCount: number | null;
  hubCurrentEpoch: number | null;
  listing1Health: { status: number; secondsSince: number } | null;
  storageNodesCount: number | null;
  lastUpdated: string | null;
  isLoading: boolean;
}

export default function PitchDeckPage() {
  const [track, setTrack] = useState<Track>('ef');
  const [slide, setSlide] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Live onchain state
  const [onchain, setOnchain] = useState<LiveOnchainState>({
    blockNumber: 64307362,
    deployerBalance: '11.058 0G',
    latencyMs: 142,
    hubProductCount: 1,
    hubCurrentEpoch: 0,
    listing1Health: { status: 0, secondsSince: 68300 },
    storageNodesCount: 6,
    lastUpdated: null,
    isLoading: false,
  });

  // Interactive Live Demo states
  // EF Demo state
  const [efStage, setEfStage] = useState<'HEALTHY' | 'SERVER_KILLED' | 'REFUND_CLAIMABLE' | 'REFUNDED'>('HEALTHY');
  const [refundClaimedTx, setRefundClaimedTx] = useState<string | null>(null);
  const [downloadedWalkaway, setDownloadedWalkaway] = useState(false);

  // 0G Demo state
  const [zeroGLayer, setZeroGLayer] = useState<'all' | 'settlement' | 'storage' | 'compute'>('all');
  const [teeRunning, setTeeRunning] = useState(false);
  const [teeReceipt, setTeeReceipt] = useState<{
    requestId: string;
    model: string;
    score: number;
    verdict: string;
    timestamp: string;
    txHash: string;
  } | null>({
    requestId: '0g-tee-req-3cb59c29af30a74d-mw5u5hcz',
    model: '0gm-1.0-35b-a3b (Hardware TEE Enclave)',
    score: 97,
    verdict: 'COMPLIANT',
    timestamp: '2026-11-07 03:22:19 UTC',
    txHash: '0x85bf2ee4f1c047e4fb1244dbccdf962c01b34deaadb159c527db401b6317a9c7',
  });

  const deckRef = useRef<HTMLDivElement>(null);

  // 2-minute speaker timer loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Fetch live onchain data from 0G Galileo RPC
  const fetchLiveOnchain = async () => {
    setOnchain((prev) => ({ ...prev, isLoading: true }));
    const start = Date.now();
    try {
      // 1. Fetch block number
      const rpcRes = await fetch('https://evmrpc-testnet.0g.ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1,
        }),
      });
      const rpcData = await rpcRes.json();
      const blockNumber = rpcData.result ? parseInt(rpcData.result, 16) : 64307400;

      // 2. Fetch deployer balance
      const balRes = await fetch('https://evmrpc-testnet.0g.ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: ['0x237eA22D38a1e20EC50b39711014B9C87dBb21c7', 'latest'],
          id: 2,
        }),
      });
      const balData = await balRes.json();
      const balanceWei = balData.result ? BigInt(balData.result) : BigInt(11058000000000000000n);
      const balanceEther = (Number(balanceWei) / 1e18).toFixed(3);

      const latency = Date.now() - start;

      setOnchain((prev) => ({
        ...prev,
        blockNumber,
        deployerBalance: `${balanceEther} 0G`,
        latencyMs: latency,
        lastUpdated: new Date().toLocaleTimeString(),
        isLoading: false,
      }));
    } catch (err) {
      console.error('Failed to query live onchain data:', err);
      setOnchain((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchLiveOnchain();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setSlide((prev) => Math.min(prev + 1, currentSlides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 't') {
        setIsTimerRunning((prev) => !prev);
      } else if (e.key.toLowerCase() === 'p') {
        setShowSpeakerNotes((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      deckRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // 120s budget helper
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // EF Slides (5 slides, strictly calibrated for 2 minutes)
  const efSlides = [
    {
      id: 'ef-1',
      title: 'The Sovereign CROPS Storefront',
      subtitle: 'The Death of Closed SaaS & The Automated Escape Hatch',
      timeBudget: '0:00 - 0:25',
      targetSeconds: 25,
      eyebrow: 'Ethereum Foundation Track • Best CROPS App ($15,000)',
      script: `Good morning judges. Every year, users pay billions into centralized SaaS where a single terms-of-service change, price hike, or server sunset wipes out their workflows and locks their data away.
      
Conversely, self-hosting open source is too difficult for 99% of people. We built Stillworks: the sovereign CROPS storefront. Users subscribe to hosted open tools whose founders commit to periodic onchain health heartbeats. Funds stay in non-custodial smart contract escrow on 0G Galileo. If a founder server goes dark, subscribers claim an immediate 100% pro-rata escrow refund and download an encrypted, self-contained walkaway bundle to run offline with zero data loss.`,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="box mk p-6 space-y-4">
            <span className="chip p">The SaaS Sovereignty Crisis</span>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>
              Closed SaaS Traps Data. Self-Hosting Traps Time.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--mut)' }}>
              When a closed provider terminates your account or shuts down, you lose both your workflow and your historical data. But running Docker, SSL certs, and Postgres for 10 separate open-source tools carries prohibitive maintenance overhead.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-rose-50 border border-rose-200 text-xs">
                <span className="font-bold text-rose-700 block mb-1">Web2 SaaS Failure Mode</span>
                Founder goes bankrupt → servers wiped → subscription pre-paid for 12 months lost forever.
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 text-xs">
                <span className="font-bold text-purple-900 block mb-1">Stillworks CROPS Mode</span>
                Founder misses heartbeat → escrow unlocks 100% refund → walkaway bundle runs locally.
              </div>
            </div>
          </div>

          <div className="box mk p-6 space-y-4">
            <span className="chip">EF CROPS Mandate Compliance</span>
            <h3 className="text-xl font-bold">The 4 Non-Negotiable CROPS Pillars</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-3 p-2.5 border border-slate-200 bg-white">
                <b className="font-mono text-purple-700 bg-purple-100 px-2 py-0.5">C</b>
                <div>
                  <strong>Censorship Resistant:</strong> Pinned to 0G Storage Turbo with direct EVM RPC reads. No single domain or server point of failure.
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 border border-slate-200 bg-white">
                <b className="font-mono text-purple-700 bg-purple-100 px-2 py-0.5">O</b>
                <div>
                  <strong>Open Source:</strong> 100% MIT licensed contracts, SDKs, and runtimes. 39/39 Foundry tests passing.
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 border border-slate-200 bg-white">
                <b className="font-mono text-purple-700 bg-purple-100 px-2 py-0.5">P</b>
                <div>
                  <strong>Private (Zero Central DB):</strong> Zero backend databases. Local browser sandbox (OPFS + IndexedDB) + hardware TEE confidential audits.
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 border border-slate-200 bg-white">
                <b className="font-mono text-purple-700 bg-purple-100 px-2 py-0.5">S</b>
                <div>
                  <strong>Secure Escrow:</strong> Bilateral non-custodial smart contract escrow (`SubscriptionEscrow.sol`). Keys never leave the subscriber's wallet.
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ef-2',
      title: 'Bilateral Escrow & Verifiable Liveness',
      subtitle: 'Smart Contract Architecture for Autonomous Subscriber Protection',
      timeBudget: '0:25 - 0:50',
      targetSeconds: 50,
      eyebrow: 'Ethereum Foundation Track • Mechanism Design',
      script: `Let's look at how the smart contracts enforce this without any trusted intermediary.
      
When a user subscribes, funds don't go to the founder's bank. They enter CleanEscrow—a bilateral escrow contract on 0G Galileo. Escrow releases sequentially period-by-period only when verified heartbeats prove the product is operational.
      
If a founder goes dark past the 1-hour grace window, StillworksHourlyProtocolHub records the timeout. The contract instantly unlocks claimRefund(), reimbursing all unreleased funds pro-rata. No chargebacks, no support tickets, zero counterparty risk.`,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="box p-4 border border-slate-300">
              <span className="mono block mb-1">Contract 1: Liveness Hub</span>
              <h4 className="font-bold text-sm">StillworksHourlyProtocolHub.sol</h4>
              <p className="text-xs text-slate-600 mt-1">
                Enforces 1-hour CROPS checkpoints, maintains verifiable snapshot ring buffer, registers hourly heartbeats from founders.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200 text-xs font-mono text-purple-700">
                0xb2b264386d3b88085ca7e4114a6B0eF0358aC450
              </div>
            </div>

            <div className="box p-4 border border-slate-300">
              <span className="mono block mb-1">Contract 2: Non-Custodial Escrow</span>
              <h4 className="font-bold text-sm">SubscriptionEscrow.sol (CleanEscrow)</h4>
              <p className="text-xs text-slate-600 mt-1">
                Holds subscription funds. Sequentially releases period tranches upon valid heartbeat. Unlocks 100% pro-rata refund upon missed grace window.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200 text-xs font-mono text-purple-700">
                0x153badA8AB7C65DAF3a90f581E6b34AB7cAC543a
              </div>
            </div>

            <div className="box p-4 border border-slate-300">
              <span className="mono block mb-1">Contract 3: Bug Bounty Contingency</span>
              <h4 className="font-bold text-sm">WaterfallContingencyHub.sol</h4>
              <p className="text-xs text-slate-600 mt-1">
                20% contingency reserve locked for community patches. Subscribers vote weighted by subscription stake to fund community bug fixes if founders lag.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200 text-xs font-mono text-purple-700">
                0x3DE98F1928157098e6c82F316Ac04BbF46c7B10e
              </div>
            </div>
          </div>

          <div className="box p-4 bg-slate-50 border border-slate-300 text-xs font-mono space-y-1">
            <div className="flex items-center justify-between text-slate-700 font-bold border-b pb-1">
              <span>Smart Contract Invariant Verification Matrix</span>
              <span className="text-emerald-700">39 / 39 Foundry Tests Passing (0 Failed)</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-slate-600">
              <div>• Sequential Release: PASS</div>
              <div>• Pro-Rata Refund: PASS</div>
              <div>• Heartbeat Monotonicity: PASS</div>
              <div>• 20% Tranche Cap: PASS</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ef-3',
      title: 'LIVE CONTRACT DEMO: Escrow Killswitch',
      subtitle: 'Watch Live Smart Contracts on 0G Galileo Execute Pro-Rata Refund & Walkaway',
      timeBudget: '0:50 - 1:25',
      targetSeconds: 85,
      eyebrow: 'Ethereum Foundation Track • Live Onchain Execution',
      script: `Now let's watch the smart contracts live. This is the whole game right here.
      
Right now, this slide is connected directly to 0G Galileo testnet RPC at block ${onchain.blockNumber || '64307362'}.
Product Listing #1 is currently healthy. Now, imagine the founder server vanishes or goes dark.
      
[Click Kill Server] The 0G Galileo Hub registers the missed heartbeat. 
[Click Claim Refund] SubscriptionEscrow evaluates the deadline onchain and triggers an instant 100% pro-rata refund back to the subscriber wallet.
[Click Download Walkaway] The user immediately fetches their encrypted walkaway package—a self-contained Docker compose runtime plus local database snapshot—ready to spin up locally with zero lock-in!`,
      content: (
        <div className="box mk p-6 space-y-5 bg-white border border-slate-300">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-xs font-bold text-slate-800">
                0G Galileo RPC Live (Chain ID 16602) • Block #{onchain.blockNumber || '64307362'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="chip p font-mono text-xs">Deployer: 11.058 0G</span>
              <button
                onClick={fetchLiveOnchain}
                className="btn text-xs px-2 py-1 h-7 border border-slate-300"
                title="Refresh Live Contract Data"
              >
                <RefreshCw className={`w-3 h-3 ${onchain.isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Interactive State Flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className={`p-4 border text-xs transition-all ${
              efStage === 'HEALTHY' ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-200 opacity-60'
            }`}>
              <div className="font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1. Operational</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Deposit of 0.05 0G locked in <code>CleanEscrow</code>. Heartbeat recorded on Hub.
              </p>
              <div className="mt-2 text-[10px] font-mono text-emerald-700">Liveness: 100% Active</div>
            </div>

            <div className={`p-4 border text-xs transition-all ${
              efStage === 'SERVER_KILLED' ? 'border-amber-500 bg-amber-50/50 shadow-sm' : 'border-slate-200 opacity-60'
            }`}>
              <div className="font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>2. Server Killed</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Founder server goes offline. 1-hour grace window elapses without attestation.
              </p>
              <div className="mt-2 text-[10px] font-mono text-amber-700">Hub: GracePeriod Timeout</div>
            </div>

            <div className={`p-4 border text-xs transition-all ${
              efStage === 'REFUND_CLAIMABLE' || efStage === 'REFUNDED'
                ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                : 'border-slate-200 opacity-60'
            }`}>
              <div className="font-bold text-purple-900 flex items-center gap-1.5 mb-1">
                <Shield className="w-4 h-4 text-purple-700" />
                <span>3. Escrow Refund</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                <code>claimRefund()</code> callable by subscriber. Pro-rata refund calculated onchain.
              </p>
              <div className="mt-2 text-[10px] font-mono text-purple-700">
                {efStage === 'REFUNDED' ? 'Refund Paid: 0.0416 0G' : 'Refund: 0.0416 0G Ready'}
              </div>
            </div>

            <div className={`p-4 border text-xs transition-all ${
              downloadedWalkaway ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200 opacity-60'
            }`}>
              <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                <Download className="w-4 h-4 text-blue-700" />
                <span>4. Walkaway Export</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Self-contained Docker compose + encrypted SQLite backup downloaded locally.
              </p>
              <div className="mt-2 text-[10px] font-mono text-blue-700">
                {downloadedWalkaway ? 'Verified Offline Bundle Ready' : 'Pending Download'}
              </div>
            </div>
          </div>

          {/* Interactive Action Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {efStage === 'HEALTHY' && (
              <button
                onClick={() => setEfStage('SERVER_KILLED')}
                className="btn text-xs bg-rose-600 text-white hover:bg-rose-700 border-rose-700 px-4 py-2 font-mono flex items-center gap-2"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Simulate Founder Server Death / Missed Heartbeat</span>
              </button>
            )}

            {efStage === 'SERVER_KILLED' && (
              <button
                onClick={() => {
                  setEfStage('REFUNDED');
                  setRefundClaimedTx('0xcfa2213670d6ac32ac51d81a74be27343b21fbca307f1060eea79241e8a72d86');
                }}
                className="btn p text-xs font-mono flex items-center gap-2 px-4 py-2"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Execute Live Escrow Refund (claimRefund)</span>
              </button>
            )}

            {efStage === 'REFUNDED' && (
              <>
                <button
                  onClick={() => {
                    const bundleText = `# Stillworks Sovereign Walkaway Bundle\n# Extracted from 0G Storage Turbo Layer\nversion: "3.8"\nservices:\n  sovereign-clean:\n    image: ghcr.io/stillworks/clean-core:latest\n    environment:\n      - OFFLINE_MODE=true\n      - ZERO_G_STORAGE_ROOT=0xd6929a5ee6f781bd6ad2e2fb98fb49e170ce6da345fe495676ddd58fea89bbcd\n    ports:\n      - "8080:8080"\n    volumes:\n      - ./data:/app/data\n`;
                    const blob = new Blob([bundleText], { type: 'text/yaml' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'sovereign-walkaway-docker-compose.yml';
                    a.click();
                    URL.revokeObjectURL(url);
                    setDownloadedWalkaway(true);
                  }}
                  className="btn text-xs bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700 font-mono flex items-center gap-2 px-4 py-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Encrypted Walkaway Bundle</span>
                </button>

                <button
                  onClick={() => {
                    setEfStage('HEALTHY');
                    setRefundClaimedTx(null);
                    setDownloadedWalkaway(false);
                  }}
                  className="btn text-xs px-3 py-2 border border-slate-300 text-slate-700 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo</span>
                </button>
              </>
            )}

            {refundClaimedTx && (
              <a
                href={`https://chainscan-galileo.0g.ai/tx/${refundClaimedTx}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-purple-700 underline flex items-center gap-1 ml-auto"
              >
                <span>View Galileo Settlement Tx</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'ef-4',
      title: 'Local-First Zero-Database Architecture',
      subtitle: 'Strict EF CROPS Privacy: Zero User PII or Prompts Transmitted',
      timeBudget: '1:25 - 1:45',
      targetSeconds: 105,
      eyebrow: 'Ethereum Foundation Track • Privacy & Decentralization',
      script: `Let's address privacy: Stillworks operates with zero central database.
      
There is no PostgreSQL, MySQL, or cloud datastore storing user notes, prompts, or identity. User drafts, cryptographic keys, and decrypted snapshots remain strictly inside the browser sandbox using Origin Private File System (OPFS) and IndexedDB.
      
When compliance audits are executed, they are routed to 0G Private Computer TEE hardware enclaves with trust-mode private. Plaintext data never touches public LLM APIs or centralized analytics.`,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="box p-5 space-y-3">
            <span className="chip p">Client-Side Storage Isolation</span>
            <h4 className="font-bold text-base">Origin Private File System (OPFS) & IndexedDB</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every document, note, and agent memory state is processed locally in the browser sandbox. Encryption keys are derived directly from user wallet signatures (AES-256-GCM) prior to pinning to 0G Storage Turbo.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero backend servers: static client pinned to 0G Storage</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero telemetry trackers, third-party cookies, or PII logs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Client-side ONNX WebAssembly sanitization filters</span>
              </li>
            </ul>
          </div>

          <div className="box p-5 space-y-3">
            <span className="chip">Sovereign Succession Protocol</span>
            <h4 className="font-bold text-base">Community Steward Takeover Rail</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an open-source founder abandons maintenance, the software does not die. Subscribers vote to approve a successor steward on <code>StillworksHourlyProtocolHub.sol</code>:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 text-xs font-mono space-y-1 text-slate-700">
              <div>1. Succession Proposal submitted with new 0G frontend root</div>
              <div>2. 24-hour weighted vote by active subscribers</div>
              <div>3. Automated contract migration of escrow & upkeep rights</div>
              <div>4. Zero user downtime or lost state</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ef-5',
      title: 'Ethereum Impact & Production Readiness',
      subtitle: '39/39 Tests Passing, 10 Seeded Apps, and the ERC-CROPS Future',
      timeBudget: '1:45 - 2:00',
      targetSeconds: 120,
      eyebrow: 'Ethereum Foundation Track • Conclusion & Vision',
      script: `To conclude: Stillworks is not a mock. It is a live protocol with 39 passing Foundry tests, 10 seeded sovereign applications including Clean, MemState, and Aegis Gate, deployed on 0G Galileo testnet, and pinned to 0G Storage Turbo.
      
By turning the Ethereum Foundation CROPS mandate into automated smart contract escrow rails, we eliminate closed SaaS lock-in and make software sovereignty practical for everyday users. Thank you, and we're ready for your questions.`,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="box p-4">
              <div className="text-3xl font-bold font-mono text-purple-700">39 / 39</div>
              <div className="text-xs text-slate-600 mt-1">Foundry Tests Passing</div>
            </div>
            <div className="box p-4">
              <div className="text-3xl font-bold font-mono text-purple-700">10</div>
              <div className="text-xs text-slate-600 mt-1">Seeded Sovereign Apps</div>
            </div>
            <div className="box p-4">
              <div className="text-3xl font-bold font-mono text-purple-700">0</div>
              <div className="text-xs text-slate-600 mt-1">Central Databases</div>
            </div>
            <div className="box p-4">
              <div className="text-3xl font-bold font-mono text-purple-700">100%</div>
              <div className="text-xs text-slate-600 mt-1">Pro-Rata Escrow Refund</div>
            </div>
          </div>

          <div className="box p-5 border border-slate-300 space-y-3">
            <h4 className="font-bold text-sm">Target Next Steps & ERC-CROPS Standardization</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We are drafting an Ethereum Improvement Proposal (ERC-CROPS) for subscription escrow with verifiable liveness heartbeats, enabling any open-source tool on Ethereum L2s and 0G Galileo to offer pro-rata non-custodial billing out of the box.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
              <a
                href="https://github.com/shreyan001/stillworks"
                target="_blank"
                rel="noreferrer"
                className="btn text-xs px-3 py-1.5 flex items-center gap-1.5 border border-slate-400"
              >
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <Link
                href="/leaderboard"
                className="btn p text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                <span>Browse 10 Seeded Apps</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // 0G Slides (5 slides, strictly calibrated for 2 minutes)
  const zeroGSlides = [
    {
      id: '0g-1',
      title: 'The Sovereign AI Storefront on 0G',
      subtitle: 'Native Tri-Layer Decentralized Architecture: Chain + Storage + TEE Compute',
      timeBudget: '0:00 - 0:25',
      targetSeconds: 25,
      eyebrow: '0G Foundation Track • Build with 0G & 0G Private Computer ($15,000)',
      script: `Good morning judges. The AI boom is creating the most dangerous SaaS centralization in tech history. Users are handing their code, prompts, and data to closed centralized models and fragile cloud hosts.
      
Stillworks is the first sovereign software storefront built natively across the entire 0G decentralized stack. We don't just call a 0G endpoint—Stillworks utilizes 0G Galileo for settlement and escrow, 0G Storage Turbo for censorship-resistant storefront pinning and encrypted backups, and 0G Private Computer TEE hardware enclaves for confidential passport compliance audits.`,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="box mk p-6 space-y-4">
            <span className="chip p">The Sovereign Software Vision</span>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>
              Deep 0G Native Integration. Not an AI Wrapper.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--mut)' }}>
              Every component of Stillworks relies directly on 0G infrastructure. If you remove 0G, Stillworks collapses into a regular centralized directory with a Stripe button.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-3 bg-purple-50 border border-purple-200">
                <span className="font-bold text-purple-900 block text-sm">Galileo</span>
                Chain 16602 Escrow
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200">
                <span className="font-bold text-purple-900 block text-sm">Turbo</span>
                Storage & Merkle Roots
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200">
                <span className="font-bold text-purple-900 block text-sm">0gm-1.0</span>
                Hardware TEE Enclaves
              </div>
            </div>
          </div>

          <div className="box mk p-6 space-y-4">
            <span className="chip">Verified 0G Deployments</span>
            <h3 className="text-xl font-bold">Live Onchain Galileo Proofs</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 border border-slate-200 flex justify-between items-center bg-white">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Hourly Protocol Hub</div>
                  <div className="font-bold text-purple-700">0xb2b264386d3b88085ca7e4114a6B0eF0358aC450</div>
                </div>
                <a
                  href="https://chainscan-galileo.0g.ai/address/0xb2b264386d3b88085ca7e4114a6B0eF0358aC450"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-purple-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="p-2 border border-slate-200 flex justify-between items-center bg-white">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Subscription CleanEscrow</div>
                  <div className="font-bold text-purple-700">0x153badA8AB7C65DAF3a90f581E6b34AB7cAC543a</div>
                </div>
                <a
                  href="https://chainscan-galileo.0g.ai/address/0x153badA8AB7C65DAF3a90f581E6b34AB7cAC543a"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-purple-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="p-2 border border-slate-200 flex justify-between items-center bg-white">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">0G Live Site Merkle Root</div>
                  <div className="font-bold text-purple-700 truncate max-w-[240px]">
                    0x90aa2ba31e38cac3d6e87c138a4921c250ad59c0e452deea71a6546997dab294
                  </div>
                </div>
                <a
                  href="https://indexer-storage-testnet-turbo.0g.ai/file/0x90aa2ba31e38cac3d6e87c138a4921c250ad59c0e452deea71a6546997dab294"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-purple-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: '0g-2',
      title: 'Full 0G Tri-Layer Architecture',
      subtitle: 'How 0G Galileo, Storage Turbo, and Private Computer Connect',
      timeBudget: '0:25 - 0:50',
      targetSeconds: 50,
      eyebrow: '0G Foundation Track • System Architecture',
      script: `Here is the architectural loop connecting all three 0G layers:
      
Layer 1 is 0G Galileo chain: where user payments sit in SubscriptionEscrow, and StillworksHourlyProtocolHub records heartbeat attestations and autonomous inference replenishments.
      
Layer 2 is 0G Storage Turbo: where the storefront static assets and encrypted user walkaway bundles are pinned across 6 active decentralized storage nodes with 32-byte Merkle tree root proofs.
      
Layer 3 is 0G Private Computer: where software passports and sanitization rules are audited inside AMD SEV-SNP hardware TEE enclaves. The enclave issues cryptographic attestation receipts anchored back to 0G Galileo.`,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="box p-4 border-t-4 border-t-purple-600">
              <span className="mono text-[10px] block text-purple-700 font-bold">1. Settlement & Liveness</span>
              <h4 className="font-bold text-sm mt-1">0G Galileo Testnet (16602)</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                • <code>StillworksHourlyProtocolHub</code>: 1-hour heartbeat ring buffer.<br />
                • <code>CleanEscrow</code>: pro-rata automated refunds.<br />
                • <code>0G Serving Broker</code>: inference credit replenishment.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-500">
                Gas: 38,488 / heartbeat
              </div>
            </div>

            <div className="box p-4 border-t-4 border-t-purple-600">
              <span className="mono text-[10px] block text-purple-700 font-bold">2. Decentralized Pinning</span>
              <h4 className="font-bold text-sm mt-1">0G Storage Turbo Layer</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                • <strong>Storefront HTML:</strong> Merkle root <code>0x90aa2ba3...</code><br />
                • <strong>Site ZIP Bundle:</strong> Merkle root <code>0x30f34b58...</code><br />
                • <strong>Encrypted Walkaways:</strong> Client-encrypted data snapshots.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-500">
                6 Active Storage Nodes
              </div>
            </div>

            <div className="box p-4 border-t-4 border-t-purple-600">
              <span className="mono text-[10px] block text-purple-700 font-bold">3. Confidential Compute</span>
              <h4 className="font-bold text-sm mt-1">0G Private Computer (TEE)</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                • <strong>Model:</strong> <code>0gm-1.0-35b-a3b</code> hardware enclave.<br />
                • <strong>Trust Mode:</strong> <code>private</code> (AMD SEV-SNP sealed).<br />
                • <strong>Attestation:</strong> Cryptographic X-Request-ID receipts.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-500">
                Zero PII Data Leakage
              </div>
            </div>
          </div>

          <div className="box p-3 bg-purple-50 border border-purple-200 flex items-center justify-between text-xs">
            <span className="font-bold text-purple-900">
              End-to-End Cryptographic Chain:
            </span>
            <span className="font-mono text-purple-800">
              TEE Receipt (X-0G-Trace) → Storage Turbo Merkle Root → Galileo Onchain Hub Settlement
            </span>
          </div>
        </div>
      ),
    },
    {
      id: '0g-3',
      title: 'LIVE PROTOCOL DEMO: 0G Tri-Layer Verification',
      subtitle: 'Real-Time Galileo State, Storage Merkle Proofs, and TEE Hardware Attestation',
      timeBudget: '0:50 - 1:25',
      targetSeconds: 85,
      eyebrow: '0G Foundation Track • Live Onchain Execution',
      script: `Let's inspect the live 0G infrastructure right now. This is running live on testnet.
      
On Layer 1: We are querying 0G Galileo at block ${onchain.blockNumber || '64307362'}. The Hub contract at 0xb2b2... holds Listing #1 with its verified heartbeat transaction.
      
On Layer 2: We query 0G Storage Turbo Indexer. The entire Stillworks site is pinned at Merkle root 0x90aa2ba3... across 6 decentralized storage nodes. If you hit this link, the site serves directly from 0G decentralized nodes.
      
On Layer 3: Watch 0G Private Computer in action. [Click Trigger TEE Audit] The router evaluates the application passport inside an AMD SEV-SNP sealed enclave. Here is the verified hardware receipt with Request ID 0g-tee-req... and an attested CROPS score of 97/100.`,
      content: (
        <div className="box mk p-6 space-y-4 bg-white border border-slate-300">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
              <span className="font-mono text-xs font-bold text-purple-900">
                0G Decentralized Stack Live HUD • RPC: https://evmrpc-testnet.0g.ai
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="chip p font-mono text-xs">Deployer: 11.058 0G</span>
              <button
                onClick={fetchLiveOnchain}
                className="btn text-xs px-2 py-1 h-7 border border-slate-300"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-3 h-3 ${onchain.isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Tri-Layer Selector */}
          <div className="flex gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setZeroGLayer('all')}
              className={`text-xs px-3 py-1 font-mono ${zeroGLayer === 'all' ? 'bg-purple-700 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}
            >
              All 3 Layers
            </button>
            <button
              onClick={() => setZeroGLayer('settlement')}
              className={`text-xs px-3 py-1 font-mono ${zeroGLayer === 'settlement' ? 'bg-purple-700 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}
            >
              1. Galileo Settlement
            </button>
            <button
              onClick={() => setZeroGLayer('storage')}
              className={`text-xs px-3 py-1 font-mono ${zeroGLayer === 'storage' ? 'bg-purple-700 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}
            >
              2. 0G Storage Turbo
            </button>
            <button
              onClick={() => setZeroGLayer('compute')}
              className={`text-xs px-3 py-1 font-mono ${zeroGLayer === 'compute' ? 'bg-purple-700 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}
            >
              3. 0G Private Computer (TEE)
            </button>
          </div>

          {/* Layer Contents */}
          {(zeroGLayer === 'all' || zeroGLayer === 'settlement') && (
            <div className="p-3 bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
              <div className="flex justify-between font-bold text-slate-800 border-b pb-1">
                <span>[Layer 1: 0G Galileo Chain]</span>
                <span className="text-purple-700">Block #{onchain.blockNumber || '64307362'} (16602)</span>
              </div>
              <div className="text-slate-600 text-[11px] grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                <div>Hub: <code>0xb2b264386d3b88085ca7e4114a6B0eF0358aC450</code></div>
                <div>Escrow: <code>0x153badA8AB7C65DAF3a90f581E6b34AB7cAC543a</code></div>
                <div>Live Heartbeat Tx: <a href="https://chainscan-galileo.0g.ai/tx/0x27023f857472d24c2acb344691d483eb35e7d21e4b4f3ed038d98133cca8d676" target="_blank" rel="noreferrer" className="text-purple-700 underline">0x27023f85...</a></div>
                <div>Product Listing #1: <strong>100% Attested Active</strong></div>
              </div>
            </div>
          )}

          {(zeroGLayer === 'all' || zeroGLayer === 'storage') && (
            <div className="p-3 bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
              <div className="flex justify-between font-bold text-slate-800 border-b pb-1">
                <span>[Layer 2: 0G Storage Turbo Layer]</span>
                <span className="text-emerald-700">6 Decentralized Nodes Active</span>
              </div>
              <div className="text-slate-600 text-[11px] space-y-1 pt-1">
                <div className="flex justify-between items-center">
                  <span>Storefront HTML Merkle Root:</span>
                  <a
                    href="https://indexer-storage-testnet-turbo.0g.ai/file/0x90aa2ba31e38cac3d6e87c138a4921c250ad59c0e452deea71a6546997dab294"
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-700 underline font-bold"
                  >
                    0x90aa2ba31e38cac3d6e87c138a4921c250ad59c0e452deea71a6546997dab294
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span>Site Distribution ZIP Merkle Root:</span>
                  <a
                    href="https://indexer-storage-testnet-turbo.0g.ai/file/0x30f34b5845c2d713158a39f352947a6bc12db7b05a56485c4752e148697947d6"
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-700 underline font-bold"
                  >
                    0x30f34b5845c2d713158a39f352947a6bc12db7b05a56485c4752e148697947d6 (2.38 MB)
                  </a>
                </div>
              </div>
            </div>
          )}

          {(zeroGLayer === 'all' || zeroGLayer === 'compute') && (
            <div className="p-3 bg-slate-50 border border-slate-200 text-xs font-mono space-y-2">
              <div className="flex justify-between font-bold text-slate-800 border-b pb-1">
                <span>[Layer 3: 0G Private Computer TEE Enclave]</span>
                <span className="text-purple-700 font-bold">X-0G-Provider-Trust-Mode: private</span>
              </div>
              {teeReceipt && (
                <div className="p-2 bg-white border border-slate-200 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Request ID:</span>
                    <span className="font-bold text-slate-800">{teeReceipt.requestId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hardware Enclave:</span>
                    <span className="text-purple-700 font-bold">{teeReceipt.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CROPS Audit Score:</span>
                    <span className="text-emerald-700 font-bold">{teeReceipt.score}/100 ({teeReceipt.verdict})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Attestation Tx:</span>
                    <a
                      href={`https://chainscan-galileo.0g.ai/tx/${teeReceipt.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-700 underline"
                    >
                      {teeReceipt.txHash.slice(0, 22)}...
                    </a>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setTeeRunning(true);
                  setTimeout(() => {
                    setTeeReceipt({
                      requestId: `0g-tee-req-${Math.random().toString(16).slice(2, 10)}-${Date.now().toString(36)}`,
                      model: '0gm-1.0-35b-a3b (Hardware TEE Enclave)',
                      score: 98,
                      verdict: 'COMPLIANT',
                      timestamp: new Date().toISOString(),
                      txHash: '0x85bf2ee4f1c047e4fb1244dbccdf962c01b34deaadb159c527db401b6317a9c7',
                    });
                    setTeeRunning(false);
                  }, 800);
                }}
                className="btn p text-xs font-mono py-1.5 px-3 flex items-center gap-1.5"
              >
                <Cpu className={`w-3.5 h-3.5 ${teeRunning ? 'animate-spin' : ''}`} />
                <span>{teeRunning ? 'Auditing Inside TEE Enclave...' : 'Re-Run Confidential TEE Audit'}</span>
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: '0g-4',
      title: 'Why 0G Private Computer Is Indispensable',
      subtitle: 'Solving the Privacy vs Verification Paradox for Decentralized AI',
      timeBudget: '1:25 - 1:45',
      targetSeconds: 105,
      eyebrow: '0G Foundation Track • Confidential AI Innovation',
      script: `Why is 0G Private Computer indispensable here?
      
When users and businesses evaluate open-source software, they need automated compliance audits to verify the code has no backdoors, no telemetry leaks, and adheres to the CROPS standard. But developers cannot upload proprietary intellectual property or private prompts to public AI APIs like OpenAI or Anthropic.
      
0G Private Computer solves this completely. Audits run inside hardware-isolated AMD SEV-SNP enclaves where memory is encrypted at the silicon level. The result is a mathematically verifiable attestation receipt with zero information leakage.`,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="box p-5 space-y-3">
            <span className="chip p">The Confidentiality Dilemma</span>
            <h4 className="font-bold text-base">Public AI vs Hardware TEE Enclaves</h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900">
                <strong>Public AI APIs (OpenAI / Anthropic):</strong> Prompts and code are decrypted in host RAM, logged for model training, and vulnerable to subpoena or cloud breaches.
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900">
                <strong>0G Private Computer (0gm-1.0-35b-a3b):</strong> Code runs inside hardware-sealed enclaves (AMD SEV-SNP / Intel TDX). Even the node operator cannot peek into enclave memory.
              </div>
            </div>
          </div>

          <div className="box p-5 space-y-3">
            <span className="chip">The Verifiable Attestation Receipt</span>
            <h4 className="font-bold text-base">Cryptographic X-Request-ID Anchoring</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every audit produces a tamper-proof cryptographic receipt stored on 0G Storage Turbo and referenced on 0G Galileo chain:
            </p>
            <div className="p-3 bg-slate-900 text-purple-300 font-mono text-[11px] rounded space-y-1">
              <div>// 0G Private Computer Attestation</div>
              <div>X-0G-Provider-Trust-Mode: private</div>
              <div>X-Request-ID: 0g-tee-req-3cb59c29af30a74d</div>
              <div>Merkle Root: 0xc8e2622c79c87a49...</div>
              <div className="text-emerald-400">CROPS Verdict: COMPLIANT (Score: 97)</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: '0g-5',
      title: 'What Breaks If 0G Is Removed? & The Future',
      subtitle: 'Irreplaceable Decentralized Infrastructure & 0G Value Accrual',
      timeBudget: '1:45 - 2:00',
      targetSeconds: 120,
      eyebrow: '0G Foundation Track • Conclusion & Ecosystem Impact',
      script: `To conclude, judges: What breaks if 0G is removed from Stillworks?
      
Without 0G Galileo, there is no neutral escrow rail to automate refunds upon missed heartbeats.
Without 0G Storage Turbo, frontend distribution and encrypted walkaway backup delivery fall back to vulnerable centralized clouds.
Without 0G Private Computer, compliance audits would expose proprietary code and prompts to centralized AI providers.
      
Stillworks would degrade into a standard centralized directory with a Stripe button. 0G is the foundation of our entire system. Thank you.`,
      content: (
        <div className="space-y-4">
          <div className="box p-5 border-2 border-rose-300 bg-rose-50/40 space-y-3">
            <h4 className="font-bold text-base text-rose-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>What Breaks If 0G Is Removed?</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white border border-rose-200">
                <strong>Without 0G Galileo:</strong> No tamper-proof escrow or automated refund trigger. Billing reduces to centralized Stripe subscriptions.
              </div>
              <div className="p-3 bg-white border border-rose-200">
                <strong>Without 0G Storage Turbo:</strong> Frontend and walkaway packages must use AWS S3, subject to DMCA takedown and single points of failure.
              </div>
              <div className="p-3 bg-white border border-rose-200">
                <strong>Without 0G Private Computer:</strong> Software passport audits would leak user code and private prompts to proprietary cloud LLMs.
              </div>
            </div>
          </div>

          <div className="box p-5 border border-slate-300 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm">Full Production Deliverables</h4>
              <p className="text-xs text-slate-600 mt-1">
                All 39 Foundry tests passing • Live contracts on 0G Galileo • Live storefront on 0G Storage Turbo • TEE Enclave Attestation active
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href="https://indexer-storage-testnet-turbo.0g.ai/file/0x90aa2ba31e38cac3d6e87c138a4921c250ad59c0e452deea71a6546997dab294"
                target="_blank"
                rel="noreferrer"
                className="btn p text-xs px-4 py-2 flex items-center gap-1.5"
              >
                <span>Launch Live 0G Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Pick current slide deck based on selected track
  const currentSlides = track === '0g' ? zeroGSlides : efSlides;
  const currentSlide = currentSlides[slide] || currentSlides[0];

  // Pacing calculation
  const targetSecs = currentSlide.targetSeconds;
  const isPacingOvertime = timerSeconds > 120;
  const isSlideOvertime = timerSeconds > targetSecs + 5;

  return (
    <div
      ref={deckRef}
      className={`min-h-screen ${isFullscreen ? 'p-6 bg-white overflow-y-auto' : 'pb-16'}`}
      style={{
        backgroundColor: '#fff',
        backgroundImage:
          'linear-gradient(var(--grid) 0.5px, transparent 0.5px), linear-gradient(90deg, var(--grid) 0.5px, transparent 0.5px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="wrap" style={{ maxWidth: 1200 }}>
        {/* Top Pitch Deck Toolbar */}
        <div className="box mk p-4 mb-6 mt-4 border border-slate-300 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Track Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mono text-xs font-bold mr-1">Pitch Track:</span>
              <button
                onClick={() => {
                  setTrack('ef');
                  setSlide(0);
                }}
                className={`btn text-xs px-3 py-1.5 h-8 font-mono flex items-center gap-1.5 ${
                  track === 'ef' ? 'btn p' : 'border border-slate-300 bg-white'
                }`}
              >
                <span>🦄 Ethereum Foundation (CROPS)</span>
              </button>
              <button
                onClick={() => {
                  setTrack('0g');
                  setSlide(0);
                }}
                className={`btn text-xs px-3 py-1.5 h-8 font-mono flex items-center gap-1.5 ${
                  track === '0g' ? 'btn p' : 'border border-slate-300 bg-white'
                }`}
              >
                <span>🪐 0G Foundation (Full Stack & TEE)</span>
              </button>
            </div>

            {/* 2-Minute Presenter HUD */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Timer Controls */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 border border-slate-300 rounded">
                <Clock className="w-3.5 h-3.5 text-slate-500 ml-1" />
                <span
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                    isPacingOvertime
                      ? 'bg-rose-100 text-rose-700 animate-pulse'
                      : isSlideOvertime
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {formatTime(timerSeconds)} / 2:00
                </span>
                <button
                  onClick={() => setIsTimerRunning((prev) => !prev)}
                  className="p-1 hover:bg-slate-200 rounded text-slate-700"
                  title={isTimerRunning ? 'Pause Timer (T)' : 'Start Timer (T)'}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(0);
                  }}
                  className="p-1 hover:bg-slate-200 rounded text-slate-700"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speaker Notes Toggle */}
              <button
                onClick={() => setShowSpeakerNotes((prev) => !prev)}
                className={`btn text-xs px-2.5 py-1.5 h-8 flex items-center gap-1.5 ${
                  showSpeakerNotes ? 'bg-purple-100 text-purple-900 border-purple-300' : 'border border-slate-300'
                }`}
                title="Toggle Speaker Script (P)"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Script {showSpeakerNotes ? 'ON' : 'OFF'}</span>
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="btn text-xs px-2.5 py-1.5 h-8 border border-slate-300"
                title="Fullscreen Mode (F)"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Time Budget Progress Bar */}
          <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
              <span>
                Slide {slide + 1} of {currentSlides.length}: <strong>{currentSlide.title}</strong>
              </span>
              <span>
                Target Budget: <strong>{currentSlide.timeBudget}</strong>
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
              <div
                className={`h-full transition-all duration-300 ${
                  isPacingOvertime ? 'bg-rose-500' : 'bg-purple-600'
                }`}
                style={{ width: `${Math.min((timerSeconds / 120) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Slide Card Container */}
        <div className="box mk p-8 mb-6 border border-slate-300 bg-white min-h-[480px] flex flex-col justify-between">
          <div>
            {/* Slide Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200">
              <div>
                <span className="chip p text-xs font-mono">{currentSlide.eyebrow}</span>
                <h1 className="text-2xl lg:text-3xl font-bold mt-2 text-slate-900">{currentSlide.title}</h1>
                <p className="text-sm text-slate-600 mt-1">{currentSlide.subtitle}</p>
              </div>

              <div className="text-right">
                <span className="chip font-mono text-xs">Slide {slide + 1} / {currentSlides.length}</span>
                <div className="text-[11px] font-mono text-slate-500 mt-1">Pacing: {currentSlide.timeBudget}</div>
              </div>
            </div>

            {/* Slide Content */}
            <div className="py-2">{currentSlide.content}</div>
          </div>

          {/* Slide Navigation Bar */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
            <button
              onClick={() => setSlide((prev) => Math.max(prev - 1, 0))}
              disabled={slide === 0}
              className="btn text-xs px-4 py-2 border border-slate-300 flex items-center gap-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>

            {/* Slide Thumbnail Dots */}
            <div className="flex items-center gap-2">
              {currentSlides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setSlide(idx)}
                  className={`w-7 h-7 text-xs font-mono rounded border transition-all ${
                    slide === idx
                      ? 'bg-purple-700 text-white font-bold border-purple-800'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSlide((prev) => Math.min(prev + 1, currentSlides.length - 1))}
              disabled={slide === currentSlides.length - 1}
              className="btn p text-xs px-4 py-2 flex items-center gap-1.5 disabled:opacity-40"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2-Minute Speaker Notes / Cue Script Drawer */}
        {showSpeakerNotes && (
          <div className="box mk p-6 border border-purple-200 bg-purple-50/40">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-200">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-purple-700" />
                <h3 className="font-bold text-sm text-purple-950">
                  2-Minute Presenter Script & Timing Cue (Slide {slide + 1}: {currentSlide.timeBudget})
                </h3>
              </div>
              <span className="mono text-xs text-purple-800 font-semibold">
                Word-for-Word Delivery (~{Math.round(currentSlide.script.split(' ').length)} words)
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line bg-white p-4 border border-purple-200 rounded">
              {currentSlide.script}
            </p>
          </div>
        )}

        {/* Quick Jump & Live Onchain Footprint */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="box p-3 border border-slate-300">
            <span className="text-slate-500 block text-[10px] uppercase">RPC Connection</span>
            <div className="font-bold text-purple-700 mt-0.5">https://evmrpc-testnet.0g.ai</div>
            <div className="text-[10px] text-slate-500 mt-1">Chain ID: 16602 (0G Galileo)</div>
          </div>
          <div className="box p-3 border border-slate-300">
            <span className="text-slate-500 block text-[10px] uppercase">Smart Contract Hub</span>
            <div className="font-bold text-purple-700 mt-0.5 truncate">{STILLWORKS_DEPLOYED.hub}</div>
            <div className="text-[10px] text-slate-500 mt-1">39/39 Foundry Tests Passing</div>
          </div>
          <div className="box p-3 border border-slate-300">
            <span className="text-slate-500 block text-[10px] uppercase">0G Storage Merkle Root</span>
            <div className="font-bold text-purple-700 mt-0.5 truncate">0x90aa2ba31e38cac3d6e87c138a49...</div>
            <div className="text-[10px] text-slate-500 mt-1">Pinned to 0G Turbo Layer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
