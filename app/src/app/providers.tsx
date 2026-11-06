'use client';

import { ReactNode, useState } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';
import { zeroGGalileo } from '@/lib/chains/zeroG';

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
