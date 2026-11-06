'use client';

import { useState } from 'react';
import Link from 'next/link';
import { products, type Product } from '@/data/products';
import { SandboxModal } from '@/components/SandboxModal';

export default function LeaderboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'vault' | 'mrr' | 'uptime'>('score');
  const [sandboxProduct, setSandboxProduct] = useState<Product | null>(null);

  const categories = ['All', 'Sanitizer & Privacy', 'Scheduler', 'Private AI', 'Calendar', 'Knowledge Base', 'Newsletter'];

  const ranked = [...products]
    .filter((p) => {
      if (selectedCategory === 'All') return true;
      return p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'vault') {
        const vA = parseInt(a.vault.replace(/[^0-9]/g, ''), 10) || 0;
        const vB = parseInt(b.vault.replace(/[^0-9]/g, ''), 10) || 0;
        return vB - vA;
      }
      if (sortBy === 'mrr') {
        const mA = parseInt(a.mrr.replace(/[^0-9]/g, ''), 10) || 0;
        const mB = parseInt(b.mrr.replace(/[^0-9]/g, ''), 10) || 0;
        return mB - mA;
      }
      if (sortBy === 'uptime') {
        const uA = parseFloat(a.heartbeatUptime) || 0;
        const uB = parseFloat(b.heartbeatUptime) || 0;
        return uB - uA;
      }
      return 0;
    });

  return (
    <div className="wrap">
      {sandboxProduct && <SandboxModal product={sandboxProduct} onClose={() => setSandboxProduct(null)} />}

      <div className="flex items-center gap-2 pt-6 pb-4 text-xs font-mono" style={{ color: 'var(--mut)' }}>
        <Link href="/" className="hover:text-purple-700">Marketplace</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>Public Registry Index</span>
      </div>

      <div className="box mk">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="mono text-purple-700">0G Galileo Registry Index</span>
            <h1 className="d text-3xl sm:text-4xl mt-1 mb-2">Public Sovereignty Scores</h1>
            <p className="text-sm max-w-2xl" style={{ color: 'var(--mut)' }}>
              Rankings are calculated dynamically: 40% liveness uptime, 40% CROPS completeness, and 20% escrow health. Zero vanity metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="mono text-xs">Sort:</span>
            <select
              className="h-9 px-3 border border-neutral-300 rounded-sm font-mono text-xs bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="score">Highest Sovereignty Score</option>
              <option value="vault">Largest Vault ($)</option>
              <option value="mrr">Verified MRR ($)</option>
              <option value="uptime">Heartbeat Uptime (%)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`chip cursor-pointer transition ${selectedCategory === cat ? 'p font-bold' : 'hover:bg-neutral-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="box mt-6" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Rank</th>
              <th>Product</th>
              <th>Stage</th>
              <th>CROPS Pillars</th>
              <th>Verified MRR</th>
              <th>In Vault</th>
              <th>Heartbeat</th>
              <th>Score</th>
              <th style={{ width: '170px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((product, idx) => {
              const crops = product.cropsMet;
              return (
                <tr key={product.slug}>
                  <td className="font-mono font-bold text-neutral-400">#{idx + 1}</td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-7 h-7 grid place-items-center font-bold text-xs border flex-none"
                        style={{ background: 'var(--pt)', borderColor: 'var(--line)', color: 'var(--p)' }}
                      >
                        {product.name[0]}
                      </span>
                      <div>
                        <Link href={`/${product.slug}`} className="font-semibold text-sm hover:text-purple-700 transition">
                          {product.name}
                        </Link>
                        <span className="block text-xs" style={{ color: 'var(--mut)' }}>{product.category}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="chip p text-[10px]">Stage {product.stage}/3</span>
                  </td>
                  <td>
                    <div className="cr">
                      <b className={crops.c ? 'on' : ''}>C</b>
                      <b className={crops.r ? 'on' : ''}>R</b>
                      <b className={crops.o ? 'on' : ''}>O</b>
                      <b className={crops.p ? 'on' : ''}>P</b>
                      <b className={crops.s ? 'on' : ''}>S</b>
                    </div>
                  </td>
                  <td className="font-mono text-xs">{product.mrr}</td>
                  <td className="font-mono text-xs">{product.vault}</td>
                  <td>
                    <span className="font-mono text-xs text-purple-700 font-semibold">{product.heartbeatUptime}</span>
                  </td>
                  <td>
                    <b className="text-purple-700 font-mono text-sm">{product.score} / 100</b>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSandboxProduct(product)}
                        className="btn text-[11px]"
                        style={{ height: '30px', padding: '0 8px' }}
                      >
                        ⚡ Try
                      </button>
                      <Link href={`/${product.slug}`} className="btn p text-[11px]" style={{ height: '30px', padding: '0 10px' }}>
                        Inspect
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
