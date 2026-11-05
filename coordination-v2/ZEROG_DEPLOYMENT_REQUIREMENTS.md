# 0G Deployment & Hosting Architecture Specification

## 1. Where Is This Application Hosted?

To satisfy **CROPS (Censorship Resistant, Open-source, Private, Secure)** and 0G track requirements, Stillworks cannot rely on centralized cloud hosts (Vercel, AWS, Cloudflare) as a single point of failure.

The application has a dual-tier deployment model:

```mermaid
flowchart TD
    subgraph Client["Client Tier (User Browser)"]
        UI["Next.js Static Frontend (HTML/JS/WASM)"]
        WAGMI["Wagmi v2 / Viem Wallet"]
    end

    subgraph ZeroG_Decentralized["0G Infrastructure Tier"]
        STORAGE["0G Storage Turbo Layer (Frontend Roots + Data Bundles)"]
        CHAIN["0G Chain (Galileo 16602) Contracts"]
        PC["0G Private Computer (TEE Router)"]
    end

    subgraph Routing["Domain & Resolution Tier"]
        DOMAIN["0G Domain ID / ENS / DNSLink Gateway"]
    end

    DOMAIN --> STORAGE
    UI -->|Static Bundle Loaded| DOMAIN
    UI -->|Transactions / Escrow| CHAIN
    UI -->|Data Persistence & Walkaway| STORAGE
    UI -->|Verifiable Audit (Private Mode)| PC
```

---

## 2. Full Set of Requirements for Deploying on 0G

### Requirement A: Pure Static Export (`output: 'export'`)
1. **Next.js Static Export:**
   - Next.js must compile with `output: 'export'` in `next.config.mjs` to generate a static distribution directory (`out/` containing `index.html`, client JS bundles, and static assets).
   - Dynamic Node.js server routes (`/api/...`) cannot execute inside a decentralized storage node. All RPC calls to 0G Chain and indexer calls to 0G Storage Turbo must be executed client-side via Viem, Wagmi, and the 0G client SDK, OR through a dedicated sovereign backend daemon.

### Requirement B: Uploading to 0G Storage Turbo
1. **Bundle Packaging:**
   - Package the `out/` directory into a deterministic tar/zip bundle or directory manifest.
2. **Merkle Tree Indexing:**
   - Use `@0gfoundation/0g-storage-ts-sdk` and `Indexer('https://indexer-storage-testnet-turbo.0g.ai')` with the deployer wallet to upload the assets.
   - The indexer distributes the chunks to the 6 decentralized storage nodes and returns the **32-byte Merkle Root Hash** (`rootHash`).

### Requirement C: 0G-Enabled Domain IDs & Decentralized Gateways
To access the frontend by URL rather than raw hash:
1. **0G Storage Gateway:**
   - Retrieve assets via `https://indexer-storage-testnet-turbo.0g.ai/file/<rootHash>`.
2. **0G Domain IDs / ENS / DNSLink Mapping:**
   - Register the 32-byte root hash into an onchain Domain Registry (or IPFS/0G content hash record).
   - When a browser queries the domain (e.g. `stillworks.0g` or `stillworks.eth`), the gateway resolves the record onchain, queries the 0G Storage nodes for the Merkle root, and streams the frontend assets directly to the browser.

---

## 3. Backend Daemon Requirements (`backend/`)

To support unattended operations without violating CROPS (no centralized database, no user tracking):
1. **Heartbeat Attestation Bot:**
   - A lightweight Node/Go daemon run by the founder or autonomous agent.
   - Periodically computes operational liveness proofs and calls `ProductRegistry.heartbeat(productId, seq, proof)` on 0G Galileo (Chain 16602).
2. **0G Private Computer (TEE) Relay:**
   - Interfaces with `https://router-api-testnet.integratenetwork.work/v1` in TEE-sealed mode (`X-0G-Provider-Trust-Mode: private`).
   - Obtains and signs compliance certificates with verifiable `X-Request-ID` headers to mint onchain invoices.
