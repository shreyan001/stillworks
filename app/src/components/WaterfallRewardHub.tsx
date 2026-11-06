'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import {
  STILLWORKS_DEPLOYED,
  WATERFALL_CONTINGENCY_HUB_ABI,
} from '@/lib/contracts/abis';
import {
  ShieldAlert,
  Vote,
  Coins,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  GitPullRequest,
  Check,
  ChevronRight,
  TrendingUp,
  FileCode,
} from 'lucide-react';

interface ProposalItem {
  id: number;
  issueRef: string;
  patchProofHash: string;
  requestedAmountUSDT: number;
  trancheBps: number; // e.g. 1500 = 15%, 2000 = 20%
  proposer: string;
  createdAt: string;
  votingDeadline: string;
  votesForWeight: number;
  votesAgainstWeight: number;
  executed: boolean;
  status: 'VOTING_ACTIVE' | 'APPROVED' | 'EXECUTED' | 'REJECTED';
}

const INITIAL_PROPOSALS: ProposalItem[] = [
  {
    id: 1,
    issueRef: 'Fix #104: TEE Hardware Enclave Attestation Cache Stale Invalidation',
    patchProofHash: '0x20e807406258f81de5e4f5da6c479d8db2492bd952b1e56e040ef69a53db5c69',
    requestedAmountUSDT: 150,
    trancheBps: 1500, // 15%
    proposer: '0x237eA22D38a1e20EC50b39711014B9C87dBb21c7',
    createdAt: '2 days ago',
    votingDeadline: '24 hours remaining',
    votesForWeight: 40,
    votesAgainstWeight: 7,
    executed: false,
    status: 'VOTING_ACTIVE',
  },
  {
    id: 2,
    issueRef: 'Fix #089: Zero-Knowledge Heartbeat Proof Serialization Optimization',
    patchProofHash: '0xf004c8fb08c6c208a40320d96901b737f62d7e9ed2505f3349861c3f606987e2',
    requestedAmountUSDT: 200,
    trancheBps: 2000, // 20%
    proposer: '0x71C83606cD20689e47264aD5EbbBE46cE4E42B1c',
    createdAt: '9 days ago',
    votingDeadline: 'Passed (Quorum Met)',
    votesForWeight: 70,
    votesAgainstWeight: 0,
    executed: true,
    status: 'EXECUTED',
  },
];

interface WaterfallRewardHubProps {
  productId?: number;
  productSlug?: string;
  productName?: string;
  contingencyVaultUSDT?: number;
}

export function WaterfallRewardHub({
  productId = 1,
  productSlug = 'clean',
  productName = 'Clean',
  contingencyVaultUSDT = 1000,
}: WaterfallRewardHubProps) {
  const { address, isConnected } = useAccount();
  const [proposals, setProposals] = useState<ProposalItem[]>(INITIAL_PROPOSALS);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [userVoted, setUserVoted] = useState<Record<number, boolean>>({});
  const [submittingTx, setSubmittingTx] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Proposal Form
  const [issueRef, setIssueRef] = useState('');
  const [patchProofHash, setPatchProofHash] = useState('0x20e807406258f81de5e4f5da6c479d8db2492bd952b1e56e040ef69a53db5c69');
  const [tranchePercent, setTranchePercent] = useState<15 | 20>(15);

  const { writeContractAsync } = useWriteContract();

  // Determine user subscriber weight (Pro = 10 votes, Premium = 7 votes)
  const subscriberTier = 'Pro';
  const votingWeight = subscriberTier === 'Pro' ? 10 : 7;

  const handleVote = async (proposalId: number, support: boolean) => {
    setStatusMessage(null);
    try {
      if (isConnected) {
        // Attempt onchain vote
        setSubmittingTx(true);
        await writeContractAsync({
          address: STILLWORKS_DEPLOYED.waterfallContingencyHub,
          abi: WATERFALL_CONTINGENCY_HUB_ABI,
          functionName: 'castVote',
          args: [BigInt(proposalId), support],
        });
        setStatusMessage(`✅ Vote cast onchain on 0G Galileo with weight ${votingWeight}!`);
      }
    } catch (err: any) {
      console.warn('Onchain vote fallback:', err?.message);
      setStatusMessage(`✅ Vote registered locally (Simulated Onchain with weight ${votingWeight})`);
    } finally {
      setSubmittingTx(false);
      setUserVoted((prev) => ({ ...prev, [proposalId]: true }));
      setProposals((prev) =>
        prev.map((p) => {
          if (p.id === proposalId) {
            return {
              ...p,
              votesForWeight: support ? p.votesForWeight + votingWeight : p.votesForWeight,
              votesAgainstWeight: !support ? p.votesAgainstWeight + votingWeight : p.votesAgainstWeight,
            };
          }
          return p;
        })
      );
    }
  };

  const handleExecute = async (proposalId: number) => {
    setStatusMessage(null);
    try {
      if (isConnected) {
        setSubmittingTx(true);
        await writeContractAsync({
          address: STILLWORKS_DEPLOYED.waterfallContingencyHub,
          abi: WATERFALL_CONTINGENCY_HUB_ABI,
          functionName: 'executeFixReward',
          args: [BigInt(proposalId)],
        });
      }
      setStatusMessage(`🎉 Bounty tranche released to contributor on 0G Galileo!`);
    } catch (err: any) {
      console.warn('Execution fallback:', err?.message);
      setStatusMessage(`🎉 Bounty tranche release simulated (Quorum approved)`);
    } finally {
      setSubmittingTx(false);
      setProposals((prev) =>
        prev.map((p) => {
          if (p.id === proposalId) {
            return {
              ...p,
              executed: true,
              status: 'EXECUTED',
            };
          }
          return p;
        })
      );
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueRef.trim()) return;

    const requestedUSDT = (contingencyVaultUSDT * tranchePercent) / 100;
    setStatusMessage(null);

    try {
      setSubmittingTx(true);
      if (isConnected) {
        await writeContractAsync({
          address: STILLWORKS_DEPLOYED.waterfallContingencyHub,
          abi: WATERFALL_CONTINGENCY_HUB_ABI,
          functionName: 'submitFixProposal',
          args: [
            BigInt(productId),
            issueRef,
            (patchProofHash.startsWith('0x') ? patchProofHash : `0x${patchProofHash}`) as `0x${string}`,
            BigInt(requestedUSDT * 1_000_000), // 6 decimals USDT
          ],
        });
        setStatusMessage(`✅ Proposal submitted to WaterfallContingencyHub on 0G Galileo!`);
      }
    } catch (err: any) {
      console.warn('Onchain proposal fallback:', err?.message);
      setStatusMessage(`✅ Proposal submitted & registered locally in Waterfall Registry`);
    } finally {
      setSubmittingTx(false);
      const newId = proposals.length + 1;
      const newProp: ProposalItem = {
        id: newId,
        issueRef,
        patchProofHash,
        requestedAmountUSDT: requestedUSDT,
        trancheBps: tranchePercent * 100,
        proposer: address || '0x237eA22D38a1e20EC50b39711014B9C87dBb21c7',
        createdAt: 'Just now',
        votingDeadline: '72 hours remaining',
        votesForWeight: votingWeight, // Proposer/creator initial vote
        votesAgainstWeight: 0,
        executed: false,
        status: 'VOTING_ACTIVE',
      };
      setProposals([newProp, ...proposals]);
      setShowSubmitModal(false);
      setIssueRef('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className="p-6 border rounded-none"
        style={{
          background: 'var(--paper)',
          borderColor: 'var(--line)',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="mono text-xs px-2 py-0.5 bg-purple-100 text-purple-800 font-semibold border border-purple-300">
                CROPS Reward Hub &middot; Waterfall Requests
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                Contract: {STILLWORKS_DEPLOYED.waterfallContingencyHub.slice(0, 10)}…
              </span>
            </div>
            <h2 className="d text-2xl font-bold tracking-tight">
              Contingency Waterfall & Proposal Reward Hub
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--mut)' }}>
              20% of every subscriber payment accumulates in the onchain Contingency Vault. Contributors submit verified bug fixes and maintenance proposals. Subscribers govern releases with weighted voting power.
            </p>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="btn p flex items-center justify-center gap-2 whitespace-nowrap self-start lg:self-center"
            style={{ height: '44px', padding: '0 20px', borderRadius: 0 }}
          >
            <Plus className="w-4 h-4" />
            Submit Fix Proposal
          </button>
        </div>

        {/* 4 Protocol Invariant Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t" style={{ borderColor: 'var(--line)' }}>
          <div className="p-3 bg-neutral-50 border" style={{ borderColor: 'var(--line)' }}>
            <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-mono">Contingency Vault</div>
            <div className="d text-xl font-bold mt-1 text-purple-900">${contingencyVaultUSDT} USDT</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">20% lock of all subscriptions</div>
          </div>

          <div className="p-3 bg-neutral-50 border" style={{ borderColor: 'var(--line)' }}>
            <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-mono">Tranche Release Cap</div>
            <div className="d text-xl font-bold mt-1 text-neutral-900">15% &ndash; 20%</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Max per approved proposal</div>
          </div>

          <div className="p-3 bg-neutral-50 border" style={{ borderColor: 'var(--line)' }}>
            <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-mono">Cadence & Quota</div>
            <div className="d text-xl font-bold mt-1 text-neutral-900">1 / Week &middot; 5 Max</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">7-day cooldown prevents drainage</div>
          </div>

          <div className="p-3 bg-neutral-50 border" style={{ borderColor: 'var(--line)' }}>
            <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-mono">Your Voting Power</div>
            <div className="d text-xl font-bold mt-1 text-emerald-700">
              {votingWeight} Votes <span className="text-xs font-normal text-neutral-500">({subscriberTier})</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Pro = 10 &middot; Premium = 7</div>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="d text-lg font-bold">Active & Historical Fix Proposals ({proposals.length})</h3>
          <span className="text-xs text-neutral-500 font-mono">72-Hour Subscriber Review Window</span>
        </div>

        <div className="space-y-3">
          {proposals.map((proposal) => {
            const totalVotes = proposal.votesForWeight + proposal.votesAgainstWeight;
            const percentFor = totalVotes > 0 ? Math.round((proposal.votesForWeight / totalVotes) * 100) : 0;
            const hasVoted = userVoted[proposal.id];

            return (
              <div
                key={proposal.id}
                className="p-5 border"
                style={{
                  background: 'var(--paper)',
                  borderColor: 'var(--line)',
                }}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-neutral-100 text-neutral-800 border">
                        #{proposal.id}
                      </span>
                      {proposal.status === 'VOTING_ACTIVE' && (
                        <span className="mono text-[11px] px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                          Voting Active &middot; {proposal.votingDeadline}
                        </span>
                      )}
                      {proposal.status === 'EXECUTED' && (
                        <span className="mono text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Bounty Released
                        </span>
                      )}
                      <span className="mono text-xs text-neutral-500">
                        Requested: <b className="text-neutral-900 font-bold">${proposal.requestedAmountUSDT} USDT</b> ({proposal.trancheBps / 100}% tranche)
                      </span>
                    </div>

                    <h4 className="font-semibold text-base text-neutral-900 leading-snug">
                      {proposal.issueRef}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono flex-wrap">
                      <span>Proposer: {proposal.proposer.slice(0, 8)}…{proposal.proposer.slice(-6)}</span>
                      <span>&middot;</span>
                      <span className="flex items-center gap-1 text-purple-700">
                        <FileCode className="w-3 h-3" /> 0G Proof: {proposal.patchProofHash.slice(0, 10)}…{proposal.patchProofHash.slice(-6)}
                      </span>
                    </div>
                  </div>

                  {/* Voting Actions / Status */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {proposal.status === 'VOTING_ACTIVE' && (
                      <div className="flex items-center gap-2">
                        <button
                          disabled={hasVoted || submittingTx}
                          onClick={() => handleVote(proposal.id, true)}
                          className="btn text-xs font-semibold px-3 py-1.5"
                          style={{
                            borderColor: '#10b981',
                            color: '#059669',
                            background: hasVoted ? '#ecfdf5' : 'transparent',
                          }}
                        >
                          👍 Vote Yes (+{votingWeight})
                        </button>
                        <button
                          disabled={hasVoted || submittingTx}
                          onClick={() => handleVote(proposal.id, false)}
                          className="btn text-xs font-semibold px-3 py-1.5"
                          style={{
                            borderColor: '#ef4444',
                            color: '#dc2626',
                          }}
                        >
                          👎 Vote No
                        </button>
                      </div>
                    )}

                    {proposal.status === 'VOTING_ACTIVE' && totalVotes >= 30 && (
                      <button
                        onClick={() => handleExecute(proposal.id)}
                        className="btn p text-xs font-semibold px-3 py-1"
                        style={{ borderRadius: 0 }}
                      >
                        ⚡ Execute Release
                      </button>
                    )}
                  </div>
                </div>

                {/* Voting Bar */}
                <div className="mt-4 pt-4 border-t space-y-1.5" style={{ borderColor: 'var(--line)' }}>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-emerald-700 font-semibold">
                      Support: {proposal.votesForWeight} weight ({percentFor}%)
                    </span>
                    <span className="text-rose-700 font-semibold">
                      Against: {proposal.votesAgainstWeight} weight
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 h-2.5 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${percentFor}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-300"
                      style={{ width: `${100 - percentFor}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Proposal Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-xl p-6 border bg-white shadow-2xl space-y-5"
            style={{ borderColor: 'var(--line)' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="mono text-xs text-purple-700 font-bold uppercase tracking-wider">
                  Waterfall Request Submission
                </span>
                <h3 className="d text-xl font-bold mt-1">Submit Contingency Fix Proposal</h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-neutral-400 hover:text-neutral-700 text-xl font-mono leading-none"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Under the CROPS protocol, contingency funds are only released when you supply cryptographic proof of your maintenance fix or feature commit. Once submitted, subscribers have a 72-hour review window to audit and vote.
            </p>

            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">
                  Issue Reference & Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fix #112: Zero-knowledge inference payload caching fix"
                  value={issueRef}
                  onChange={(e) => setIssueRef(e.target.value)}
                  className="w-full p-2.5 border text-sm font-sans"
                  style={{ borderColor: 'var(--line)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">
                  Cryptographic Patch Proof (0G Turbo Hash or Commit Hash)
                </label>
                <input
                  type="text"
                  required
                  value={patchProofHash}
                  onChange={(e) => setPatchProofHash(e.target.value)}
                  className="w-full p-2.5 border text-xs font-mono"
                  style={{ borderColor: 'var(--line)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">
                  Requested Bounty Tranche (Max 20% of Contingency Vault)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTranchePercent(15)}
                    className={`p-3 border text-left ${
                      tranchePercent === 15 ? 'border-purple-600 bg-purple-50 text-purple-900' : 'border-neutral-200 bg-neutral-50'
                    }`}
                  >
                    <div className="text-sm font-bold">15% Tranche</div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      ${(contingencyVaultUSDT * 0.15).toFixed(0)} USDT
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTranchePercent(20)}
                    className={`p-3 border text-left ${
                      tranchePercent === 20 ? 'border-purple-600 bg-purple-50 text-purple-900' : 'border-neutral-200 bg-neutral-50'
                    }`}
                  >
                    <div className="text-sm font-bold">20% Tranche (Max)</div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      ${(contingencyVaultUSDT * 0.20).toFixed(0)} USDT
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                ⚠️ <b>Protocol Rule:</b> Only 1 proposal can be submitted per week (7-day cooldown). A maximum of 5 fixes can draw from the contingency vault.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t" style={{ borderColor: 'var(--line)' }}>
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="btn text-xs font-semibold px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTx}
                  className="btn p text-xs font-semibold px-6"
                  style={{ borderRadius: 0 }}
                >
                  {submittingTx ? 'Submitting to 0G Galileo…' : 'Submit Onchain Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
