'use client';

import { ReactNode, useState } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';
import { zeroGGalileo } from '@/lib/chains/zeroG';

// Suppress external browser extension noise (e.g. MetaMask/Phantom disconnected background workers)
// from triggering Next.js development error overlay modals
if (typeof window !== 'undefined') {
  const isExtensionNoise = (msg?: string) => {
    if (!msg || typeof msg !== 'string') return false;
    return (
      msg.includes('Could not establish connection') ||
      msg.includes('Receiving end does not exist') ||
      msg.includes('message channel closed') ||
      msg.includes('Extension context invalidated')
    );
  };

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const msg = event.reason?.message || String(event.reason || '');
      if (isExtensionNoise(msg)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener(
    'error',
    (event) => {
      if (isExtensionNoise(event.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmw4v8tzn00a80gjpdl7nqdxj';

  return (
    <PrivyProvider
      appId={appId}
      config={{
        defaultChain: zeroGGalileo,
        supportedChains: [zeroGGalileo],
        loginMethods: ['email', 'google', 'github', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#6D28D9',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
