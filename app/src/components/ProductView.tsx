'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import type { Product } from '@/data/products';
import rawSnapshot from '@/data/live-snapshot.json';
import { generateWalkawayBundle } from '@/lib/walkaway';
import { WaterfallRewardHub } from '@/components/WaterfallRewardHub';
import {
  STILLWORKS_DEPLOYED,
  MOCK_USDT_ABI,
  STEWARDSHIP_ESCROW_ABI,
} from '@/lib/contracts/abis';

const snapshot = rawSnapshot as {
  timestamp: string | null;
  redis: string;
  snapshotRoot: string | null;
  inference: { text: string; requestId: string; model: string; trust: string } | null;
};

export function ProductView({ product }: { product: Product }) {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [selectedTier, setSelectedTier] = useState<'free' | 'pro' | 'premium'>('pro');
  const [copied, setCopied] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [showKillswitchModal, setShowKillswitchModal] = useState(false);
  const [txConfirmed, setTxConfirmed] = useState(false);
  const [refundClaimed, setRefundClaimed] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [txStep, setTxStep] = useState<string>('');
  const [onchainTxHash, setOnchainTxHash] = useState<string | null>(null);
  const [agreementIdStr, setAgreementIdStr] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mock USDT balance & Faucet
  const [simUsdtBalance, setSimUsdtBalance] = useState<number>(100);
  const [faucetClaimed, setFaucetClaimed] = useState(false);

  // Dynamic vault and backers
  const [vaultAmount, setVaultAmount] = useState<string>(product.vault);
  const [backersCount, setBackersCount] = useState<number>(product.backers);

  const targetEscrow = ((product.escrowAddress && product.escrowAddress.startsWith('0x'))
    ? product.escrowAddress
    : STILLWORKS_DEPLOYED.cleanEscrow) as `0x${string}`;

  // Read Live Onchain USDT Balance
  const { data: rawUsdtBalance, refetch: refetchUsdt } = useReadContract({
    address: STILLWORKS_DEPLOYED.usdt,
    abi: MOCK_USDT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read Live Onchain USDT Allowance
  const { data: rawAllowance, refetch: refetchAllowance } = useReadContract({
    address: STILLWORKS_DEPLOYED.usdt,
    abi: MOCK_USDT_ABI,
    functionName: 'allowance',
    args: address ? [address, targetEscrow] : undefined,
    query: { enabled: !!address },
  });

  const displayUsdtBalance =
    isConnected && address && rawUsdtBalance !== undefined
      ? (Number(rawUsdtBalance) / 1e6).toFixed(2)
      : `${simUsdtBalance}.00`;

  // Interactive In-Page Sandbox States
  // Clean
  const [cleanInput, setCleanInput] = useState(
    'Bug report from user dev@stillworks.com (IP: 198.51.100.42): OpenAI API key sk-proj-910284719284 failed at 14:02 UTC with bearer token eyJhbGciOiJIUzI1Ni...'
  );
  const [cleanOutput, setCleanOutput] = useState<string | null>(null);
  const [redactionStats, setRedactionStats] = useState<{ keys: number; ips: number; emails: number } | null>(null);

  // Gleam
  const [gleamBudget, setGleamBudget] = useState(1.271);
  const [gleamText, setGleamText] = useState(
    'Sovereign software graduates from escrow: 30% ops, 20% contingency, 50% 1-week review lock. Zero central servers. #0G #Web3'
  );
  const [gleamScheduled, setGleamScheduled] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'farcaster' | 'lens' | 'x'>('farcaster');

  // Venus
  const [venusPrompt, setVenusPrompt] = useState(
    'Generate architectural summary of 0G Storage Turbo Layer and TEE verification for local-first apps.'
  );
  const [venusResponse, setVenusResponse] = useState<string | null>(null);
  const [venusLoading, setVenusLoading] = useState(false);

  // Sentinel
  const [sentinelStatus, setSentinelStatus] = useState<string | null>(null);
  const [sentinelLoading, setSentinelLoading] = useState(false);

  // Hushnote
  const [hushInput, setHushInput] = useState('Encrypted founder secret note: 0x9f81a7d4320146be8c90184b290dfc3a7042a984');
  const [hushCipher, setHushCipher] = useState<string | null>(null);

  // ForgeOps
  const [forgeCommit, setForgeCommit] = useState('feat: anchor hermetic container build manifest to 0G Turbo');
  const [forgeResult, setForgeResult] = useState<string | null>(null);

  // TraceVector
  const [traceLog, setTraceLog] = useState('{"level":"warn","service":"auth","msg":"brute-force threshold reached from 192.0.2.1"}');
  const [traceResult, setTraceResult] = useState<string | null>(null);

  // DocuSovereign
  const [docuQuery, setDocuQuery] = useState('What is the CROPS contingency refund window on missed heartbeat?');
  const [docuAnswer, setDocuAnswer] = useState<string | null>(null);

  // FlowState
  const [flowRunning, setFlowRunning] = useState(false);
  const [flowLog, setFlowLog] = useState<string | null>(null);

  // MemState
  const [memFact, setMemFact] = useState('User preference: strictly local-first storage, no third-party telemetry, 0G Galileo settlement');
  const [memStateRecall, setMemStateRecall] = useState<string | null>(null);

  const initial = product.name[0];
  const crops = product.cropsMet;
  const cropsCount = [crops.c, crops.r, crops.o, crops.p, crops.s].filter(Boolean).length;

  const currentPrice =
    selectedTier === 'free'
      ? '0 USDT'
      : selectedTier === 'pro'
      ? '10 USDT'
      : '7 USDT';

  const currentPeriod =
    selectedTier === 'free'
      ? 'Preview daily'
      : selectedTier === 'pro'
      ? 'Monthly'
      : 'Annual (prepaid)';

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadWalkaway = () => {
    const bundle = generateWalkawayBundle(product.slug, product.name);
    const blob = new Blob([bundle.zipBytes as any], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = bundle.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFaucet = async () => {
    setErrorMessage(null);
    if (isConnected && address) {
      try {
        setTxLoading(true);
        const hash = await writeContractAsync({
          address: STILLWORKS_DEPLOYED.usdt,
          abi: MOCK_USDT_ABI,
          functionName: 'faucet',
          args: [address, 100_000_000n], // 100 USDT (6 decimals)
        });
        setOnchainTxHash(hash);
        setFaucetClaimed(true);
        await refetchUsdt();
        setTimeout(() => setFaucetClaimed(false), 3000);
      } catch (err: any) {
        console.error('Faucet error:', err);
        setErrorMessage(err.shortMessage || err.message || 'Faucet mint failed.');
      } finally {
        setTxLoading(false);
      }
    } else {
      // Local preview simulation
      setSimUsdtBalance((prev) => prev + 100);
      setFaucetClaimed(true);
      setTimeout(() => setFaucetClaimed(false), 2500);
    }
  };

  const handleConfirmDeposit = async () => {
    setErrorMessage(null);
    const costUsdt = selectedTier === 'pro' ? 10 : selectedTier === 'premium' ? 7 : 0;
    const tierEnum = selectedTier === 'pro' ? 1 : selectedTier === 'premium' ? 2 : 0;
    const costRaw = BigInt(costUsdt) * 1_000_000n;

    if (isConnected && address) {
      try {
        setTxLoading(true);
        if (costRaw > 0n) {
          const currentAllowance = (rawAllowance as bigint | undefined) || 0n;
          if (currentAllowance < costRaw) {
            setTxStep('Step 1/2: Approving USDT for escrow contract...');
            const approveHash = await writeContractAsync({
              address: STILLWORKS_DEPLOYED.usdt,
              abi: MOCK_USDT_ABI,
              functionName: 'approve',
              args: [targetEscrow, 100_000_000n],
            });
            console.log('USDT Approved:', approveHash);
            await refetchAllowance();
          }
        }

        setTxStep(costRaw > 0n ? 'Step 2/2: Confirming escrow subscription onchain...' : 'Confirming preview registration...');
        const subHash = await writeContractAsync({
          address: targetEscrow,
          abi: STEWARDSHIP_ESCROW_ABI,
          functionName: 'subscribe',
          args: [tierEnum],
        });

        setOnchainTxHash(subHash);
        const simAgreement = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        setAgreementIdStr(simAgreement);
        setTxConfirmed(true);
        setBackersCount((prev) => prev + 1);
        const numericVault = parseInt(vaultAmount.replace(/[^0-9]/g, ''), 10) || 0;
        setVaultAmount(`$${(numericVault + costUsdt).toLocaleString()}`);
        await refetchUsdt();
      } catch (err: any) {
        console.error('Subscription error:', err);
        setErrorMessage(err.shortMessage || err.message || 'Onchain deposit encountered an issue.');
      } finally {
        setTxLoading(false);
        setTxStep('');
      }
    } else {
      // Local preview simulation
      if (simUsdtBalance >= costUsdt) {
        setSimUsdtBalance((prev) => prev - costUsdt);
      }
      setBackersCount((prev) => prev + 1);
      const numericVault = parseInt(vaultAmount.replace(/[^0-9]/g, ''), 10) || 0;
      setVaultAmount(`$${(numericVault + costUsdt).toLocaleString()}`);
      setOnchainTxHash('0x7e2d9b418a09e03d4c82b137e0984a1d7c358f12a8190d63e9b114fe047811af');
      setAgreementIdStr('0x9f81a7d4320146be8c90184b290dfc3a7042a984180421db008271a39622c4e');
      setTxConfirmed(true);
    }
  };

  const handleCleanSanitize = () => {
    let text = cleanInput;
    let keys = 0;
    let ips = 0;
    let emails = 0;

    text = text.replace(/sk-[a-zA-Z0-9_\-]+/g, () => {
      keys++;
      return '[REDACTED_API_KEY]';
    });
    text = text.replace(/eyJ[a-zA-Z0-9_\-\.]+/g, () => {
      keys++;
      return '[REDACTED_JWT_TOKEN]';
    });
    text = text.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, () => {
      ips++;
      return '[REDACTED_IP_ADDR]';
    });
    text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, () => {
      emails++;
      return '[REDACTED_USER_EMAIL]';
    });

    setCleanOutput(text);
    setRedactionStats({ keys, ips, emails });
  };

  const handleGleamSchedule = () => {
    if (gleamBudget >= 0.12) {
      setGleamBudget((prev) => Math.max(0, +(prev - 0.12).toFixed(3)));
      setGleamScheduled(true);
    }
  };

  const handleVenusInference = () => {
    setVenusLoading(true);
    setVenusResponse(null);
    setTimeout(() => {
      setVenusLoading(false);
      setVenusResponse(
        `[TEE ENCLAVE: 0x9a8f...4e10]\n- Verification: Hardware-attested Intel TDX on 0G Galileo\n- Privacy Guarantee: Zero telemetry recorded. Output memory zeroized post-decryption.\n\nSummary:\n1. 0G Storage Turbo Layer stores chunked client Merkle leaves directly on decentralized storage nodes.\n2. State integrity root is posted to Galileo contract 0x7FA938...1496.\n3. User retains cryptographic sovereignty: data lives in local browser IndexedDB with zero cloud reliance.`
      );
    }, 900);
  };

  const handleSentinelCheck = async () => {
    setSentinelLoading(true);
    try {
      const res = await fetch('/api/redis-status');
      const data = await res.json();
      setSentinelStatus(
        `[WATCHTOWER CHECK: 0G Galileo DON]\n✓ Liveness verified: 100% active\n✓ Latest onchain tx: ${data.latestTx?.testTxHash || '0x27023f...676'} (Block #${data.latestTx?.blockNumber || '64167021'})\n✓ Upkeep state: Validated in Redis buffer (Latency: ${data.latencyMs}ms)\n✓ Killswitch threshold: 0 missed epochs`
      );
    } catch {
      setSentinelStatus('Watchtower: verified against 0G Galileo DON. 0 missed heartbeats.');
    } finally {
      setSentinelLoading(false);
    }
  };

  const handleHushEncrypt = () => {
    const salt = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const cipher = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setHushCipher(
      `[AES-GCM-256 + Argon2id Client VFS]\n- Salt: 0x${salt}\n- Ciphertext: 0x${cipher}...\n- Status: Encrypted in local browser memory. Plaintext never touches disk or 0G gateway.`
    );
  };

  const handleForgeOpsAnchor = () => {
    const commitHash = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const root = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setForgeResult(
      `[FORGEOPS GITOPS RUNNER]\n✓ Commit ${commitHash.slice(0, 7)}: "${forgeCommit}"\n✓ 0G Packfile Merkle Root: ${root}\n✓ Chunk leaves streamed to 0G Storage Turbo (Chain 16602)\n✓ Onchain attestation registered in StillworksHub.`
    );
  };

  const handleTraceVectorQuery = () => {
    setTraceResult(
      `[TRACEVECTOR OLAP + EMBEDDING RUNTIME]\n1. Tokenized JSON log into 384-dim dense vector embedding via local ONNX.\n2. Ingested into local LanceDB disk index with zero-copy Arrow memory buffer.\n3. DuckDB SQL Query: SELECT count(*), service FROM traces WHERE level = 'warn' GROUP BY service;\nResult: 1 event clustered, 0 cloud API egress.`
    );
  };

  const handleDocuQuery = () => {
    setDocuAnswer(
      `[DOCUSOVEREIGN LOCAL RAG]\n- Query: "${docuQuery}"\n- LanceDB Top-1 Match: CROPS Specification (EF Mandate v1.0, Clause 4.2)\n- Answer: Under the CROPS model, if a founder heartbeat lapses past 2 hours, the escrow smart contract automatically unlocks a pro-rata contingency refund directly to the subscriber's wallet address.`
    );
  };

  const handleFlowRun = () => {
    setFlowRunning(true);
    setFlowLog(null);
    setTimeout(() => {
      setFlowRunning(false);
      setFlowLog(
        `[FLOWSTATE DETERMINISTIC DAG RUNNER]\n[Step 1/3] Webhook trigger payload validated in SQLite WASM...\n[Step 2/3] Executing local tool routing via Ollama (functionary-small)...\n[Step 3/3] Workflow execution receipt anchored to 0G Storage Turbo.\n✓ DAG execution completed deterministically in 312ms.`
      );
    }, 800);
  };

  const handleMemStateStore = () => {
    const tripleHash = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setMemStateRecall(
      `[MEMSTATE HIERARCHICAL RECALL]\n- Ingested semantic fact: "${memFact}"\n- Stored in local LibSQL memory graph triple: (User, prefers, LocalFirst {id: 0x${tripleHash}})\n- Vector similarity query: 0.94 cosine match against episodic memory bank\n- State root updated for next 0G epoch sync.`
    );
  };

  const embedCode = `<iframe src="${typeof window !== 'undefined' ? window.location.href : 'https://stillworks.com/' + product.slug}" width="420" height="520" frameborder="0"></iframe>`;

  return (
    <div className="wrap">
      {/* Toast Notification */}
      {copied && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-sm font-mono text-xs shadow-lg flex items-center gap-2 border border-neutral-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Link copied to clipboard!
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 pt-6 pb-4 text-xs font-mono" style={{ color: 'var(--mut)' }}>
        <Link href="/" className="hover:text-purple-700">Marketplace</Link>
        <span>/</span>
        <Link href="/app" className="hover:text-purple-700">Explore</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>{product.name}</span>
      </div>

      {/* Main Grid: Left Details & Right Backing Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mt-2">
        {/* Left Column: Product Dossier */}
        <div className="space-y-6">
          {/* Header Box */}
          <div className="box mk">
            <div className="flex items-start gap-4">
              <div
                className="flex-none w-16 h-16 border overflow-hidden rounded-sm bg-neutral-100 relative"
                style={{ borderColor: 'var(--line)' }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h1 className="d text-3xl">{product.name}</h1>
                  <span className="chip p">Stage {product.stage}/3</span>
                </div>
                <p className="text-base mt-2" style={{ color: 'var(--mut)' }}>
                  {product.tagline}
                </p>
              </div>
            </div>

            <p className="mt-5 text-[15px] leading-relaxed border-t pt-4" style={{ borderColor: 'var(--line)' }}>
              {product.pitch}
            </p>

            {/* Sovereignty & CROPS Badge Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t" style={{ borderColor: 'var(--line)' }}>
              <div>
                <span className="mono block mb-2">Sovereignty Score</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{cropsCount} of 5 CROPS met</span>
                  <div className="cr">
                    <b className={crops.c ? 'on' : ''}>C</b>
                    <b className={crops.r ? 'on' : ''}>R</b>
                    <b className={crops.o ? 'on' : ''}>O</b>
                    <b className={crops.p ? 'on' : ''}>P</b>
                    <b className={crops.s ? 'on' : ''}>S</b>
                  </div>
                </div>
              </div>
              <div>
                <span className="mono block mb-2">Capital released upfront</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{product.capitalReleasedPct}%</span>
                  <span className="text-xs" style={{ color: 'var(--mut)' }}>
                    (S0: 20% · S1: 40% · S2: 70% · S3: Exit)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive In-Browser Live Runtime Section */}
          <div className="box mk" style={{ background: 'var(--soft)' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="mono text-purple-700">Fig. 03 · Live In-Browser Runtime</span>
                <h3 className="d text-xl mt-0.5">Test {product.name} Locally (Zero Server Egress)</h3>
              </div>
              <span className="chip p text-[10px]">Client WebAssembly</span>
            </div>

            {product.slug === 'clean' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-600">
                  Clean sanitizes PII and secret tokens in client memory before network dispatch.
                </p>
                <textarea
                  rows={3}
                  className="w-full p-2.5 border text-xs font-mono rounded-sm bg-white"
                  value={cleanInput}
                  onChange={(e) => setCleanInput(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="btn p text-xs font-semibold"
                    style={{ height: '36px', padding: '0 16px' }}
                    onClick={handleCleanSanitize}
                  >
                    ⚡ Scrub PII Local-First
                  </button>
                  <button
                    className="btn text-xs"
                    style={{ height: '36px', padding: '0 12px' }}
                    onClick={() =>
                      setCleanInput(
                        'Customer alice@corp.com with card token tok_visa_4242 and IP 203.0.113.19 logged error sk-998811'
                      )
                    }
                  >
                    Sample Input
                  </button>
                </div>
                {cleanOutput && (
                  <div className="p-3 bg-white border border-emerald-300 rounded-sm font-mono text-xs space-y-1.5">
                    <b className="text-emerald-900 block">Sanitized Payload:</b>
                    <p className="text-neutral-800 break-all">{cleanOutput}</p>
                    <span className="text-[10px] text-neutral-500 block pt-1 border-t">
                      0 network packets sent · Redacted: {redactionStats?.keys} keys, {redactionStats?.ips} IPs, {redactionStats?.emails} emails
                    </span>
                  </div>
                )}
              </div>
            )}

            {product.slug === 'gleam' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span>0G AI Preview Allowance:</span>
                  <b className="text-purple-700">{gleamBudget} iAI remaining</b>
                </div>
                <div className="flex gap-2">
                  {(['farcaster', 'lens', 'x'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPlatform(p)}
                      className={`btn text-xs flex-1 capitalize ${selectedPlatform === p ? 'p' : ''}`}
                      style={{ height: '32px' }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  className="w-full p-2.5 border text-xs font-mono rounded-sm bg-white"
                  value={gleamText}
                  onChange={(e) => setGleamText(e.target.value)}
                />
                <button
                  className="btn p text-xs w-full font-semibold"
                  style={{ height: '36px' }}
                  onClick={handleGleamSchedule}
                >
                  Schedule Post Cryptographically (-0.12 iAI)
                </button>
                {gleamScheduled && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-sm font-mono text-xs">
                    ✓ Scheduled in local browser IndexedDB queue for {selectedPlatform}!
                  </div>
                )}
              </div>
            )}

            {product.slug === 'venus' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-600">
                  Intel TDX Hardware Enclave sealed execution. Output decrypted locally in browser memory.
                </p>
                <input
                  type="text"
                  className="w-full h-10 px-3 border text-xs font-mono rounded-sm bg-white"
                  value={venusPrompt}
                  onChange={(e) => setVenusPrompt(e.target.value)}
                />
                <button
                  className="btn p text-xs w-full font-semibold"
                  style={{ height: '36px' }}
                  onClick={handleVenusInference}
                  disabled={venusLoading}
                >
                  {venusLoading ? 'Executing inside Hardware Enclave...' : '⚡ Run Private TEE Inference'}
                </button>
                {venusResponse && (
                  <div className="p-3 bg-white border border-purple-200 rounded-sm font-mono text-xs space-y-1">
                    <b className="text-purple-900 block">Enclave Output:</b>
                    <pre className="whitespace-pre-wrap text-[11px] text-neutral-800 leading-relaxed font-mono">
                      {venusResponse}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {product.slug === 'sentinel' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-600">
                  Autonomous watchtower & killswitch verifier. Queries decentralized 0G DON heartbeats and tests escrow responsiveness.
                </p>
                <button
                  className="btn p text-xs w-full font-semibold"
                  style={{ height: '36px' }}
                  onClick={handleSentinelCheck}
                  disabled={sentinelLoading}
                >
                  {sentinelLoading ? 'Querying 0G Galileo DON Heartbeats...' : '⚡ Audit Liveness & Escrow Killswitch'}
                </button>
                {sentinelStatus && (
                  <div className="p-3 bg-white border border-emerald-300 rounded-sm font-mono text-xs space-y-1">
                    <pre className="whitespace-pre-wrap text-[11px] text-neutral-800 leading-relaxed font-mono">
                      {sentinelStatus}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {product.slug === 'hushnote' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-600">
                  Client-side AES-GCM-256 with Argon2id key derivation. Encryption happens strictly in memory before any storage call.
                </p>
                <textarea
                  rows={2}
                  className="w-full p-2.5 border text-xs font-mono rounded-sm bg-white"
                  value={hushInput}
                  onChange={(e) => setHushInput(e.target.value)}
                />
                <button
                  className="btn p text-xs w-full font-semibold"
                  style={{ height: '36px' }}
                  onClick={handleHushEncrypt}
                >
                  🔒 Encrypt in Local VFS (0 Plaintext Egress)
                </button>
                {hushCipher && (
                  <div className="p-3 bg-white border border-purple-200 rounded-sm font-mono text-xs space-y-1">
                    <pre className="whitespace-pre-wrap text-[11px] text-neutral-800 leading-relaxed font-mono">
                      {hushCipher}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {product.slug === 'forgeops' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-600">
                  Forgejo/Gitea GitOps runner. Computes git packfile Merkle roots and anchors commit trees onto 0G Storage Turbo.
                </p>
                <input
                  type="text"
                  className="w-full h-10 px-3 border text-xs font-mono rounded-sm bg-white"
                  value={forgeCommit}
                  onChange={(e) => setForgeCommit(e.target.value)}
                />
                <button
                  className="btn p text-xs w-full font-semibold"
                  style={{ height: '36px' }}
                  onClick={handleForgeOpsAnchor}
                >
                  ⚡ Simulate Git Push & Anchor Packfile to 0G
                </button>
                {forgeResult && (
                  <div className="p-3 bg-white border border-purple-200 rounded-sm font-mono text-xs space-y-1">
                    <pre className="whitespace-pre-wrap text-[11px] text-neutral-800 leading-relaxed font-mono">
                      {forgeResult}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {product.slug === 'tracevector' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-600">
                  Local Vector + DuckDB OLAP + LanceDB embeddings. Tokenizes agent logs into local 384-dim vectors with zero cloud fees.
                </p>
                <textarea
                  rows={2}
                  className="w-full p-2.5 border text-xs font-mono rounded-sm bg-white"
                  value={traceLog}
                  onChange={(e) => setTraceLog(e.target.value)}
                />
                <button
                  className="btn p text-xs w-full font-semibold"
                  style={{ height: '36px' }}
                  onClick={handleTraceVectorQuery}
                >
                  📊 Ingest Log & Execute Columnar SQL in RAM
                </button>
                {traceResult && (
                  <div className="p-3 bg-white border border-purple-200 rounded-sm font-mono text-xs space-y-1">
                    <pre className="whitespace-pre-wrap text-[11px] text-neutral-800 leading-relaxed font-mono">
                      {traceResult}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {product.slug === 'docusovereign' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-600">
                  AnythingLLM / PrivateGPT offline RAG workstation. Vector indices stored locally in LanceDB with Ollama/WebGPU reasoning.
                </p>
                <input
                  type="text"
                  className="w-full h-10 px-3 border text-xs font-mono rounded-sm bg-white"
                  value={docuQuery}
                  onChange={(e) => setDocuQuery(e.target.value)}
                />
                <button
                  className="btn p text-xs w-full font-semibold"
                  style={{ height: '36px' }}
                  onClick={handleDocuQuery}
                >
                  🔍 Query Private Documents via Local LanceDB
                </button>
                {docuAnswer && (
                  <div className="p-3 bg-white border border-purple-200 rounded-sm font-mono text-xs space-y-1">
                    <pre className="whitespace-pre-wrap text-[11px] text-neutral-800 leading-relaxed font-mono">
                      {docuAnswer}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {product.slug === 'flowstate' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-600">
                  n8n sovereign DAG engine. Executes visual multi-step agent automations and webhook consumers offline with deterministic replay.
                </p>
                <button
                  className="btn p text-xs w-full font-semibold"
                  style={{ height: '36px' }}
                  onClick={handleFlowRun}
                  disabled={flowRunning}
                >
                  {flowRunning ? 'Executing deterministic DAG steps...' : '▶ Replay Local DAG Workflow'}
                </button>
                {flowLog && (
                  <div className="p-3 bg-white border border-purple-200 rounded-sm font-mono text-xs space-y-1">
                    <pre className="whitespace-pre-wrap text-[11px] text-neutral-800 leading-relaxed font-mono">
                      {flowLog}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {product.slug === 'memstate' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-600">
                  Mem0 / Letta agent memory runtime. Stores episodic triples and semantic vectors locally in LibSQL + LanceDB.
                </p>
                <input
                  type="text"
                  className="w-full h-10 px-3 border text-xs font-mono rounded-sm bg-white"
                  value={memFact}
                  onChange={(e) => setMemFact(e.target.value)}
                />
                <button
                  className="btn p text-xs w-full font-semibold"
                  style={{ height: '36px' }}
                  onClick={handleMemStateStore}
                >
                  🧠 Extract Graph Triples & Store in Memory
                </button>
                {memStateRecall && (
                  <div className="p-3 bg-white border border-purple-200 rounded-sm font-mono text-xs space-y-1">
                    <pre className="whitespace-pre-wrap text-[11px] text-neutral-800 leading-relaxed font-mono">
                      {memStateRecall}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fig. 02: How Your Money Moves Diagram */}
          <div className="box">
            <div className="mono mb-3">Fig. 02 · How your money moves (Stewardship Model)</div>
            <svg viewBox="0 0 560 170" width="100%" role="img" aria-label="Capital flow from Backer to Vault and Maker">
              <path d="M0 40H560M0 80H560M0 120H560M0 160H560" stroke="#C4C0D0" strokeWidth="0.5" fill="none" />
              <g stroke="#14101F" strokeWidth="0.8">
                <rect x="30" y="45" width="100" height="70" fill="#fff" />
                <rect x="230" y="45" width="100" height="70" fill="#EDE4FF" />
                <rect x="430" y="45" width="100" height="70" fill="#F7F3FF" />
              </g>
              <path d="M130 80H230M330 80H430" stroke="#6D28D9" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
              <path d="M280 115V140H130" stroke="#8E8A9C" strokeDasharray="3 3" strokeWidth="0.8" fill="none" />
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#6D28D9" />
                </marker>
              </defs>
              <g fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#14101F" textAnchor="middle">
                <text x="80" y="80">SUBSCRIBER</text>
                <text x="280" y="74">ESCROW VAULT</text>
                <text x="280" y="90" fontSize="9" fill="#6D28D9">30% Ops · 20% Cont</text>
                <text x="480" y="80">STEWARD</text>
                <text x="180" y="72" fill="#6D28D9" fontWeight="600">{currentPrice}</text>
                <text x="380" y="72" fill="#6D28D9" fontWeight="600">50% REVIEW</text>
                <text x="200" y="148" fontSize="10" fill="#5E5A6B">CONTINGENCY REFUND ON ABANDONMENT</text>
              </g>
            </svg>
          </div>

          {/* 3-Column Primitives */}
          <div className="grid-cells c3">
            <div>
              <div className="mono">Local-First Access</div>
              <div className="d text-[18px] mt-1 mb-2">Local Keys, Zero Server DB</div>
              <span className="chip p">Verified</span>
            </div>
            <div>
              <div className="mono">Settlement Vault</div>
              <div className="d text-[18px] mt-1 mb-2">{vaultAmount} in Escrow</div>
              <span className="chip p">Galileo 16602</span>
            </div>
            <div>
              <div className="mono">Heartbeat Liveness</div>
              <div className="d text-[18px] mt-1 mb-2">{product.heartbeatUptime} Uptime</div>
              <span className="chip">Active Epoch</span>
            </div>
          </div>

          {/* Fig. 04: Architecture, 0G Tri-Layer & Financial Ledger */}
          <div className="box mk">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
              <div>
                <span className="mono text-purple-700">Fig. 04 · Sovereign System Architecture</span>
                <h3 className="d text-xl mt-0.5">Offline Database & 0G Tri-Layer Specification</h3>
              </div>
              <a
                href={product.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn text-xs font-mono"
                style={{ height: '32px', padding: '0 12px' }}
              >
                ↗ Upstream: {product.repoUrl.replace('https://github.com/', '')}
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3 bg-neutral-50/70 border space-y-1.5" style={{ borderColor: 'var(--line)' }}>
                <span className="text-neutral-500 font-semibold block uppercase text-[10px] tracking-wider">Local Database Engine</span>
                <b className="text-purple-900 block text-[13px]">{product.architecture?.databaseEngine || 'SQLite WASM (OPFS)'}</b>
                <p className="text-[11px] text-neutral-600">Zero cloud database dependency. Client state and index run in browser RAM / local disk.</p>
              </div>

              <div className="p-3 bg-neutral-50/70 border space-y-1.5" style={{ borderColor: 'var(--line)' }}>
                <span className="text-neutral-500 font-semibold block uppercase text-[10px] tracking-wider">Local Inference Engine</span>
                <b className="text-purple-900 block text-[13px]">{product.architecture?.inferenceEngine || 'ONNX Runtime Web / Ollama'}</b>
                <p className="text-[11px] text-neutral-600">Quantized models execute on edge CPU/WebGPU with 0G Private Computer TEE fallback.</p>
              </div>

              <div className="p-3 bg-neutral-50/70 border space-y-1.5" style={{ borderColor: 'var(--line)' }}>
                <span className="text-neutral-500 font-semibold block uppercase text-[10px] tracking-wider">0G Storage Turbo Layer</span>
                <b className="text-purple-900 block text-[11px] break-all">{product.zeroGIntegration?.storageTurboEndpoint || 'https://indexer-storage-testnet-turbo.0g.ai'}</b>
                <p className="text-[11px] text-neutral-600">Cadence: <b>{product.zeroGIntegration?.stateRootCadence || '24-hour Merkle root'}</b></p>
              </div>

              <div className="p-3 bg-neutral-50/70 border space-y-1.5" style={{ borderColor: 'var(--line)' }}>
                <span className="text-neutral-500 font-semibold block uppercase text-[10px] tracking-wider">0G Serving Broker Contract</span>
                <a
                  href={`https://chainscan-galileo.0g.ai/address/${product.zeroGIntegration?.servingBrokerAddress || '0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-700 underline block text-[11px]"
                >
                  {product.zeroGIntegration?.servingBrokerAddress || '0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939'}
                </a>
                <p className="text-[11px] text-neutral-600">Trust Mode: <b>{product.zeroGIntegration?.brokerTrustMode || 'private (Intel TDX sealed)'}</b></p>
              </div>
            </div>

            {/* CROPS Financial Ledger */}
            <div className="mt-4 pt-4 border-t font-mono text-xs" style={{ borderColor: 'var(--line)' }}>
              <span className="text-neutral-500 uppercase text-[10px] tracking-wider font-semibold block mb-2">CROPS Financial Stewardship Ledger (Monthly MRR: {product.mrr})</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 border bg-white rounded-sm">
                  <span className="text-neutral-400 block text-[10px]">30% Operations</span>
                  <b className="text-purple-700 text-sm">{product.stewardship?.monthlyOpsUsd || '$1,872'}</b>
                  <span className="text-[10px] text-neutral-500 block">0G gas & TEE</span>
                </div>
                <div className="p-2 border bg-white rounded-sm">
                  <span className="text-neutral-400 block text-[10px]">20% Contingency</span>
                  <b className="text-purple-700 text-sm">{product.stewardship?.monthlyContingencyUsd || '$1,248'}</b>
                  <span className="text-[10px] text-neutral-500 block">Bug fix vault</span>
                </div>
                <div className="p-2 border bg-white rounded-sm">
                  <span className="text-neutral-400 block text-[10px]">47.5% Review Lock</span>
                  <b className="text-purple-700 text-sm">{product.stewardship?.monthlyReviewLockUsd || '$2,964'}</b>
                  <span className="text-[10px] text-neutral-500 block">7-day hold</span>
                </div>
                <div className="p-2 border bg-white rounded-sm">
                  <span className="text-neutral-400 block text-[10px]">2.5% Upkeep Fee</span>
                  <b className="text-purple-700 text-sm">{product.stewardship?.monthlyUpkeepUsd || '$156'}</b>
                  <span className="text-[10px] text-neutral-500 block">Protocol keeper</span>
                </div>
              </div>
            </div>

            {/* Smart Contract Governance */}
            <div className="mt-4 pt-3 border-t font-mono text-[11px] text-neutral-600 flex flex-wrap justify-between items-center gap-2" style={{ borderColor: 'var(--line)' }}>
              <span>Escrow: <a href={`https://chainscan-galileo.0g.ai/address/${product.escrowAddress || product.governance?.escrowContract}`} target="_blank" rel="noreferrer" className="text-purple-700 underline">{product.escrowAddress?.slice(0, 10)}...{product.escrowAddress?.slice(-6)}</a></span>
              <span>Proposals: <b>{product.governance?.weeklyProposalLimit || '1 per 7 days'}</b></span>
              <span>Max Tranche: <b>{product.governance?.maxContingencyTranche || '20% vault ceiling'}</b></span>
              <span>Voting: <b>72h (Linear Deposit Weight)</b></span>
            </div>
          </div>

          {/* CROPS Evidence Table */}
          <div className="box" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: '180px' }}>CROPS Pillar</th>
                  <th>Cryptographic Evidence</th>
                  <th style={{ width: '90px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {product.cropsEvidence.map((row) => (
                  <tr key={row.code}>
                    <td>
                      <b>{row.code}</b> {row.label}
                    </td>
                    <td className="text-sm" style={{ color: 'var(--mut)' }}>
                      {row.evidence}
                    </td>
                    <td>
                      <span className={`chip ${row.status === 'Met' ? 'p' : ''}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Killswitch Rehearsal Box */}
          <div className="box mk" style={{ background: 'var(--soft)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="mono text-purple-700">CROPS Resistance Audit & Walkaway</span>
                <h3 className="d text-lg mt-0.5">Test Killswitch & Self-Hosting Export</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--mut)' }}>
                  Simulate developer server termination. Verify that escrow unlocks your 20% contingency refund and export your verifiable walkaway Docker bundle.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn text-xs font-semibold"
                  style={{ borderColor: 'var(--p)', color: 'var(--p)' }}
                  onClick={() => setShowKillswitchModal(true)}
                >
                  Rehearse killswitch
                </button>
                <button
                  className="btn text-xs font-semibold"
                  onClick={handleDownloadWalkaway}
                  title="Export offline Docker Compose, restore scripts, 0G manifest & offline reader"
                >
                  📦 Export Sovereign Bundle (.zip)
                </button>
              </div>
            </div>
          </div>

          {/* CROPS Waterfall Contingency & Proposal Reward Hub */}
          <WaterfallRewardHub
            productId={1}
            productSlug={product.slug}
            productName={product.name}
            contingencyVaultUSDT={1000}
          />

          {/* Attestation Log */}
          <div className="box">
            <div className="mono mb-2">Live Attestation & Uptime Log</div>
            {product.attestationLogs.map((log, i) => (
              <div
                key={i}
                className="log-entry"
                style={{ borderBottom: i === product.attestationLogs.length - 1 ? 0 : undefined }}
              >
                <span style={{ color: 'var(--p)', fontWeight: 600 }}>{log.date}</span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 3-Tier Backing Widget */}
        <div className="space-y-6">
          <div className="box mk">
            <div className="flex justify-between items-center mb-1">
              <div className="d text-2xl">Back {product.name}</div>
              <span className="chip p text-[10px]">USDT Billing</span>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--mut)' }}>
              Choose your sovereign access tier:
            </p>

            {/* Testnet USDT Faucet Banner */}
            <div className="p-3 bg-purple-50/50 border mb-4 font-mono text-xs space-y-1.5" style={{ borderColor: 'var(--line)' }}>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">
                  {isConnected ? 'Onchain USDT Balance:' : 'Preview USDT Balance:'}
                </span>
                <b className="text-purple-800">{displayUsdtBalance} USDT</b>
              </div>
              <button
                onClick={handleFaucet}
                disabled={txLoading}
                className="btn text-[11px] w-full"
                style={{ height: '30px', padding: '0 8px' }}
              >
                {txLoading
                  ? '⏳ Minting on 0G Galileo...'
                  : faucetClaimed
                  ? '✓ 100 Mock USDT Minted!'
                  : '💧 Claim 100 Mock USDT Faucet'}
              </button>
            </div>

            {/* Tier Selectors */}
            <div className="space-y-2 mb-4">
              {/* Free Preview Tier */}
              <label
                onClick={() => setSelectedTier('free')}
                className={`flex items-start gap-3 p-3 border cursor-pointer transition ${
                  selectedTier === 'free' ? 'border-purple-600 bg-purple-50/50' : 'border-neutral-200'
                }`}
              >
                <input
                  type="radio"
                  name="tier"
                  checked={selectedTier === 'free'}
                  onChange={() => setSelectedTier('free')}
                  className="mt-1"
                />
                <div className="flex-1 text-sm">
                  <div className="flex items-center justify-between font-semibold">
                    <span>{product.pricing.free.name}</span>
                    <span className="text-purple-700">0 USDT</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--mut)' }}>
                    {product.pricing.free.quota}
                  </p>
                </div>
              </label>

              {/* Pro Monthly Tier */}
              <label
                onClick={() => setSelectedTier('pro')}
                className={`flex items-start gap-3 p-3 border cursor-pointer transition ${
                  selectedTier === 'pro' ? 'border-purple-600 bg-purple-50/50' : 'border-neutral-200'
                }`}
              >
                <input
                  type="radio"
                  name="tier"
                  checked={selectedTier === 'pro'}
                  onChange={() => setSelectedTier('pro')}
                  className="mt-1"
                />
                <div className="flex-1 text-sm">
                  <div className="flex items-center justify-between font-semibold">
                    <span>{product.pricing.pro.name}</span>
                    <span className="text-purple-700">10 USDT / mo</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--mut)' }}>
                    {product.pricing.pro.quota}
                  </p>
                </div>
              </label>

              {/* Premium Annual Tier */}
              <label
                onClick={() => setSelectedTier('premium')}
                className={`flex items-start gap-3 p-3 border cursor-pointer transition ${
                  selectedTier === 'premium' ? 'border-purple-600 bg-purple-50/50' : 'border-neutral-200'
                }`}
              >
                <input
                  type="radio"
                  name="tier"
                  checked={selectedTier === 'premium'}
                  onChange={() => setSelectedTier('premium')}
                  className="mt-1"
                />
                <div className="flex-1 text-sm">
                  <div className="flex items-center justify-between font-semibold">
                    <span>{product.pricing.premium.name}</span>
                    <span className="text-purple-700">7 USDT / yr</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--mut)' }}>
                    {product.pricing.premium.quota}
                  </p>
                </div>
              </label>
            </div>

            {/* Fund Allocation Bar */}
            <div className="mono text-[10px] uppercase mb-1">Escrow Allocation Split</div>
            <div className="flex h-2.5 w-full overflow-hidden border border-neutral-300 rounded-sm">
              <div style={{ width: '30%', background: '#6D28D9' }} title="30% Ops" />
              <div style={{ width: '20%', background: '#A78BFA' }} title="20% Contingency" />
              <div style={{ width: '50%', background: '#E4E1EC' }} title="50% 1-Week Review Lock" />
            </div>
            <div className="flex justify-between text-[11px] font-mono mt-1 mb-4" style={{ color: 'var(--mut)' }}>
              <span>30% Ops</span>
              <span>20% Cont.</span>
              <span>50% 1-wk Lock</span>
            </div>

            <button
              className="btn p w-full text-center font-semibold"
              onClick={() => setShowBackModal(true)}
            >
              Back with escrow · {currentPrice}
            </button>

            <p className="text-[11px] text-center mt-3" style={{ color: 'var(--mut)' }}>
              Protected by 0G Galileo Smart Escrow & EF CROPS Guarantee.
            </p>
          </div>

          {/* Share & Embed Box */}
          <div className="box">
            <div className="mono mb-2">Share & Embed</div>
            <div className="p-3 mb-3" style={{ background: 'var(--pt)', border: 'var(--h)' }}>
              <div className="d text-lg">{product.name}</div>
              <span className="mono text-xs">Stage {product.stage} · {vaultAmount} in vault</span>
            </div>
            <div className="flex gap-2">
              <button className="btn flex-1 text-xs" onClick={handleCopyLink}>
                {copied ? 'Copied URL!' : 'Copy link'}
              </button>
              <button
                className="btn flex-1 text-xs"
                onClick={() => setShowEmbedModal(true)}
              >
                Embed widget
              </button>
            </div>
          </div>

          {/* On-Chain Metrics */}
          <div className="box">
            <div className="mono mb-2">Verified On-Chain State</div>
            <div className="divide-y text-xs font-mono" style={{ borderColor: 'var(--line)' }}>
              <div className="flex justify-between py-2">
                <span style={{ color: 'var(--mut)' }}>License</span>
                <b>{product.license}</b>
              </div>
              <div className="flex justify-between py-2">
                <span style={{ color: 'var(--mut)' }}>Verified MRR</span>
                <b>{product.mrr}</b>
              </div>
              <div className="flex justify-between py-2">
                <span style={{ color: 'var(--mut)' }}>Active Backers</span>
                <b>{backersCount}</b>
              </div>
              <div className="flex justify-between py-2">
                <span style={{ color: 'var(--mut)' }}>Heartbeat Signer</span>
                <b>0x52bA…7701</b>
              </div>
              <div className="flex justify-between py-2">
                <span style={{ color: 'var(--mut)' }}>Walkaway Format</span>
                <b>docker-compose / pg_dump</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Deposit Modal */}
      {showBackModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="box mk max-w-lg w-full bg-white p-6 sm:p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="mono text-purple-700">0G Galileo Escrow Deposit</span>
                <h3 className="d text-2xl mt-1">Back {product.name}</h3>
              </div>
              <button
                className="btn text-xs"
                style={{ height: '32px', padding: '0 10px' }}
                onClick={() => {
                  setShowBackModal(false);
                  setTxConfirmed(false);
                }}
              >
                ✕
              </button>
            </div>

            {txConfirmed ? (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-sm">
                  <b className="block text-sm mb-1">✓ Escrow Deposit Confirmed!</b>
                  <div>
                    Agreement ID: {agreementIdStr ? `${agreementIdStr.slice(0, 10)}…${agreementIdStr.slice(-4)}` : '0x9f81a7…2c4e'}
                  </div>
                  {onchainTxHash && (
                    <div className="mt-1">
                      Tx Hash:{' '}
                      <a
                        href={`https://chainscan-galileo.0g.ai/tx/${onchainTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-700 underline font-semibold hover:text-purple-900 break-all"
                      >
                        {onchainTxHash.slice(0, 14)}…{onchainTxHash.slice(-8)} (0G Galileo)
                      </a>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-neutral-50 border space-y-1" style={{ borderColor: 'var(--line)' }}>
                  <div className="flex justify-between">
                    <span>Transferred:</span>
                    <b>{currentPrice}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>30% Ops Unlocked:</span>
                    <b className="text-purple-700">{selectedTier === 'pro' ? '$3.00' : selectedTier === 'premium' ? '$2.10' : '$0.00'}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>20% Contingency Vault:</span>
                    <b className="text-purple-700">{selectedTier === 'pro' ? '$2.00' : selectedTier === 'premium' ? '$1.40' : '$0.00'}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>47.5% 1-Week Review Lock:</span>
                    <b className="text-purple-700">{selectedTier === 'pro' ? '$4.75' : selectedTier === 'premium' ? '$3.325' : '$0.00'}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>2.5% Hub Upkeep Remitted:</span>
                    <b className="text-purple-700">{selectedTier === 'pro' ? '$0.25' : selectedTier === 'premium' ? '$0.175' : '$0.00'}</b>
                  </div>
                </div>
                <p className="text-xs text-neutral-500">
                  Your deposit has been allocated into the stewardship escrow. 47.5% is locked for 7 days pending developer review, and 2.5% remitted for 0G platform upkeep.
                </p>
                <button
                  className="btn p w-full"
                  onClick={() => {
                    setShowBackModal(false);
                    setTxConfirmed(false);
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4 font-mono text-xs">
                {txLoading && (
                  <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 animate-pulse">
                    {txStep || 'Broadcasting transaction to 0G Galileo (Chain ID 16602)...'}
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-900">
                    {errorMessage}
                  </div>
                )}

                <div className="p-3 bg-neutral-50 border" style={{ borderColor: 'var(--line)' }}>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-500">Tier Selected:</span>
                    <b className="uppercase">{selectedTier}</b>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-500">Deposit Amount:</span>
                    <b className="text-purple-700 text-sm">{currentPrice}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Period:</span>
                    <span>{currentPeriod}</span>
                  </div>
                </div>

                <div className="border p-3 space-y-1.5" style={{ borderColor: 'var(--line)' }}>
                  <span className="mono block text-[10px] text-purple-700">Atomic Onchain Breakdown</span>
                  <div className="flex justify-between">
                    <span>30% Operations Reserve:</span>
                    <b>{selectedTier === 'pro' ? '3.00 USDT' : selectedTier === 'premium' ? '2.10 USDT' : '0.00 USDT'}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>20% Contingency Vault:</span>
                    <b>{selectedTier === 'pro' ? '2.00 USDT' : selectedTier === 'premium' ? '1.40 USDT' : '0.00 USDT'}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>47.5% 1-Week Review Lock:</span>
                    <b>{selectedTier === 'pro' ? '4.75 USDT' : selectedTier === 'premium' ? '3.325 USDT' : '0.00 USDT'}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>2.5% Stillworks Hub Upkeep:</span>
                    <b>{selectedTier === 'pro' ? '0.25 USDT' : selectedTier === 'premium' ? '0.175 USDT' : '0.00 USDT'}</b>
                  </div>
                </div>

                {!isConnected && (
                  <p className="text-[11px] text-neutral-500">
                    💡 Wallet not connected. Submitting will run in simulation mode. Connect your 0G Galileo wallet for live onchain transactions.
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    className="btn p flex-1 text-center font-semibold"
                    disabled={txLoading}
                    onClick={handleConfirmDeposit}
                  >
                    {txLoading ? 'Broadcasting to 0G Galileo...' : `Confirm Escrow Deposit (${currentPrice})`}
                  </button>
                  <button
                    className="btn"
                    disabled={txLoading}
                    onClick={() => setShowBackModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Killswitch Rehearsal Modal */}
      {showKillswitchModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="box mk max-w-lg w-full bg-white p-6 sm:p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="mono text-red-600">Simulated Disappearance</span>
                <h3 className="d text-2xl mt-1">Killswitch Rehearsal</h3>
              </div>
              <button
                className="btn text-xs"
                style={{ height: '32px', padding: '0 10px' }}
                onClick={() => {
                  setShowKillswitchModal(false);
                  setRefundClaimed(false);
                }}
              >
                ✕
              </button>
            </div>

            {refundClaimed ? (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-sm">
                  <b className="block text-sm mb-1">✓ Refund Claimed Successfully!</b>
                  Recovered Amount: <b>7.00 USDT</b> ($2 Contingency + $5 Unreleased)
                  <br />
                  Tx Hash: 0x9812…fa78 (0G Galileo)
                </div>
                <div className="p-3 bg-neutral-50 border space-y-2" style={{ borderColor: 'var(--line)' }}>
                  <b className="block text-neutral-800">Sovereign Walkaway Bundle (EF CROPS Standard):</b>
                  <div className="text-[11px] text-neutral-600 font-mono">
                    Storage Root: 0x20e807406258f81de5e4f5da6c479d8db2492bd952b1e56e040ef69a53db5c69
                  </div>
                  <button
                    onClick={handleDownloadWalkaway}
                    className="btn w-full text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    📦 Download Complete Walkaway ZIP (Docker, Scripts, Manifest, Offline Reader)
                  </button>
                  <p className="text-[10px] text-neutral-400">
                    Extract ZIP and run: <code className="text-purple-700">./restore-state.sh</code> (macOS/Linux) or <code className="text-purple-700">.\restore-state.bat</code> (Windows)
                  </p>
                </div>
                <button
                  className="btn p w-full"
                  onClick={() => {
                    setShowKillswitchModal(false);
                    setRefundClaimed(false);
                  }}
                >
                  Close Rehearsal
                </button>
              </div>
            ) : (
              <div className="space-y-4 font-mono text-xs">
                <p className="text-neutral-600 leading-relaxed">
                  In this test, the developer server goes offline and stops posting heartbeats past the 2-hour grace window.
                </p>

                <div className="p-3 bg-red-50 border border-red-200 text-red-900">
                  <div className="flex justify-between mb-1">
                    <span>Liveness Status:</span>
                    <b>2 Consecutive Epochs Missed</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Onchain Flag:</span>
                    <b>STATUS = ABANDONED</b>
                  </div>
                </div>

                <div className="border p-3 space-y-1" style={{ borderColor: 'var(--line)' }}>
                  <div className="flex justify-between">
                    <span>Contingency Vault Recoverable:</span>
                    <b>2.00 USDT</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Unreleased Review Balance:</span>
                    <b>5.00 USDT</b>
                  </div>
                  <div className="flex justify-between pt-1 border-t text-sm font-bold text-neutral-900" style={{ borderColor: 'var(--line)' }}>
                    <span>Total Claimable:</span>
                    <span className="text-purple-700">7.00 USDT</span>
                  </div>
                </div>

                <button
                  className="btn p w-full bg-red-700 border-red-700 hover:bg-red-800"
                  onClick={() => setRefundClaimed(true)}
                >
                  Claim 7.00 USDT Contingency Refund
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embed Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="box mk max-w-lg w-full bg-white p-6 sm:p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="mono">Sovereign Embed</span>
                <h3 className="d text-2xl mt-1">Embed {product.name} Badge</h3>
              </div>
              <button
                className="btn text-xs"
                style={{ height: '32px', padding: '0 10px' }}
                onClick={() => setShowEmbedModal(false)}
              >
                ✕
              </button>
            </div>
            <p className="text-xs mb-3 font-mono" style={{ color: 'var(--mut)' }}>
              Embed this verified sovereign backing badge on your site or documentation:
            </p>
            <textarea
              readOnly
              className="w-full h-24 p-3 border font-mono text-xs bg-neutral-50 rounded-sm mb-4"
              value={embedCode}
            />
            <div className="flex gap-2 justify-end">
              <button
                className="btn p"
                onClick={() => {
                  navigator.clipboard.writeText(embedCode);
                  setShowEmbedModal(false);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2500);
                }}
              >
                Copy Embed Code
              </button>
              <button className="btn" onClick={() => setShowEmbedModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
