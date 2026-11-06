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
        className="flex items-center h-[60px] px-4 border-r gap-3 bg-white"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="flex flex-col text-right">
          <div className="flex items-center justify-end gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-xs font-semibold" style={{ color: 'var(--ink)' }}>
              {activeAddress.slice(0, 6)}…{activeAddress.slice(-4)}
            </span>
          </div>
          <span className="font-mono text-[10px]" style={{ color: 'var(--p)' }}>
            {balance ? `${Number(balance.formatted).toFixed(3)} 0G` : '0.000 0G'} · 1.271 iAI / day
          </span>
        </div>
        <button
          onClick={async () => {
            if (authenticated) await logout();
            disconnect();
          }}
          className="chip hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition"
          title="Sign out"
          style={{ height: '26px', cursor: 'pointer' }}
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
