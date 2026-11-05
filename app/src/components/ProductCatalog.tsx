'use client';

import { ShieldCheck, Heart, ExternalLink, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export interface Product {
  id: number;
  name: string;
  category: string;
  founder: string;
  heartbeatInterval: string;
  lastHeartbeat: string;
  isAlive: boolean;
  passportRoot: string;
  monthlyPrice: string;
  description: string;
}

const DEMO_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Ghostwriter AI (Self-Hosted RAG)',
    category: 'Developer Tools',
    founder: '0x237e...21c7',
    heartbeatInterval: '1 Hour',
    lastHeartbeat: '4 mins ago',
    isAlive: true,
    passportRoot: '0x4f82c9e782631527bbba64a138c4d59a721d019f9e1e7e9e7b9e7a8f9c1e7a8f',
    monthlyPrice: '0.05 0G',
    description: 'Autonomous document indexer with encrypted local embeddings and private TEE inference.',
  },
  {
    id: 2,
    name: 'SovereignSync (Backup & Replication)',
    category: 'Storage & Cloud',
    founder: '0x71a4...98b2',
    heartbeatInterval: '6 Hours',
    lastHeartbeat: '18 mins ago',
    isAlive: true,
    passportRoot: '0x99a2c8e312457891bbfa12c984d59a112d019f9e1e7e9e7b9e7a8f9c1e7a4312',
    monthlyPrice: '0.02 0G',
    description: 'Continuous SQLite and PostgreSQL replication direct to 0G Storage Turbo layer.',
  },
  {
    id: 3,
    name: 'SentientWatchdog (Uptime & Attestation)',
    category: 'Monitoring',
    founder: '0xfe89...11c4',
    heartbeatInterval: '30 Mins',
    lastHeartbeat: '1 min ago',
    isAlive: true,
    passportRoot: '0x7b11d8e344157891bbfa12c984d59a112d019f9e1e7e9e7b9e7a8f9c1e7abb19',
    monthlyPrice: '0.03 0G',
    description: 'Cross-chain heartbeat oracle verifying service liveness and automatically unfreezing escrows.',
  },
];

export function ProductCatalog({
  onSelectAudit,
}: {
  onSelectAudit: (product: Product) => void;
}) {
  const [subscribingId, setSubscribingId] = useState<number | null>(null);
  const [subscribedIds, setSubscribedIds] = useState<number[]>([]);

  const handleSubscribe = (id: number) => {
    setSubscribingId(id);
    setTimeout(() => {
      setSubscribedIds((prev) => [...prev, id]);
      setSubscribingId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Sovereign Software Catalog</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Heartbeats
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tools with onchain passports and proof of sovereign operation. Escrows refund immediately upon missed heartbeat.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DEMO_PRODUCTS.map((product) => {
          const isSubscribed = subscribedIds.includes(product.id);
          const isSubscribing = subscribingId === product.id;

          return (
            <div
              key={product.id}
              className="bg-zerog-cardBg border border-zerog-border hover:border-zerog-purple/50 rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-zerog-purple/10"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-mono">Alive ({product.lastHeartbeat})</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white text-base">{product.name}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-zerog-border/70 space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Founder Signer:</span>
                    <span className="font-mono text-slate-300">{product.founder}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Heartbeat Interval:</span>
                    <span className="text-slate-300">{product.heartbeatInterval}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">0G Passport Root:</span>
                    <span className="font-mono text-zerog-purple truncate max-w-[140px]" title={product.passportRoot}>
                      {product.passportRoot.slice(0, 8)}...{product.passportRoot.slice(-6)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zerog-border/70 flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Escrow Release</span>
                  <span className="text-sm font-bold text-white">{product.monthlyPrice}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectAudit(product)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                    title="Audit with 0G Private Computer"
                  >
                    <Cpu className="w-4 h-4 text-zerog-purple" />
                  </button>

                  <button
                    onClick={() => handleSubscribe(product.id)}
                    disabled={isSubscribed || isSubscribing}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isSubscribed
                        ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                        : isSubscribing
                        ? 'bg-zerog-purple/50 text-white cursor-wait'
                        : 'bg-zerog-purple hover:bg-zerog-purpleDark text-white shadow-md'
                    }`}
                  >
                    {isSubscribed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Funded</span>
                      </>
                    ) : isSubscribing ? (
                      <span>Locking...</span>
                    ) : (
                      <span>Fund Escrow</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
