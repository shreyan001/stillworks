import { http, createConfig, injected } from 'wagmi';
import { zeroGGalileo } from './chains/zeroG';

export const config = createConfig({
  chains: [zeroGGalileo],
  connectors: [
    injected(),
  ],
  transports: {
    [zeroGGalileo.id]: http('https://evmrpc-testnet.0g.ai'),
  },
  ssr: true,
});

