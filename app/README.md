# Stillworks Frontend dApp (`app/`)

Full-stack Next.js dApp powering sovereign software commerce, verifiable CROPS audits, and escrow walkaway rails on **0G**.

---

## 1. Stack & Architecture

- **Framework:** Next.js 14 (App Router, React 18, TypeScript, TailwindCSS)
- **Web3 Wallet Connection:** [Wagmi v2](https://wagmi.sh/) + [Viem](https://viem.sh/) + [TanStack React Query](https://tanstack.com/query)
- **0G Chain:** Connected to 0G Galileo Testnet (`chainId: 16602`) via `https://evmrpc-testnet.0g.ai`
- **0G Storage:** `@0gfoundation/0g-storage-ts-sdk` + `ethers@6.13.1` (Turbo Indexer: `https://indexer-storage-testnet-turbo.0g.ai`)
- **0G Compute:** Private Computer (pc.0g.ai) TEE router at `https://router-api-testnet.integratenetwork.work/v1` logging `X-Request-ID`

---

## 2. Core Modules & User Flows

1. **Product Storefront (`ProductCatalog.tsx`):**
   - Lists verified software tools that publish periodic onchain heartbeats and passports.
   - Allows users to lock subscription payments into `SubscriptionEscrow.sol`.

2. **0G Private Computer Auditor (`ComputeAuditor.tsx`):**
   - Submits passport schemas into 0G Private Computer TEE hardware using trust mode `private`.
   - Extracts cryptographically verifiable `X-Request-ID` and outputs compliance scores across CROPS invariants.

3. **0G Storage Station (`StorageExplorer.tsx`):**
   - Submits product passports and walkaway bundles to 0G Turbo Storage nodes.
   - Computes and verifies 32-byte Merkle root hashes for contract registration.

4. **CROPS Lead Property Killswitch (`EscrowKillswitch.tsx`):**
   - Interactive simulation testing founder server abandonment.
   - Demonstrates automated escrow pro-rata refunds and immediate unlock of self-hosted Docker bundles.

---

## 3. Quickstart & How to Run

### Install Dependencies
```bash
cd app
pnpm install
```

### Configure Environment
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Fill in your configuration:
- `NEXT_PUBLIC_0G_RPC_URL`: `https://evmrpc-testnet.0g.ai`
- `NEXT_PUBLIC_0G_STORAGE_INDEXER`: `https://indexer-storage-testnet-turbo.0g.ai`
- `ZEROG_PC_API_KEY`: Your key from [pc.0g.ai](https://pc.0g.ai) (optional in local simulation mode)
- `PRIVATE_KEY`: Your testnet wallet private key (for storage broadcasts)

### Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
