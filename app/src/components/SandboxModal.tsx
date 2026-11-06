'use client';

import { useState } from 'react';
import type { Product } from '@/data/products';

interface SandboxModalProps {
  product: Product;
  onClose: () => void;
}

export function SandboxModal({ product, onClose }: SandboxModalProps) {
  // Common states
  const [copied, setCopied] = useState(false);

  // Clean state
  const [cleanInput, setCleanInput] = useState(
    'Bug report from user dev@stillworks.com (IP: 198.51.100.42): OpenAI API key sk-proj-910284719284 failed at 14:02 UTC with bearer token eyJhbGciOiJIUzI1Ni...'
  );
  const [cleanOutput, setCleanOutput] = useState<string | null>(null);
  const [redactionStats, setRedactionStats] = useState<{ keys: number; ips: number; emails: number } | null>(null);

  // Gleam state
  const [gleamBudget, setGleamBudget] = useState(1.271);
  const [gleamText, setGleamText] = useState(
    'Sovereign software graduates from escrow: 30% ops, 20% contingency, 50% 1-week review lock. Zero central servers. #0G #Web3'
  );
  const [gleamScheduled, setGleamScheduled] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'farcaster' | 'lens' | 'x'>('farcaster');

  // Venus state
  const [venusPrompt, setVenusPrompt] = useState(
    'Generate architectural summary of 0G Storage Turbo Layer and TEE verification for local-first apps.'
  );
  const [venusResponse, setVenusResponse] = useState<string | null>(null);
  const [venusLoading, setVenusLoading] = useState(false);

  // Handle Clean execution
  const handleCleanSanitize = () => {
    let text = cleanInput;
    let keys = 0;
    let ips = 0;
    let emails = 0;

    // Redact keys
    text = text.replace(/sk-[a-zA-Z0-9_\-]+/g, () => {
      keys++;
      return '[REDACTED_API_KEY]';
    });
    text = text.replace(/eyJ[a-zA-Z0-9_\-\.]+/g, () => {
      keys++;
      return '[REDACTED_JWT_TOKEN]';
    });

    // Redact IPs
    text = text.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, () => {
      ips++;
      return '[REDACTED_IP_ADDR]';
    });

    // Redact Emails
    text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, () => {
      emails++;
      return '[REDACTED_USER_EMAIL]';
    });

    setCleanOutput(text);
    setRedactionStats({ keys, ips, emails });
  };

  // Handle Gleam post schedule
  const handleGleamSchedule = () => {
    if (gleamBudget >= 0.12) {
      setGleamBudget((prev) => Math.max(0, +(prev - 0.12).toFixed(3)));
      setGleamScheduled(true);
    }
  };

  // Handle Venus private inference
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

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="box mk max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white p-6 sm:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span
              className="w-10 h-10 grid place-items-center font-bold text-lg border"
              style={{ background: 'var(--pt)', borderColor: 'var(--line)', color: 'var(--p)' }}
            >
              {product.name[0]}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="d text-2xl">{product.name}</h3>
                <span className="chip p text-[10px]">Interactive Sandbox</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--mut)' }}>
                Zero-server local runtime preview · EF CROPS Compliant
              </p>
            </div>
          </div>
          <button
            className="btn text-xs"
            style={{ height: '32px', padding: '0 10px' }}
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>

        {/* Product-Specific Interactive Sandbox */}
        {product.slug === 'clean' && (
          <div className="space-y-4">
            <div className="p-3 bg-purple-50/40 border text-xs font-mono space-y-1" style={{ borderColor: 'var(--line)' }}>
              <div className="flex justify-between">
                <span className="text-neutral-500">Execution Mode:</span>
                <b className="text-purple-800">100% Client-Side Web Worker</b>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Network Egress:</span>
                <b className="text-emerald-700">0 bytes (Isolated Browser Memory)</b>
              </div>
            </div>

            <div>
              <label className="mono block text-[10px] mb-1">Input Text (Contains PII & API Secrets):</label>
              <textarea
                rows={3}
                className="w-full p-2.5 border text-xs font-mono rounded-sm bg-neutral-50"
                value={cleanInput}
                onChange={(e) => setCleanInput(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="btn text-xs"
                style={{ height: '32px', padding: '0 12px' }}
                onClick={() =>
                  setCleanInput(
                    'Customer John Doe (john@agency.co, IP 192.168.0.10) submitted secret token sk-live_abcdef1234567890'
                  )
                }
              >
                Sample: User + Secret
              </button>
              <button
                className="btn p text-xs font-semibold"
                style={{ height: '32px', padding: '0 16px' }}
                onClick={handleCleanSanitize}
              >
                ⚡ Scrub PII Local-First
              </button>
            </div>

            {cleanOutput && (
              <div className="p-4 bg-emerald-50/50 border border-emerald-300 rounded-sm font-mono text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-emerald-200">
                  <b className="text-emerald-900">Sanitized Output (Safe to Transmit):</b>
                  <span className="text-[11px] text-emerald-800">
                    Redacted: {redactionStats?.keys} keys, {redactionStats?.ips} IPs, {redactionStats?.emails} emails
                  </span>
                </div>
                <div className="p-2 bg-white border border-emerald-200 rounded text-neutral-800 break-all leading-relaxed">
                  {cleanOutput}
                </div>
                <div className="flex justify-between items-center pt-1 text-[11px] text-neutral-500">
                  <span>0G Root: 0x4b7c12f8…90ab</span>
                  <button
                    className="btn text-[11px]"
                    style={{ height: '28px', padding: '0 10px' }}
                    onClick={() => {
                      navigator.clipboard.writeText(cleanOutput);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? '✓ Copied' : 'Copy Clean Output'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {product.slug === 'gleam' && (
          <div className="space-y-4">
            <div className="p-3 bg-purple-50/40 border text-xs font-mono space-y-1.5" style={{ borderColor: 'var(--line)' }}>
              <div className="flex justify-between">
                <span className="text-neutral-500">0G AI Daily Preview Allowance:</span>
                <b className="text-purple-800">{gleamBudget} iAI remaining</b>
              </div>
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full transition-all"
                  style={{ width: `${(gleamBudget / 1.271) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Free Tier Quota</span>
                <span>Refreshes in 14h 22m</span>
              </div>
            </div>

            <div>
              <label className="mono block text-[10px] mb-1">Target Platform:</label>
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
            </div>

            <div>
              <label className="mono block text-[10px] mb-1">Schedule Post Draft:</label>
              <textarea
                rows={3}
                className="w-full p-2.5 border text-xs font-mono rounded-sm bg-neutral-50"
                value={gleamText}
                onChange={(e) => setGleamText(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button
                className="btn text-xs"
                style={{ height: '34px', padding: '0 12px' }}
                onClick={() => {
                  setGleamText((prev) => prev + ' [Optimized with 0G TEE Model]');
                  setGleamBudget((prev) => Math.max(0, +(prev - 0.05).toFixed(3)));
                }}
              >
                ✨ AI Polish (-0.05 iAI)
              </button>
              <button
                className="btn p text-xs flex-1 font-semibold"
                style={{ height: '34px' }}
                onClick={handleGleamSchedule}
              >
                Schedule Cryptographically (-0.12 iAI)
              </button>
            </div>

            {gleamScheduled && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-sm font-mono text-xs">
                <b>✓ Post Encrypted & Scheduled!</b>
                <p className="mt-1 text-[11px] text-neutral-600">
                  Signed with local browser key · Stored in local IndexedDB · Will dispatch to {selectedPlatform} at target timestamp.
                </p>
              </div>
            )}
          </div>
        )}

        {product.slug === 'venus' && (
          <div className="space-y-4">
            <div className="p-3 bg-neutral-50 border text-xs font-mono space-y-1" style={{ borderColor: 'var(--line)' }}>
              <div className="flex justify-between">
                <span className="text-neutral-500">TEE Hardware:</span>
                <b>Intel TDX Enclave (Sealed Memory)</b>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">0G Galileo Attestation:</span>
                <b className="text-purple-700">0x7FA938...1496 (Verified)</b>
              </div>
            </div>

            <div>
              <label className="mono block text-[10px] mb-1">Private Inference Prompt:</label>
              <input
                type="text"
                className="w-full h-10 px-3 border text-xs font-mono rounded-sm bg-neutral-50"
                value={venusPrompt}
                onChange={(e) => setVenusPrompt(e.target.value)}
              />
            </div>

            <button
              className="btn p w-full text-xs font-semibold"
              style={{ height: '36px' }}
              onClick={handleVenusInference}
              disabled={venusLoading}
            >
              {venusLoading ? 'Executing inside Hardware Enclave...' : '⚡ Run Private TEE Inference'}
            </button>

            {venusResponse && (
              <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-sm font-mono text-xs space-y-2">
                <b className="text-purple-900 block border-b border-purple-200 pb-1">
                  Enclave Attested Response:
                </b>
                <pre className="whitespace-pre-wrap text-[11px] text-neutral-800 leading-relaxed font-mono">
                  {venusResponse}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Fallback for other products */}
        {!['clean', 'gleam', 'venus'].includes(product.slug) && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 bg-neutral-50 border space-y-2" style={{ borderColor: 'var(--line)' }}>
              <div className="flex justify-between">
                <span className="text-neutral-500">Product:</span>
                <b>{product.name}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">License:</span>
                <b>{product.license}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Storage Passport:</span>
                <b className="text-purple-700">0G Storage Turbo Layer</b>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Escrow Vault:</span>
                <b>{product.vault}</b>
              </div>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              This sovereign module compiles and executes locally via browser WebAssembly and local IndexedDB. All user data remains sealed on the client terminal.
            </p>
            <a
              href={product.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn p w-full text-center"
            >
              Inspect Source Code on GitHub ↗
            </a>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--line)' }}>
          <span className="text-xs font-mono text-neutral-400">
            Escrow Guard: 30% Ops · 20% Cont · 50% Lock
          </span>
          <div className="flex gap-2">
            <a href={`/${product.slug}`} className="btn p text-xs" style={{ height: '34px', padding: '0 14px' }}>
              Back {product.name}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
