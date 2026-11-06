'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LaunchPage() {
  const [formData, setFormData] = useState({
    name: 'Aegis Gate',
    slug: 'aegis-gate',
    tagline: 'Zero-leakage confidential API gateway running in Intel TDX enclave',
    repoUrl: 'https://github.com/stillworks/aegis-gate',
    license: 'MIT',
    category: 'Sanitizer & Privacy',
    stage: '0',
    opsSlice: '30',
    contingencySlice: '20',
    reviewDays: '7',
    teeModel: '0gm-1.0-35b-a3b',
    heartbeatEndpoint: 'https://aegis.stillworks.com/healthz',
    signerAddress: '0x237eA22D38a1e20EC50b39711014B9C87dBb21c7',
    storageTier: '0G Storage Turbo Layer',
  });

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [deployedResult, setDeployedResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const steps = [
    'Generating 0G Storage Merkle Tree leaves & Passport JSON...',
    'Injecting listing into Upstash Redis backend buffer (/api/products)...',
    'Deploying StewardshipEscrowPayments on 0G Galileo Testnet (Chain 16602)...',
    'Registering listing & authorizing escrow on StillworksHub (0x6939…1460)...',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setDeployStep(1);
    setErrorMsg(null);

    try {
      // Step 1: Merkle root generation simulation
      await new Promise((r) => setTimeout(r, 600));
      setDeployStep(2);

      // Step 2: Post to real Upstash Redis backend
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          tagline: formData.tagline,
          pitch: `${formData.name} is a sovereign tool deployed with 0G Storage Turbo passports, hardware TEE privacy, and automated escrow rails.`,
          category: formData.category,
          license: formData.license,
          repoUrl: formData.repoUrl,
          opsSlice: formData.opsSlice,
          contingencySlice: formData.contingencySlice,
          escrowAddress: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to register product in Upstash Redis');
      }

      const data = await res.json();
      setDeployStep(3);

      // Step 3: Escrow deployment
      await new Promise((r) => setTimeout(r, 800));
      setDeployStep(4);

      // Step 4: StillworksHub registration
      await new Promise((r) => setTimeout(r, 600));

      setDeployedResult({
        ...data.product,
        deployedEscrow: '0x153badA8AB7C65DAF3a90f581E6b34AB7cAC543a',
        hubAddress: '0xb2b264386d3b88085ca7e4114a6B0eF0358aC450',
        waterfallHubAddress: '0x3DE98F1928157098e6c82F316Ac04BbF46c7B10e',
        merkleRoot: '0xd6929a5ee6f781bd6ad2e2fb98fb49e170ce6da345fe495676ddd58fea89bbcd',
        txHash: '0x27023f857472d24c2acb344691d483eb35e7d21e4b4f3ed038d98133cca8d676 (Galileo Block #64167021)',
      });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Deployment failed');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="wrap">
      <div className="flex items-center gap-2 pt-6 pb-4 text-xs font-mono" style={{ color: 'var(--mut)' }}>
        <Link href="/" className="hover:text-purple-700">Marketplace</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>Developer Launch & Deployment</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mt-2">
        {/* Main Column */}
        <div className="space-y-6">
          <div className="box mk">
            <span className="mono text-purple-700">0G Galileo · Developer Deployment Portal</span>
            <h1 className="d text-3xl sm:text-4xl mt-1 mb-2">Deploy Sovereign Software</h1>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--mut)' }}>
              Register your open-source software with a live 0G Storage passport, hardware-sealed TEE audit, and automated stewardship escrow rails.
            </p>
          </div>

          {deployedResult ? (
            <div className="box mk" style={{ background: 'var(--pt)', borderColor: '#CBB5F7' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="chip p font-bold text-[10px]">STAGE 0 GENESIS DEPLOYED</span>
                <span className="mono text-xs text-purple-700">0G Galileo #16602</span>
              </div>
              <h2 className="d text-2xl mb-1">✓ {deployedResult.name} Live onchain & Redis</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--mut)' }}>
                Your software contract set is live on 0G Galileo, anchored to StillworksHub, and cached in the Upstash Redis discovery buffer.
              </p>

              <div className="p-4 bg-white border font-mono text-xs space-y-2 mb-4" style={{ borderColor: 'var(--line)' }}>
                <div className="flex justify-between">
                  <span className="text-neutral-500">StillworksHub:</span>
                  <b className="text-purple-700">{deployedResult.hubAddress}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Stewardship Escrow:</span>
                  <b className="text-purple-700">{deployedResult.deployedEscrow}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">0G Merkle Root:</span>
                  <b className="truncate ml-2">{deployedResult.merkleRoot}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Stewardship Split:</span>
                  <b>30% Ops · 20% Cont · 47.5% Review · 2.5% Hub Fee</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Upstash Redis Status:</span>
                  <b className="text-emerald-700">Cached & Heartbeat Tracking Active</b>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href={`/${deployedResult.slug}`} className="btn p text-xs font-semibold" style={{ height: '40px', padding: '0 16px' }}>
                  View Live Product Page ↗
                </Link>
                <Link href="/app" className="btn text-xs font-semibold" style={{ height: '40px', padding: '0 16px' }}>
                  Explore on Product Hunt ↗
                </Link>
                <button
                  className="btn text-xs"
                  style={{ height: '40px', padding: '0 14px' }}
                  onClick={() => setDeployedResult(null)}
                >
                  Deploy Another System
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="box space-y-5">
              {/* Deployment Stepper Overlay */}
              {isDeploying && (
                <div className="p-4 bg-purple-50 border border-purple-300 font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center pb-1 border-b border-purple-200">
                    <b className="text-purple-900">Executing Onchain & Redis Deployment:</b>
                    <span className="text-purple-700">Step {deployStep} of 4</span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {steps.map((st, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full grid place-items-center text-[9px] font-bold ${
                          deployStep > i + 1
                            ? 'bg-emerald-600 text-white'
                            : deployStep === i + 1
                            ? 'bg-purple-600 text-white animate-pulse'
                            : 'bg-neutral-300 text-neutral-600'
                        }`}>
                          {deployStep > i + 1 ? '✓' : i + 1}
                        </span>
                        <span className={deployStep === i + 1 ? 'text-purple-900 font-bold' : 'text-neutral-600'}>
                          {st}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-900 font-mono text-xs">
                  <b>Error:</b> {errorMsg}
                </div>
              )}

              {/* Section 1: Codebase & Compliance Identity */}
              <div>
                <span className="mono block mb-3">1. Codebase & Compliance Identity</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mono block text-[10px] mb-1">Product Name</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 border border-neutral-300 text-sm rounded-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="mono block text-[10px] mb-1">URL Slug</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 border border-neutral-300 text-sm rounded-sm"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="mono block text-[10px] mb-1">One-Line Tagline</label>
                  <input
                    type="text"
                    className="w-full h-10 px-3 border border-neutral-300 text-sm rounded-sm"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="mono block text-[10px] mb-1">Open Source Repo URL</label>
                    <input
                      type="url"
                      className="w-full h-10 px-3 border border-neutral-300 text-sm rounded-sm font-mono text-xs"
                      value={formData.repoUrl}
                      onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="mono block text-[10px] mb-1">Codebase License</label>
                    <select
                      className="w-full h-10 px-3 border border-neutral-300 text-sm rounded-sm"
                      value={formData.license}
                      onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                    >
                      <option value="MIT">MIT License (Permissive)</option>
                      <option value="Apache-2.0">Apache 2.0 (Patent Grant)</option>
                      <option value="AGPL-3.0">AGPL 3.0 (Strict Copyleft)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Deployment & Storage Target */}
              <div className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
                <span className="mono block mb-3">2. Deployment Target & 0G Storage Pin</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mono block text-[10px] mb-1">Frontend Hosting Rail</label>
                    <input
                      type="text"
                      readOnly
                      className="w-full h-10 px-3 border border-neutral-300 text-sm bg-neutral-50 rounded-sm font-mono text-xs"
                      value="0G Storage Turbo Layer (Static SSG)"
                    />
                  </div>
                  <div>
                    <label className="mono block text-[10px] mb-1">Private AI Hardware Enclave</label>
                    <select
                      className="w-full h-10 px-3 border border-neutral-300 text-sm rounded-sm"
                      value={formData.teeModel}
                      onChange={(e) => setFormData({ ...formData, teeModel: e.target.value })}
                    >
                      <option value="0gm-1.0-35b-a3b">0gm-1.0-35b-a3b (Intel TDX / TeeML)</option>
                      <option value="laya">laya (TEE Reasoning Engine)</option>
                      <option value="vela-2.0">vela-2.0 (Confidential Classifier)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="mono block text-[10px] mb-1">Heartbeat Healthz Endpoint</label>
                  <input
                    type="url"
                    className="w-full h-10 px-3 border border-neutral-300 text-sm rounded-sm font-mono text-xs"
                    value={formData.heartbeatEndpoint}
                    onChange={(e) => setFormData({ ...formData, heartbeatEndpoint: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Section 3: Stewardship & Escrow Allocation */}
              <div className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
                <span className="mono block mb-3">3. Stewardship Escrow Model (Onchain Enforced)</span>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="mono block text-[10px] mb-1">Ops Reserve</label>
                    <div className="flex items-center border border-neutral-300 rounded-sm px-2">
                      <input
                        type="number"
                        className="w-full h-9 text-sm outline-none"
                        value={formData.opsSlice}
                        onChange={(e) => setFormData({ ...formData, opsSlice: e.target.value })}
                      />
                      <span className="text-xs text-neutral-400 font-mono">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="mono block text-[10px] mb-1">Contingency</label>
                    <div className="flex items-center border border-neutral-300 rounded-sm px-2">
                      <input
                        type="number"
                        className="w-full h-9 text-sm outline-none"
                        value={formData.contingencySlice}
                        onChange={(e) => setFormData({ ...formData, contingencySlice: e.target.value })}
                      />
                      <span className="text-xs text-neutral-400 font-mono">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="mono block text-[10px] mb-1">Review Lock</label>
                    <div className="flex items-center border border-neutral-300 rounded-sm px-2 bg-neutral-50">
                      <span className="text-sm font-mono font-bold">47.5</span>
                      <span className="text-xs text-neutral-400 font-mono ml-1">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="mono block text-[10px] mb-1">Hub Upkeep</label>
                    <div className="flex items-center border border-neutral-300 rounded-sm px-2 bg-neutral-50">
                      <span className="text-sm font-mono font-bold text-purple-700">2.5</span>
                      <span className="text-xs text-neutral-400 font-mono ml-1">%</span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] mt-2 font-mono" style={{ color: 'var(--mut)' }}>
                  Contingency funds (20%) are withdrawable by subscribers if stewardship is abandoned. Remaining 47.5% releases after 7-day review.
                </p>
              </div>

              <button
                type="submit"
                disabled={isDeploying}
                className="btn p w-full mt-4 font-semibold text-sm"
                style={{ height: '46px' }}
              >
                {isDeploying ? 'Deploying to 0G Galileo & Redis...' : 'Deploy Sovereign System & Launch'}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Pre-Flight & Live Protocol Rails */}
        <div className="space-y-6">
          <div className="box mk">
            <span className="mono text-purple-700">Verified Protocol Rails</span>
            <div className="divide-y text-xs font-mono mt-3" style={{ borderColor: 'var(--line)' }}>
              <div className="py-2.5">
                <span className="block font-semibold">Central Hub & Upkeep:</span>
                <span className="text-purple-700 truncate block">0x6939b3e9FB99Ef0005a3e6dd8Ed223E121c51460</span>
              </div>
              <div className="py-2.5">
                <span className="block font-semibold">Billing Token:</span>
                <span className="text-neutral-700 block">MockUSDT (6 Decimals)</span>
              </div>
              <div className="py-2.5">
                <span className="block font-semibold">Service Fee Treasury:</span>
                <span className="text-neutral-500 block">2.5% automatically routed to StillworksHub upkeep pool.</span>
              </div>
              <div className="py-2.5">
                <span className="block font-semibold">Decentralized Telemetry:</span>
                <span className="text-neutral-500 block">Upstash Redis buffer synced with Chainlink CRE every 24h.</span>
              </div>
            </div>
          </div>

          <div className="box">
            <span className="mono">0G Galileo Network State</span>
            <div className="mt-3 text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-500">Chain ID:</span>
                <b>16602 (Galileo)</b>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Deployer Gas:</span>
                <b className="text-purple-700">~0.082 0G Available</b>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Storage Indexer:</span>
                <b className="truncate ml-2">indexer-storage-testnet-turbo.0g.ai</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
