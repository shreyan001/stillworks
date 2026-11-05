'use client';

import { useState } from 'react';
import { ProductCatalog, Product } from '@/components/ProductCatalog';
import { ComputeAuditor } from '@/components/ComputeAuditor';
import { StorageExplorer } from '@/components/StorageExplorer';
import { EscrowKillswitch } from '@/components/EscrowKillswitch';
import { Store, Cpu, Database, ShieldAlert, Sparkles, Layers } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'compute' | 'storage' | 'killswitch'>('catalog');
  const [selectedProductForAudit, setSelectedProductForAudit] = useState<Product | undefined>(undefined);

  const handleSelectAudit = (product: Product) => {
    setSelectedProductForAudit(product);
    setActiveTab('compute');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-zerog-cardBg to-black/80 border border-zerog-border p-6 sm:p-8 md:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zerog-purple/10 border border-zerog-purple/30 text-xs font-semibold text-zerog-purple">
            <Sparkles className="w-3.5 h-3.5 text-zerog-purple" />
            <span>Built with 0G Galileo · 0G Storage Turbo · 0G Private Computer</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Sovereign Software Commerce on <span className="text-transparent bg-clip-text bg-gradient-to-r from-zerog-purple via-pink-400 to-indigo-400">0G</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Subscribe to open-source autonomous tools that publish live heartbeats. Escrow releases only when the software is operational. If the founder disappears, receive an automatic pro-rata refund and an encrypted walkaway bundle to self-host.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-xs font-mono text-slate-400">
            <span className="bg-black/50 px-3 py-1.5 rounded-lg border border-zerog-border">
              Chain ID: <strong className="text-white">16602</strong>
            </span>
            <span className="bg-black/50 px-3 py-1.5 rounded-lg border border-zerog-border">
              Storage: <strong className="text-zerog-purple">0G Turbo Layer</strong>
            </span>
            <span className="bg-black/50 px-3 py-1.5 rounded-lg border border-zerog-border">
              Compute: <strong className="text-emerald-400">TEE Private Inference</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zerog-border overflow-x-auto space-x-1 sm:space-x-2">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'catalog'
              ? 'border-zerog-purple text-white bg-zerog-purple/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Store className="w-4 h-4 text-zerog-purple" />
          <span>Product Storefront</span>
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
          <span>0G Private Compute Auditor</span>
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'storage'
              ? 'border-zerog-purple text-white bg-zerog-purple/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-zerog-purple" />
          <span>0G Storage Turbo Station</span>
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
          <span>Kill-Switch Rehearsal (CROPS)</span>
        </button>
      </div>

      {/* Main Tab Panels */}
      <section className="transition-all duration-200">
        {activeTab === 'catalog' && (
          <ProductCatalog onSelectAudit={handleSelectAudit} />
        )}

        {activeTab === 'compute' && (
          <ComputeAuditor selectedProduct={selectedProductForAudit} />
        )}

        {activeTab === 'storage' && (
          <StorageExplorer />
        )}

        {activeTab === 'killswitch' && (
          <EscrowKillswitch />
        )}
      </section>
    </div>
  );
}
