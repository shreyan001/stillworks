'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { products as initialProducts, type Product } from '@/data/products';
import { SandboxModal } from '@/components/SandboxModal';
import { ReviewDrawer } from '@/components/ReviewDrawer';

export default function ExplorePage() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'upvotes' | 'score' | 'vault' | 'mrr'>('upvotes');
  const [upvotes, setUpvotes] = useState<Record<string, number>>({});
  const [upvotedState, setUpvotedState] = useState<Record<string, boolean>>({});
  const [redisConnected, setRedisConnected] = useState<boolean>(true);

  // Modals state
  const [sandboxProduct, setSandboxProduct] = useState<Product | null>(null);
  const [reviewProduct, setReviewProduct] = useState<Product | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Quick submission form
  const [submitForm, setSubmitForm] = useState({
    name: '',
    tagline: '',
    category: 'Sanitizer & Privacy',
    repoUrl: '',
    license: 'MIT',
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch from Upstash Redis on mount
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.products) && data.products.length > 0) {
          setProductList(data.products);
          setRedisConnected(true);
        }
      })
      .catch((err) => {
        console.error('Failed to load from Redis:', err);
        setRedisConnected(false);
      });
  }, []);

  // Initialize upvotes from local storage
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
    const current = upvotes[slug] ?? 0;
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

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitForm.name || !submitForm.tagline) return;

    try {
      const slug = submitForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: submitForm.name,
          slug,
          tagline: submitForm.tagline,
          category: submitForm.category,
          repoUrl: submitForm.repoUrl,
          license: submitForm.license,
        }),
      });

      if (!res.ok) throw new Error('Redis submission failed');
      const data = await res.json();

      setProductList([data.product, ...productList]);
      setUpvotes((prev) => ({ ...prev, [slug]: 1 }));
      setUpvotedState((prev) => ({ ...prev, [slug]: true }));
      setSubmitSuccess(true);

      setTimeout(() => {
        setSubmitSuccess(false);
        setShowSubmitModal(false);
        setSubmitForm({ name: '', tagline: '', category: 'Sanitizer & Privacy', repoUrl: '', license: 'MIT' });
      }, 1600);
    } catch (err: any) {
      console.error(err);
    }
  };

  const tags = ['All', 'Sanitizer & Privacy', 'Scheduler & Social', 'Private AI', 'Calendar & Scheduling', 'Knowledge Base', 'Newsletter & Email', 'Developer Tools', 'Audio & Media', 'Infrastructure & Security'];

  const filtered = productList
    .filter((p) => {
      const matchesTag =
        selectedTag === 'All' ||
        p.category.toLowerCase().includes(selectedTag.toLowerCase()) ||
        p.tagline.toLowerCase().includes(selectedTag.toLowerCase());
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'upvotes') {
        const uA = upvotes[a.slug] ?? a.backers;
        const uB = upvotes[b.slug] ?? b.backers;
        return uB - uA;
      }
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
      return 0;
    });

  const todayLaunches = filtered.slice(0, 4);
  const earlierLaunches = filtered.slice(4);
  const featuredProduct = filtered[0] || initialProducts[0];

  return (
    <div className="wrap">
      {/* Modals */}
      {sandboxProduct && <SandboxModal product={sandboxProduct} onClose={() => setSandboxProduct(null)} />}
      {reviewProduct && <ReviewDrawer product={reviewProduct} onClose={() => setReviewProduct(null)} />}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 pt-6 pb-4 text-xs font-mono" style={{ color: 'var(--mut)' }}>
        <Link href="/" className="hover:text-purple-700">Marketplace</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>Product Hunt for Sovereign Software</span>
      </div>

      {/* Header & Search Bar */}
      <div className="box mk">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="mono text-purple-700">0G Galileo Registry · Daily Discoveries</span>
              <span className={`chip text-[9px] ${redisConnected ? 'p font-bold' : ''}`}>
                ● Upstash Redis Live
              </span>
            </div>
            <h1 className="d text-3xl sm:text-4xl mt-1">Sovereign Software Hunt</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--mut)' }}>
              Discover, test, and back open-source software built with 0G Storage passports, TEE compute, and StillworksHub escrow.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="btn p text-xs font-semibold"
              style={{ height: '42px', padding: '0 18px' }}
            >
              + Submit Launch
            </button>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 pt-5 border-t" style={{ borderColor: 'var(--line)' }}>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`chip cursor-pointer transition ${selectedTag === tag ? 'p font-bold' : 'hover:bg-neutral-100'}`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search software..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 px-3 border border-neutral-300 rounded-sm font-mono text-xs w-48 sm:w-56"
            />
            <select
              className="h-9 px-3 border border-neutral-300 rounded-sm font-mono text-xs bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="upvotes">Top Upvoted</option>
              <option value="score">Sovereignty Score</option>
              <option value="vault">Largest Vault</option>
              <option value="mrr">Highest MRR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Spotlight Card */}
      {featuredProduct && (
        <div className="box mk mt-6" style={{ background: 'var(--pt)', borderColor: '#CBB5F7' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className="w-20 h-20 flex-none border overflow-hidden rounded-sm bg-neutral-100 relative"
                style={{ borderColor: 'var(--line)' }}
              >
                <img
                  src={featuredProduct.imageUrl}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="chip p text-[10px] font-bold">#1 SPOTLIGHT TODAY</span>
                  <span className="mono text-[10px] text-purple-700">Stage {featuredProduct.stage}/3</span>
                </div>
                <h2 className="d text-2xl mt-1">
                  <Link href={`/${featuredProduct.slug}`} className="hover:text-purple-700 transition">
                    {featuredProduct.name}
                  </Link>
                </h2>
                <p className="text-sm mt-1 text-neutral-700 max-w-xl">
                  {featuredProduct.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-mono" style={{ color: 'var(--mut)' }}>
                  <span>MRR: <b className="text-neutral-900">{featuredProduct.mrr}</b></span>
                  <span>Vault: <b className="text-neutral-900">{featuredProduct.vault}</b></span>
                  <span>Score: <b className="text-purple-700">{featuredProduct.score}/100</b></span>
                  <span>Uptime: <b>{featuredProduct.heartbeatUptime}</b></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end flex-none">
              <button
                className="btn text-xs font-semibold"
                style={{ height: '44px', padding: '0 16px' }}
                onClick={() => setSandboxProduct(featuredProduct)}
              >
                ⚡ Try Sandbox
              </button>
              <Link
                href={`/${featuredProduct.slug}`}
                className="btn p text-xs font-semibold"
                style={{ height: '44px', padding: '0 18px' }}
              >
                Back with Escrow
              </Link>
              <button
                onClick={(e) => handleUpvote(featuredProduct.slug, e)}
                className={`flex flex-col items-center justify-center w-14 h-14 border rounded-sm transition cursor-pointer ${
                  upvotedState[featuredProduct.slug]
                    ? 'border-purple-600 bg-purple-100/80 text-purple-800 font-bold'
                    : 'border-neutral-300 hover:border-neutral-400 bg-white'
                }`}
              >
                <span className="text-xs leading-none">▲</span>
                <span className="font-mono text-xs mt-1">{upvotes[featuredProduct.slug] ?? featuredProduct.backers}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Launches Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
          <h2 className="d text-xl">Today · November 6, 2026</h2>
          <span className="mono text-xs">{todayLaunches.length} Products Launching</span>
        </div>

        <div className="space-y-3 mt-4">
          {todayLaunches.map((product, idx) => {
            const currentVotes = upvotes[product.slug] ?? product.backers;
            const isVoted = upvotedState[product.slug];
            const crops = product.cropsMet;

            return (
              <div
                key={product.slug}
                className="box mk flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-400 transition"
                style={{ padding: '20px 24px' }}
              >
                {/* Left Section: Image & Details */}
                <div className="flex items-start md:items-center gap-4 flex-1">
                  <span className="mono text-lg font-bold text-neutral-300 w-6 flex-none">
                    0{idx + 1}
                  </span>

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

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/${product.slug}`} className="d text-xl hover:text-purple-700 transition">
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
                    <p className="text-sm mt-1 text-neutral-600 line-clamp-1">
                      {product.tagline}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono" style={{ color: 'var(--mut)' }}>
                      <span>MRR: <b className="text-neutral-800">{product.mrr}</b></span>
                      <span>Vault: <b className="text-neutral-800">{product.vault}</b></span>
                      <span>Uptime: <b className="text-purple-700">{product.heartbeatUptime}</b></span>
                      <span>License: <b>{product.license}</b></span>
                    </div>
                  </div>
                </div>

                {/* Right Section: Buttons & Upvote */}
                <div className="flex items-center gap-2.5 flex-none justify-end">
                  <button
                    onClick={() => setSandboxProduct(product)}
                    className="btn text-xs font-medium"
                    style={{ height: '42px', padding: '0 13px' }}
                    title="Run zero-server local demo in browser"
                  >
                    ⚡ Sandbox
                  </button>
                  <button
                    onClick={() => setReviewProduct(product)}
                    className="btn text-xs font-medium"
                    style={{ height: '42px', padding: '0 12px' }}
                    title="View verified community reviews & audits"
                  >
                    💬 Reviews
                  </button>
                  <Link
                    href={`/${product.slug}`}
                    className="btn text-xs font-semibold"
                    style={{ height: '42px', padding: '0 15px' }}
                  >
                    Inspect
                  </Link>

                  <button
                    onClick={(e) => handleUpvote(product.slug, e)}
                    className={`flex flex-col items-center justify-center w-14 h-14 border rounded-sm transition cursor-pointer ${
                      isVoted
                        ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold'
                        : 'border-neutral-300 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    <span className="text-xs leading-none">▲</span>
                    <span className="font-mono text-xs mt-1">{currentVotes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Earlier Launches / Verified Graduates Section */}
      {earlierLaunches.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
            <h2 className="d text-xl">Past Cycles · Verified Sovereign Graduates</h2>
            <span className="mono text-xs">{earlierLaunches.length} Active Modules</span>
          </div>

          <div className="space-y-3 mt-4">
            {earlierLaunches.map((product, idx) => {
              const currentVotes = upvotes[product.slug] ?? product.backers;
              const isVoted = upvotedState[product.slug];
              const crops = product.cropsMet;

              return (
                <div
                  key={product.slug}
                  className="box mk flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-400 transition"
                  style={{ padding: '20px 24px' }}
                >
                  <div className="flex items-start md:items-center gap-4 flex-1">
                    <span className="mono text-lg font-bold text-neutral-300 w-6 flex-none">
                      0{idx + 5}
                    </span>

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

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/${product.slug}`} className="d text-xl hover:text-purple-700 transition">
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
                      <p className="text-sm mt-1 text-neutral-600 line-clamp-1">
                        {product.tagline}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono" style={{ color: 'var(--mut)' }}>
                        <span>MRR: <b className="text-neutral-800">{product.mrr}</b></span>
                        <span>Vault: <b className="text-neutral-800">{product.vault}</b></span>
                        <span>Uptime: <b className="text-purple-700">{product.heartbeatUptime}</b></span>
                        <span>License: <b>{product.license}</b></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-none justify-end">
                    <button
                      onClick={() => setSandboxProduct(product)}
                      className="btn text-xs font-medium"
                      style={{ height: '42px', padding: '0 13px' }}
                    >
                      ⚡ Sandbox
                    </button>
                    <button
                      onClick={() => setReviewProduct(product)}
                      className="btn text-xs font-medium"
                      style={{ height: '42px', padding: '0 12px' }}
                    >
                      💬 Reviews
                    </button>
                    <Link
                      href={`/${product.slug}`}
                      className="btn text-xs font-semibold"
                      style={{ height: '42px', padding: '0 15px' }}
                    >
                      Inspect
                    </Link>

                    <button
                      onClick={(e) => handleUpvote(product.slug, e)}
                      className={`flex flex-col items-center justify-center w-14 h-14 border rounded-sm transition cursor-pointer ${
                        isVoted
                          ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold'
                          : 'border-neutral-300 hover:border-neutral-400 bg-white'
                      }`}
                    >
                      <span className="text-xs leading-none">▲</span>
                      <span className="font-mono text-xs mt-1">{currentVotes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Submit Sovereign Launch Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="box mk max-w-lg w-full bg-white p-6 sm:p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="mono text-purple-700">Quick Builder Submission</span>
                <h3 className="d text-2xl mt-1">Submit Sovereign Launch</h3>
              </div>
              <button
                className="btn text-xs"
                style={{ height: '32px', padding: '0 10px' }}
                onClick={() => setShowSubmitModal(false)}
              >
                ✕ Close
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-sm font-mono text-xs">
                <b>✓ Launch Registered in Upstash Redis & Stage 0 Genesis!</b>
                <p className="mt-1">
                  Your project has been injected into the live discovery board with 0G Storage passport scaffolding.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="mono block text-[10px] mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ironclad DB"
                    className="w-full h-10 px-3 border border-neutral-300 rounded-sm font-sans text-sm"
                    value={submitForm.name}
                    onChange={(e) => setSubmitForm({ ...submitForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mono block text-[10px] mb-1">Tagline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Verifiable client-side encrypted vector store"
                    className="w-full h-10 px-3 border border-neutral-300 rounded-sm font-sans text-sm"
                    value={submitForm.tagline}
                    onChange={(e) => setSubmitForm({ ...submitForm, tagline: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mono block text-[10px] mb-1">Category</label>
                    <select
                      className="w-full h-10 px-3 border border-neutral-300 rounded-sm bg-white"
                      value={submitForm.category}
                      onChange={(e) => setSubmitForm({ ...submitForm, category: e.target.value })}
                    >
                      <option value="Sanitizer & Privacy">Sanitizer & Privacy</option>
                      <option value="Scheduler & Social">Scheduler & Social</option>
                      <option value="Private AI">Private AI</option>
                      <option value="Calendar & Scheduling">Calendar & Scheduling</option>
                      <option value="Knowledge Base">Knowledge Base</option>
                      <option value="Newsletter & Email">Newsletter & Email</option>
                      <option value="Developer Tools">Developer Tools</option>
                      <option value="Audio & Media">Audio & Media</option>
                      <option value="Infrastructure & Security">Infrastructure & Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="mono block text-[10px] mb-1">License</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 border border-neutral-300 rounded-sm"
                      value={submitForm.license}
                      onChange={(e) => setSubmitForm({ ...submitForm, license: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="mono block text-[10px] mb-1">GitHub / Codebase Repository</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    className="w-full h-10 px-3 border border-neutral-300 rounded-sm"
                    value={submitForm.repoUrl}
                    onChange={(e) => setSubmitForm({ ...submitForm, repoUrl: e.target.value })}
                  />
                </div>

                <div className="p-3 bg-purple-50 border text-[11px]" style={{ borderColor: 'var(--line)' }}>
                  <b className="text-purple-800 block mb-0.5">Enforced Stewardship Protocol:</b>
                  <span>30% Operations · 20% Contingency · 47.5% 1-Week Review · 2.5% Hub Upkeep</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="btn p flex-1 font-semibold text-center"
                    style={{ height: '42px' }}
                  >
                    Submit Sovereign Launch
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{ height: '42px' }}
                    onClick={() => setShowSubmitModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
