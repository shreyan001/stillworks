import { Navbar } from '@/components/Navbar';
import { WaterfallRewardHub } from '@/components/WaterfallRewardHub';
import { STILLWORKS_DEPLOYED } from '@/lib/contracts/abis';
import Link from 'next/link';
import { ShieldCheck, Coins, Award, GitBranch, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Reward Hub & Waterfall Contingency | Stillworks',
  description: 'Community-governed contingency releases for bug fixes, maintenance, and protocol improvements on 0G Galileo.',
};

export default function ProposalsPage() {
  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="wrap pt-8 space-y-8">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <Link href="/" className="hover:text-purple-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Stage board
          </Link>
          <span>/</span>
          <span className="text-neutral-800 font-semibold">Reward Hub & Contingency Waterfall</span>
        </div>

        {/* Hero Section */}
        <div className="box space-y-3" style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}>
          <div className="flex items-center gap-2">
            <span className="mono text-xs px-2 py-0.5 bg-purple-100 text-purple-900 font-bold border border-purple-200">
              Protocol Governance
            </span>
            <span className="chip p text-[10px]">0G Galileo (Chain ID 16602)</span>
          </div>
          <h1 className="d text-3xl font-extrabold tracking-tight">
            Waterfall Request & Contingency Reward Hub
          </h1>
          <p className="text-sm max-w-3xl" style={{ color: 'var(--mut)' }}>
            Under the Ethereum Foundation CROPS standard, every subscriber payment is divided onchain: 30% for operational expenses, 47.5% locked for developer review, 2.5% for 1-hour keeper upkeep, and <b>20% reserved in the Contingency Vault</b>.
            When issues arise or upgrades are required, contributors and stewards propose fixes. If verified with a cryptographic 0G Storage patch proof and approved by subscriber votes, <b>15%&ndash;20% tranches</b> are automatically remitted onchain.
          </p>
        </div>

        {/* 3 Pillars of the Reward Waterfall */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="box space-y-2">
            <div className="flex items-center gap-2 text-purple-700 font-mono text-xs font-bold uppercase">
              <Coins className="w-4 h-4" /> 1. Contingency Accumulation
            </div>
            <div className="d text-lg font-bold">20% Vault Reserve</div>
            <p className="text-xs text-neutral-500">
              Funds accumulate continuously from monthly ($10/mo) and annual ($7/yr) subscriptions. If the product is abandoned, remaining funds are returned pro-rata to users.
            </p>
          </div>

          <div className="box space-y-2">
            <div className="flex items-center gap-2 text-purple-700 font-mono text-xs font-bold uppercase">
              <Award className="w-4 h-4" /> 2. 15%&ndash;20% Tranche Limit
            </div>
            <div className="d text-lg font-bold">1 Proposal / Week &middot; 5 Max</div>
            <p className="text-xs text-neutral-500">
              A 7-day cooldown prevents treasury exhaustion. A maximum of five fixes can draw down the contingency vault, ensuring sustainability and high-leverage fixes.
            </p>
          </div>

          <div className="box space-y-2">
            <div className="flex items-center gap-2 text-purple-700 font-mono text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" /> 3. Subscriber Voting Weight
            </div>
            <div className="d text-lg font-bold">Pro = 10 &middot; Premium = 7</div>
            <p className="text-xs text-neutral-500">
              Voting weight is directly proportional to subscription commitment. Active users decide whether a maintenance patch meets quality standards before funds unlock.
            </p>
          </div>
        </div>

        {/* Main Interactive Waterfall Hub */}
        <WaterfallRewardHub
          productId={1}
          productSlug="clean"
          productName="Clean"
          contingencyVaultUSDT={1000}
        />

        {/* Onchain Contract Addresses Card */}
        <div className="box bg-neutral-50 space-y-3" style={{ borderColor: 'var(--line)' }}>
          <div className="mono text-xs text-neutral-500 uppercase tracking-wider font-bold">
            Verified Smart Contracts on 0G Galileo Testnet
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 bg-white border" style={{ borderColor: 'var(--line)' }}>
              <div className="text-neutral-400 text-[10px]">WATERFALL CONTINGENCY HUB</div>
              <div className="text-purple-900 font-bold break-all mt-0.5">
                {STILLWORKS_DEPLOYED.waterfallContingencyHub}
              </div>
            </div>
            <div className="p-2.5 bg-white border" style={{ borderColor: 'var(--line)' }}>
              <div className="text-neutral-400 text-[10px]">HOURLY PROTOCOL HUB (1-HR CADENCE)</div>
              <div className="text-purple-900 font-bold break-all mt-0.5">
                {STILLWORKS_DEPLOYED.hourlyProtocolHub}
              </div>
            </div>
            <div className="p-2.5 bg-white border" style={{ borderColor: 'var(--line)' }}>
              <div className="text-neutral-400 text-[10px]">CLEAN STEWARDSHIP ESCROW</div>
              <div className="text-neutral-800 break-all mt-0.5">
                {STILLWORKS_DEPLOYED.cleanEscrow}
              </div>
            </div>
            <div className="p-2.5 bg-white border" style={{ borderColor: 'var(--line)' }}>
              <div className="text-neutral-400 text-[10px]">USDT SETTLEMENT TOKEN</div>
              <div className="text-neutral-800 break-all mt-0.5">
                {STILLWORKS_DEPLOYED.usdt}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
