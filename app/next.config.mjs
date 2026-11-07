/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Use fast in-memory caching to eliminate OneDrive file-sync lockups
    config.cache = { type: 'memory' };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@stripe/stripe-js': false,
      '@x402/evm': false,
      '@x402/core': false,
      '@x402/svm': false,
      '@coinbase/cdp-sdk': false,
      '@base-org/account': false,
      '@farcaster/mini-app-solana': false,
      '@solana/web3.js': false,
    };
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
