'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { zeroGGalileo } from '@/lib/chains/zeroG';
import { useState, useEffect } from 'react';

export function WalletButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const activeAddress = address || (user?.wallet?.address as `0x${string}` | undefined);

  const { data: balance } = useBalance({
    address: activeAddress,
    chainId: zeroGGalileo.id,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !ready) {
    return (
      <div
        className="h-[60px] px-4 flex items-center border-r font-mono text-xs text-neutral-400"
        style={{ borderColor: 'var(--line)' }}
      >
        Initializing...
      </div>
    );
  }

  if ((authenticated || isConnected) && activeAddress) {
    return (
      <div
        className="flex items-center h-[60px] px-3 border-r gap-2.5 bg-white shrink-0"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="flex flex-col text-right justify-center">
          <div className="flex items-center justify-end gap-1.5 leading-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-mono text-xs font-semibold tracking-tight" style={{ color: 'var(--ink)' }}>
              {activeAddress.slice(0, 6)}…{activeAddress.slice(-4)}
            </span>
          </div>
          <div className="flex items-center justify-end gap-1 font-mono text-[10px] mt-0.5 whitespace-nowrap" style={{ color: 'var(--p)' }}>
            <span>{balance ? `${Number(balance.formatted).toFixed(3)} 0G` : '0.000 0G'}</span>
            <span className="text-neutral-400">·</span>
            <span className="px-1 py-0.2 bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-medium">
              1.271 iAI/d
            </span>
          </div>
        </div>
        <button
          onClick={async () => {
            if (authenticated) await logout();
            disconnect();
          }}
          className="btn text-[11px] font-semibold px-2 py-1 text-neutral-500 hover:text-rose-700 hover:border-rose-300 transition"
          title="Disconnect wallet"
          style={{ height: '28px', minHeight: '28px', borderRadius: 0, padding: '0 8px' }}
        >
          Exit
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => login()}
      className="flex items-center h-[60px] px-5 border-r font-mono text-xs font-semibold hover:bg-neutral-50 transition"
      style={{
        borderColor: 'var(--line)',
        color: 'var(--pd)',
        background: 'var(--pt)',
        cursor: 'pointer',
      }}
    >
      <span className="w-2 h-2 rounded-full mr-2" style={{ background: '#6D28D9' }} />
      Sign in · Privy / 0G
    </button>
  );
}
