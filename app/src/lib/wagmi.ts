import { http } from 'wagmi';
import { createConfig } from '@privy-io/wagmi';
import { zeroGGalileo } from './chains/zeroG';

export const config = createConfig({
  chains: [zeroGGalileo],
  transports: {
    [zeroGGalileo.id]: http('https://evmrpc-testnet.0g.ai'),
  },
  ssr: true,
});
