'use client';

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { zeroGGalileo } from '@/lib/chains/zeroG';
import { Wallet, LogOut, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function WalletButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    chainId: zeroGGalileo.id,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-9 w-28 rounded-lg bg-zerog-border animate-pulse" />
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs font-semibold text-slate-200">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <span className="text-[10px] text-zerog-purple font-mono">
            {balance ? `${Number(balance.formatted).toFixed(3)} 0G` : '0.000 0G'}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-zerog-cardBg border border-zerog-border rounded-lg hover:border-red-500/50 hover:bg-red-500/10 transition-all"
          title="Disconnect wallet"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </div>
    );
  }

  const connector = connectors[0];

  return (
    <button
      onClick={() => connector && connect({ connector })}
      className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-zerog-purple hover:bg-zerog-purpleDark rounded-lg shadow-md hover:shadow-zerog-purple/20 transition-all cursor-pointer"
    >
      <Wallet className="w-4 h-4" />
      <span>Connect Wallet</span>
    </button>
  );
}
