'use client';

import { useState } from 'react';
import type { Product } from '@/data/products';

interface ReviewDrawerProps {
  product: Product;
  onClose: () => void;
}

export function ReviewDrawer({ product, onClose }: ReviewDrawerProps) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: '0x81B2…39Ac',
      badge: 'CROPS Auditor',
      date: 'Today at 09:14 UTC',
      comment:
        'Audited the walkaway export schema. Dumped browser IndexedDB tables into JSON; verified 0 egress requests in DevTools. The 20% contingency clause in StewardshipEscrow correctly reflects in contract state.',
      score: 5,
    },
    {
      id: 2,
      author: '0x3F91…82Ce',
      badge: 'Backer (Pro Tier)',
      date: 'Yesterday at 18:40 UTC',
      comment:
        'Tested the daily inference quota on 0G preview wallet. Local sanitization is instantaneous. Zero telemetry back to any central cloud.',
      score: 5,
    },
    {
      id: 3,
      author: '0x14D8…900F',
      badge: 'Developer Steward',
      date: 'Nov 4, 2026',
      comment:
        'Chainlink CRE sync verified with Galileo DON. Heartbeat posted every 24 hours. Contingency withdrawal test succeeded in sandbox.',
      score: 5,
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [userSubmitted, setUserSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setReviews([
      {
        id: Date.now(),
        author: '0x237e…21c7 (You)',
        badge: 'Verified Signer',
        date: 'Just now',
        comment: newComment,
        score: 5,
      },
      ...reviews,
    ]);
    setNewComment('');
    setUserSubmitted(true);
    setTimeout(() => setUserSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-end">
      <div className="w-full max-w-lg bg-white h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between border-l" style={{ borderColor: 'var(--line)' }}>
        <div>
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b" style={{ borderColor: 'var(--line)' }}>
            <div>
              <span className="mono text-purple-700">Decentralized Peer Review</span>
              <h3 className="d text-2xl mt-1">{product.name} Reviews & Audits</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--mut)' }}>
                Verifiable community attestations on 0G Galileo.
              </p>
            </div>
            <button
              className="btn text-xs"
              style={{ height: '32px', padding: '0 10px' }}
              onClick={onClose}
            >
              ✕ Close
            </button>
          </div>

          {/* CROPS Score Summary Card */}
          <div className="p-4 bg-purple-50/50 border mb-6" style={{ borderColor: 'var(--line)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="mono text-[10px]">Sovereignty Rating</span>
              <b className="text-purple-700 font-mono text-sm">{product.score} / 100</b>
            </div>
            <div className="flex items-center gap-2">
              <div className="cr scale-95">
                <b className={product.cropsMet.c ? 'on' : ''}>C</b>
                <b className={product.cropsMet.r ? 'on' : ''}>R</b>
                <b className={product.cropsMet.o ? 'on' : ''}>O</b>
                <b className={product.cropsMet.p ? 'on' : ''}>P</b>
                <b className={product.cropsMet.s ? 'on' : ''}>S</b>
              </div>
              <span className="text-xs text-neutral-600 font-mono">
                5 of 5 pillars attested
              </span>
            </div>
          </div>

          {/* Review Submission Form */}
          <form onSubmit={handleSubmit} className="mb-6 space-y-2">
            <label className="mono block text-[10px]">Post Cryptographic Review / Audit:</label>
            <textarea
              rows={2}
              className="w-full p-2.5 border text-xs font-mono rounded-sm bg-neutral-50"
              placeholder="Attest to local-first privacy, escrow health, or bugs..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-neutral-400 font-mono">
                {userSubmitted ? '✓ Review posted onchain!' : 'Signs with active wallet'}
              </span>
              <button
                type="submit"
                className="btn p text-xs font-semibold"
                style={{ height: '32px', padding: '0 14px' }}
              >
                Sign & Post Review
              </button>
            </div>
          </form>

          {/* List of Reviews */}
          <div className="space-y-4">
            <span className="mono text-[10px] block">Verified Attestations ({reviews.length})</span>
            {reviews.map((rev) => (
              <div key={rev.id} className="p-3.5 border bg-white space-y-1.5" style={{ borderColor: 'var(--line)' }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-800">{rev.author}</span>
                    <span className="chip p text-[9px]">{rev.badge}</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">{rev.date}</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--line)' }}>
          <span className="text-xs font-mono text-neutral-400">0G GalileoDON #16602</span>
          <button className="btn text-xs" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
