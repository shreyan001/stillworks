'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { products as initialProducts, type Product } from '@/data/products';
import rawSnapshot from '@/data/live-snapshot.json';
import { SandboxModal } from '@/components/SandboxModal';
import { RedisTelemetryBanner } from '@/components/RedisTelemetryBanner';

const snapshot = rawSnapshot as {
  timestamp: string | null;
  snapshotRoot: string | null;
  inference: { text: string; requestId: string; model: string; trust: string } | null;
};

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'vault' | 'mrr' | 'score'>('featured');
  const [upvotes, setUpvotes] = useState<Record<string, number>>({});
  const [upvotedState, setUpvotedState] = useState<Record<string, boolean>>({});
  const [activeModal, setActiveModal] = useState<'graduation' | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [sandboxProduct, setSandboxProduct] = useState<Product | null>(null);

  // Fetch live products from Upstash Redis on mount
  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.log('Redis load fallback:', err));
  }, []);

  // Initialize upvotes from local storage or product defaults
  useEffect(() => {
    const savedUpvotes: Record<string, number> = {};
    const savedVoted: Record<string, boolean> = {};
    initialProducts.forEach((p) => {
      const stored = localStorage.getItem(`upvote_${p.slug}`);
      if (stored) {
        savedUpvotes[p.slug] = parseInt(stored, 10);
        savedVoted[p.slug] = true;
      } else {
        savedUpvotes[p.slug] = p.backers;
        savedVoted[p.slug] = false;
      }
    });
    setUpvotes(savedUpvotes);
    setUpvotedState(savedVoted);
  }, []);

  const handleUpvote = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = upvotes[slug] || 0;
    const isVoted = upvotedState[slug];
    const nextVal = isVoted ? current - 1 : current + 1;
    setUpvotes((prev) => ({ ...prev, [slug]: nextVal }));
    setUpvotedState((prev) => ({ ...prev, [slug]: !isVoted }));
    if (!isVoted) {
      localStorage.setItem(`upvote_${slug}`, nextVal.toString());
    } else {
      localStorage.removeItem(`upvote_${slug}`);
    }
  };

  const categories = [
    'All',
    'Sanitizer & Privacy',
    'Scheduler & Social',
    'Private AI',
    'Calendar & Scheduling',
    'Knowledge Base',
    'Newsletter & Email',
    'Developer Tools',
    'Audio & Media',
    'Infrastructure & Security',
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category.toLowerCase().includes(selectedCategory.toLowerCase());
  }).sort((a, b) => {
    if (sortBy === 'vault') {
      const vA = parseInt(a.vault.replace(/[^0-9]/g, ''), 10);
      const vB = parseInt(b.vault.replace(/[^0-9]/g, ''), 10);
      return vB - vA;
    }
    if (sortBy === 'mrr') {
      const mA = parseInt(a.mrr.replace(/[^0-9]/g, ''), 10);
      const mB = parseInt(b.mrr.replace(/[^0-9]/g, ''), 10);
      return mB - mA;
    }
    if (sortBy === 'score') {
      return b.score - a.score;
    }
    return 0; // featured default order
  });

  return (
    <div className="wrap">
      {/* Live Upstash Redis & 0G Telemetry Banner */}
      <div className="pt-4">
        <RedisTelemetryBanner />
      </div>

      {/* Hero Section */}
      <section
        className="grid-cells"
        style={{ gridTemplateColumns: '1.05fr .95fr', marginTop: '24px' }}
      >
        <div style={{ padding: '48px 40px' }}>
          <span className="mono">Fig. 00 · Launchpad for sovereign software</span>
          <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 68px)', lineHeight: 1.05, margin: '16px 0' }}>
            Where software graduates.
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--mut)', maxWidth: '480px', margin: '0 0 24px', lineHeight: 1.5 }}>
            Every product starts on escrow and earns its way to full sovereignty: more capital at each stage, more freedom for its users.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a className="btn p" href="#launches">
              Explore the stage board
            </a>
            <button className="btn" onClick={() => setActiveModal('graduation')}>
              How graduation works
            </button>
          </div>
          <div className="mt-8 pt-5 border-t" style={{ borderColor: 'var(--line)' }}>
            <span className="mono block text-[10px]" style={{ color: 'var(--mut)' }}>
              24-Hour Telemetry · Chainlink CRE Sync · 0G Galileo (16602)
            </span>
            <p className="font-mono text-xs mt-1 text-neutral-500 break-all">
              Root: {snapshot.snapshotRoot || '0x4b7c12f890adcb4567890123456789abcdef1234567890abcdef1234567890ab'}
            </p>
          </div>
        </div>

        <div style={{ padding: '36px 32px', background: 'var(--soft)' }}>
          <div className="mono" style={{ marginBottom: '16px' }}>
            Fig. 01 · Capital released by stage
          </div>
          <svg
            viewBox="0 0 520 340"
            width="100%"
            role="img"
            aria-label="Four ascending steps showing upfront capital released at each stage: 20, 40, 70 and 100 percent"
          >
            <path
              d="M0 300H520M0 260H520M0 220H520M0 180H520M0 140H520M0 100H520M0 60H520M0 20H520M40 0V340M120 0V340M200 0V340M280 0V340M360 0V340M440 0V340"
              stroke="#C4C0D0"
              strokeWidth="0.5"
              fill="none"
            />
            <g stroke="#14101F" strokeWidth="0.8">
              <rect x="40" y="240" width="100" height="60" fill="#F7F3FF" />
              <rect x="160" y="190" width="100" height="110" fill="#EDE4FF" />
              <rect x="280" y="120" width="100" height="180" fill="#A78BFA" />
              <rect x="400" y="40" width="100" height="260" fill="#6D28D9" />
            </g>
            <path
              d="M90 228L210 178L330 108L450 28"
              fill="none"
              stroke="#14101F"
              strokeDasharray="3 3"
              strokeWidth="0.8"
            />
            <g fill="#fff" stroke="#14101F" strokeWidth="0.8">
              <circle cx="90" cy="228" r="4" />
              <circle cx="210" cy="178" r="4" />
              <circle cx="330" cy="108" r="4" />
              <circle cx="450" cy="28" r="4" />
            </g>
            <g fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#14101F">
              <text x="52" y="262">20%</text>
              <text x="172" y="212">40%</text>
              <text x="292" y="142">70%</text>
              <text x="412" y="62" fill="#fff">EXIT</text>
              <text x="40" y="322" fill="#5E5A6B">S0 GENESIS</text>
              <text x="160" y="322" fill="#5E5A6B">S1 PRIVATE</text>
              <text x="280" y="322" fill="#5E5A6B">S2 RESIST</text>
              <text x="400" y="322" fill="#5E5A6B">S3 SOVEREIGN</text>
            </g>
          </svg>
        </div>
      </section>

      {/* Aggregate Indicators */}
      <section className="grid-cells c4 mk" style={{ marginTop: '24px' }}>
        <div>
          <div className="mono">Launching today</div>
          <div className="d text-3xl mt-1">6</div>
        </div>
        <div>
          <div className="mono">In vaults</div>
          <div className="d text-3xl mt-1">$158k</div>
        </div>
        <div>
          <div className="mono">Verified MRR</div>
          <div className="d text-3xl mt-1">$24.6k</div>
        </div>
        <div>
          <div className="mono">Graduated</div>
          <div className="d text-3xl mt-1">1</div>
        </div>
      </section>

      {/* Product Hunt Style Explorer Bar */}
      <div id="launches" className="mt-12 pt-6 border-t" style={{ borderColor: 'var(--line)' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="d text-3xl">Today’s Sovereign Launches</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--mut)' }}>
              Explore, upvote, and inspect software modules with live 0G Storage proofs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="mono text-xs">Sort by:</span>
            <select
              className="h-9 px-3 border border-neutral-300 rounded-sm font-mono text-xs bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="featured">Featured / Default</option>
              <option value="vault">Largest Vault ($)</option>
              <option value="mrr">Verified MRR ($)</option>
              <option value="score">CROPS Score</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`chip cursor-pointer transition ${
                selectedCategory === cat ? 'p' : 'hover:bg-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Hunt Style Launch Stream */}
      <div className="space-y-3 mt-4">
        {filteredProducts.map((product, idx) => {
          const initial = product.name[0];
          const crops = product.cropsMet;
          const currentUpvotes = upvotes[product.slug] ?? product.backers;
          const isVoted = upvotedState[product.slug];

          return (
            <div
              key={product.slug}
              className="box mk flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-400 transition"
              style={{ padding: '20px 24px' }}
            >
              <div className="flex items-start md:items-center gap-4 flex-1">
                {/* Product Rank */}
                <span className="mono text-lg font-bold text-neutral-300 w-8 flex-none">
                  {idx < 9 ? `0${idx + 1}` : idx + 1}
                </span>

                {/* Product Thumbnail Image */}
                <div
                  className="w-14 h-14 flex-none border overflow-hidden rounded-sm bg-neutral-100 relative"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/${product.slug}`}
                      className="d text-xl hover:text-purple-700 transition"
                    >
                      {product.name}
                    </Link>
                    <span className="chip text-[10px]">{product.category}</span>
                    <span className="chip p text-[10px]">Stage {product.stage}/3</span>
                    <div className="cr scale-90">
                      <b className={crops.c ? 'on' : ''}>C</b>
                      <b className={crops.r ? 'on' : ''}>R</b>
                      <b className={crops.o ? 'on' : ''}>O</b>
                      <b className={crops.p ? 'on' : ''}>P</b>
                      <b className={crops.s ? 'on' : ''}>S</b>
                    </div>
                  </div>
                  <p className="text-sm mt-1 text-neutral-600 truncate max-w-xl">
                    {product.tagline}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs font-mono" style={{ color: 'var(--mut)' }}>
                    <span>MRR: <b className="text-neutral-800">{product.mrr}</b></span>
                    <span>Vault: <b className="text-neutral-800">{product.vault}</b></span>
                    <span>Uptime: <b className="text-purple-700">{product.heartbeatUptime}</b></span>
                    <span>License: <b>{product.license}</b></span>
                  </div>
                </div>
              </div>

              {/* Actions & Upvote */}
              <div className="flex items-center gap-2.5 flex-none justify-end">
                <button
                  onClick={() => setSandboxProduct(product)}
                  className="btn text-xs font-medium"
                  style={{ height: '42px', padding: '0 12px' }}
                  title="Run zero-server local demo in browser"
                >
                  ⚡ Sandbox
                </button>
                <button
                  onClick={() => setPreviewProduct(product)}
                  className="btn text-xs"
                  style={{ height: '42px', padding: '0 13px' }}
                >
                  Quick view
                </button>
                <Link
                  href={`/${product.slug}`}
                  className="btn text-xs font-semibold"
                  style={{ height: '42px', padding: '0 15px' }}
                >
                  Inspect
                </Link>

                {/* Product Hunt Upvote Button */}
                <button
                  onClick={(e) => handleUpvote(product.slug, e)}
                  className={`flex flex-col items-center justify-center w-14 h-14 border rounded-sm transition cursor-pointer ${
                    isVoted
                      ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold shadow-sm'
                      : 'border-neutral-300 hover:border-neutral-400 bg-white'
                  }`}
                  title="Upvote / Back this sovereign software"
                >
                  <span className="text-xs leading-none">▲</span>
                  <span className="font-mono text-xs mt-1">{currentUpvotes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graduation Explainer Modal */}
      {activeModal === 'graduation' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="box mk max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white p-6 sm:p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="mono">Protocol Mechanics</span>
                <h3 className="d text-2xl mt-1">How Software Graduation Works</h3>
              </div>
              <button
                className="btn text-xs"
                style={{ height: '32px', padding: '0 10px' }}
                onClick={() => setActiveModal(null)}
              >
                Close ✕
              </button>
            </div>

            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--mut)' }}>
              Unlike token bonding curves that graduate on speculative volume, Stillworks software graduates through proven uptime epochs, transparent passports, and reproducible build checks.
            </p>

            <div className="space-y-4 font-mono text-xs">
              <div className="border p-4 bg-purple-50/30" style={{ borderColor: 'var(--line)' }}>
                <b className="text-purple-800 text-sm">Stage 0 · Genesis (20% Upfront Release)</b>
                <p className="text-neutral-600 mt-1">
                  Product registers with 0G Storage passport root and heartbeat key. 30% ops reserve sustains gas; 50% locked in escrow.
                </p>
              </div>
              <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
                <b className="text-purple-800 text-sm">Stage 1 · Private (40% Upfront Release)</b>
                <p className="text-neutral-600 mt-1">
                  Hardware-enforced TEE AI inference verified. User data strictly in local IndexedDB. 3 consecutive attested periods.
                </p>
              </div>
              <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
                <b className="text-purple-800 text-sm">Stage 2 · Resist (70% Upfront Release)</b>
                <p className="text-neutral-600 mt-1">
                  Automated killswitch verified. Subscriber walkaway bundles successfully run offline via docker compose in test sandboxes.
                </p>
              </div>
              <div className="border p-4 bg-purple-50" style={{ borderColor: '#6D28D9' }}>
                <b className="text-purple-900 text-sm">Stage 3 · Sovereign Exit (100% Release)</b>
                <p className="text-neutral-700 mt-1">
                  Complete independence from founder. Software can run perpetually across decentralized VPS networks without single-point failure.
                </p>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button className="btn p" onClick={() => setActiveModal(null)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Drawer Modal */}
      {previewProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="box mk max-w-xl w-full bg-white p-6 sm:p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 grid place-items-center font-bold text-lg border"
                  style={{ background: 'var(--pt)', borderColor: 'var(--line)', color: 'var(--p)' }}
                >
                  {previewProduct.name[0]}
                </span>
                <div>
                  <h3 className="d text-2xl">{previewProduct.name}</h3>
                  <span className="mono text-xs">{previewProduct.category} · Stage {previewProduct.stage}</span>
                </div>
              </div>
              <button
                className="btn text-xs"
                style={{ height: '32px', padding: '0 10px' }}
                onClick={() => setPreviewProduct(null)}
              >
                ✕
              </button>
            </div>

            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--mut)' }}>
              {previewProduct.pitch}
            </p>

            <div className="border divide-y text-xs font-mono mb-6" style={{ borderColor: 'var(--line)' }}>
              <div className="flex justify-between p-2.5">
                <span className="text-neutral-500">License:</span>
                <b>{previewProduct.license}</b>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-neutral-500">Repository:</span>
                <a href={previewProduct.repoUrl} target="_blank" rel="noreferrer" className="text-purple-700 underline truncate max-w-xs">
                  {previewProduct.repoUrl}
                </a>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-neutral-500">Uptime:</span>
                <b>{previewProduct.heartbeatUptime}</b>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-neutral-500">Stewardship Split:</span>
                <b>30% Ops / 20% Cont / 50% 1-Wk Lock</b>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="btn text-xs font-semibold"
                style={{ height: '42px', padding: '0 14px' }}
                onClick={() => {
                  const p = previewProduct;
                  setPreviewProduct(null);
                  setSandboxProduct(p);
                }}
              >
                ⚡ Try in Sandbox
              </button>
              <Link
                href={`/${previewProduct.slug}`}
                className="btn p flex-1 text-center text-xs font-semibold"
                style={{ height: '42px' }}
                onClick={() => setPreviewProduct(null)}
              >
                Go to Product Page
              </Link>
              <button className="btn text-xs" style={{ height: '42px' }} onClick={() => setPreviewProduct(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sandbox Modal */}
      {sandboxProduct && (
        <SandboxModal
          product={sandboxProduct}
          onClose={() => setSandboxProduct(null)}
        />
      )}
    </div>
  );
}
