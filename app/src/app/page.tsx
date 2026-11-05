'use client';

import { useState } from 'react';
import { StorageExplorer } from '@/components/StorageExplorer';
import { ComputeAuditor } from '@/components/ComputeAuditor';
import { EscrowKillswitch } from '@/components/EscrowKillswitch';
import { ProductCatalog, Product } from '@/components/ProductCatalog';
import { Database, Cpu, ShieldAlert, Store, Sparkles } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'storage' | 'compute' | 'killswitch' | 'catalog'>('storage');
  const [selectedProductForAudit, setSelectedProductForAudit] = useState<Product | undefined>(undefined);

  const handleSelectAudit = (product: Product) => {
    setSelectedProductForAudit(product);
    setActiveTab('compute');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-zerog-cardBg to-black/80 border border-zerog-border p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zerog-purple/10 border border-zerog-purple/30 text-xs font-semibold text-zerog-purple">
            <Sparkles className="w-3.5 h-3.5 text-zerog-purple" />
            <span>0G Full-Stack Application Interface</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            0G Decentralized <span className="text-transparent bg-clip-text bg-gradient-to-r from-zerog-purple via-pink-400 to-indigo-400">Storage & Infrastructure</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Connect with Wagmi on 0G Galileo (Chain ID 16602). Test data persistence across 0G Storage Turbo nodes, verify Merkle roots, access TEE AI inference, and monitor sovereign smart contract escrows.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-xs font-mono text-slate-400">
            <span className="bg-black/50 px-3 py-1.5 rounded-lg border border-zerog-border">
              Network: <strong className="text-white">0G Galileo (16602)</strong>
            </span>
            <span className="bg-black/50 px-3 py-1.5 rounded-lg border border-zerog-border">
              Storage: <strong className="text-zerog-purple">0G Turbo Indexer</strong>
            </span>
            <span className="bg-black/50 px-3 py-1.5 rounded-lg border border-zerog-border">
              Wallet Stack: <strong className="text-emerald-400">Wagmi v2 + Viem</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zerog-border overflow-x-auto space-x-1 sm:space-x-2">
        <button
          onClick={() => setActiveTab('storage')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'storage'
              ? 'border-zerog-purple text-white bg-zerog-purple/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-zerog-purple" />
          <span>0G Storage Station (Import & Export)</span>
        </button>

        <button
          onClick={() => setActiveTab('compute')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'compute'
              ? 'border-zerog-purple text-white bg-zerog-purple/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4 text-zerog-purple" />
          <span>0G Private Compute & TEE Inference</span>
        </button>

        <button
          onClick={() => setActiveTab('killswitch')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'killswitch'
              ? 'border-rose-500 text-rose-300 bg-rose-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Escrow Killswitch & Walkaway Rail</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'catalog'
              ? 'border-zerog-purple text-white bg-zerog-purple/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Store className="w-4 h-4 text-zerog-purple" />
          <span>Live Tools & Heartbeats</span>
        </button>
      </div>

      {/* Main Tab Panels */}
      <section className="transition-all duration-200">
        {activeTab === 'storage' && (
          <StorageExplorer />
        )}

        {activeTab === 'compute' && (
          <ComputeAuditor selectedProduct={selectedProductForAudit} />
        )}

        {activeTab === 'killswitch' && (
          <EscrowKillswitch />
        )}

        {activeTab === 'catalog' && (
          <ProductCatalog onSelectAudit={handleSelectAudit} />
        )}
      </section>
    </div>
  );
}
