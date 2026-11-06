export type Product = {
  slug: string;
  name: string;
  tagline: string;
  pitch: string;
  category: string;
  imageUrl: string;
  stage: number;
  maxStages: number;
  cropsMet: { c: boolean; r: boolean; o: boolean; p: boolean; s: boolean };
  capitalReleasedPct: number;
  mrr: string;
  vault: string;
  backers: number;
  status: "live" | "launching" | "graduated";
  friends: number;
  score: number;
  license: string;
  repoUrl: string;
  heartbeatUptime: string;
  escrowAddress?: string;
  pricing: {
    free: { name: string; price: string; period: string; quota: string };
    pro: { name: string; price: string; period: string; quota: string };
    premium: { name: string; price: string; period: string; quota: string };
  };
  details: { label: string; value: string }[];
  cropsEvidence: {
    code: string;
    label: string;
    evidence: string;
    status: "Met" | "Pending";
  }[];
  attestationLogs: { date: string; message: string; proof?: string }[];
};

export const products: Product[] = [
  {
    slug: "clean",
    name: "Clean",
    tagline: "Local-first privacy runtime and CROPS compliance sanitizer.",
    pitch: "Clean sanitizes your personal workflow before any network interaction. It keeps personal notes, credentials, and prompts in your browser's private sandbox while publishing verifiable compliance proofs and encrypted walkaway snapshots to 0G Storage.",
    category: "Sanitizer & Privacy",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    stage: 2,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: true },
    capitalReleasedPct: 70,
    mrr: "$6,240",
    vault: "$42,800",
    backers: 269,
    status: "live",
    friends: 84,
    score: 98,
    license: "MIT",
    repoUrl: "https://github.com/shreyan001/stillworks",
    heartbeatUptime: "99.98%",
    escrowAddress: "0x153badA8AB7C65DAF3a90f581E6b34AB7cAC543a",
    pricing: {
      free: {
        name: "Preview Tier",
        price: "$0",
        period: "Free daily",
        quota: "1.271 iAI daily inference credits included with 0G preview wallet",
      },
      pro: {
        name: "Pro Monthly",
        price: "$10",
        period: "/ month",
        quota: "Unlimited local sanitization, daily 0G TEE attestation, priority keeper",
      },
      premium: {
        name: "Premium Annual",
        price: "$7",
        period: "/ year (prepaid)",
        quota: "Full sovereign escrow guarantee, custom walkaway schemas, 1-year prepaid lock",
      },
    },
    details: [
      { label: "Cadence", value: "State snapshot verified every 24 hours" },
      { label: "Storage", value: "0G Storage Turbo Layer (Galileo Chain 16602)" },
      { label: "Inference", value: "0G Private Computer (0gm-1.0-35b-a3b, TEE hardware sealed)" },
      { label: "Stewardship", value: "30% Ops, 20% Contingency, 47.5% Review Lock, 2.5% Hub Upkeep" },
    ],
    cropsEvidence: [
      {
        code: "C",
        label: "Censorship-Resistant",
        evidence: "Frontend statically pinned on 0G Storage; runs directly via decentralized gateway",
        status: "Met",
      },
      {
        code: "R",
        label: "Resistant (Killswitch)",
        evidence: "Subscription escrow unlocks 100% pro-rata refund upon missed heartbeat",
        status: "Met",
      },
      {
        code: "O",
        label: "Open Source",
        evidence: "MIT open-source codebase, fully reproducible from repository alone",
        status: "Met",
      },
      {
        code: "P",
        label: "Privacy-First",
        evidence: "Zero central database. Client state is encrypted in local IndexedDB",
        status: "Met",
      },
      {
        code: "S",
        label: "Sovereign Exit",
        evidence: "Walkaway recovery bundle runs completely offline via docker-compose",
        status: "Met",
      },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "24-Hour snapshot root anchored to Galileo contract 0x6939…1460", proof: "0x4b7c…89ab" },
      { date: "Nov 5, 2026", message: "Zero PII egress verified across 1,420 client sessions", proof: "0x12a9…99ce" },
      { date: "Nov 4, 2026", message: "Intel TDX enclave attestation refreshed with 0G Private Computer", proof: "0x89ee…77fa" },
    ],
  },
  {
    slug: "gleam",
    name: "Gleam",
    tagline: "Sovereign social media scheduler with 0G AI inference budget management.",
    pitch: "Gleam schedules posts across decentralized social protocols (Farcaster, Lens) and web2 channels without relying on a centralized cloud worker. Runs strictly within a daily private inference budget tied directly to verified escrow operations.",
    category: "Scheduler & Social",
    imageUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80",
    stage: 1,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: false },
    capitalReleasedPct: 40,
    mrr: "$3,450",
    vault: "$24,500",
    backers: 184,
    status: "live",
    friends: 42,
    score: 91,
    license: "Apache-2.0",
    repoUrl: "https://github.com/stillworks/gleam-scheduler",
    heartbeatUptime: "99.82%",
    pricing: {
      free: {
        name: "Preview Tier",
        price: "$0",
        period: "Free daily",
        quota: "1.271 iAI daily compute credits for schedule optimization",
      },
      pro: {
        name: "Pro Monthly",
        price: "$10",
        period: "/ month",
        quota: "Unlimited queue slots, multi-network dispatch, automated cryptographic signatures",
      },
      premium: {
        name: "Premium Annual",
        price: "$7",
        period: "/ year (prepaid)",
        quota: "Perpetual queue reserve, custom TEE prompt tuning, offline walkaway export",
      },
    },
    details: [
      { label: "Cadence", value: "Queue dispatches verified every epoch (2 hours)" },
      { label: "Storage", value: "0G Storage Turbo Layer (Galileo Chain 16602)" },
      { label: "Inference", value: "Strict 1.271 iAI budget ceiling per preview account" },
      { label: "Stewardship", value: "30% Ops, 20% Contingency, 47.5% Review Lock, 2.5% Hub Upkeep" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Posts signed client-side with user's native keys", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Missed heartbeat past 2 hours unlocks subscriber contingency refund", status: "Met" },
      { code: "O", label: "Open Source", evidence: "Apache-2.0 repository with reproducible build steps", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Drafts and keys encrypted with AES-256 in local browser IndexedDB", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Self-hosting queue worker export pending Stage 2 audit", status: "Pending" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "Inference budget quota audit passed on 0G Galileo", proof: "0x33ef…1120" },
      { date: "Nov 4, 2026", message: "Neynar & Lens hub sync attested via Chainlink CRE", proof: "0x77aa…90bc" },
    ],
  },
  {
    slug: "venus",
    name: "Venus",
    tagline: "Private AI studio with Intel TDX TEE enclave & zero server retention.",
    pitch: "Venus provides ChatGPT-like confidential text, image, and media generation. All compute executes inside hardware-enforced Trusted Execution Environments. Prompts and weights are decrypted exclusively in temporary enclave RAM and zeroized immediately after output.",
    category: "Private AI",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
    stage: 2,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: true },
    capitalReleasedPct: 70,
    mrr: "$8,920",
    vault: "$58,400",
    backers: 412,
    status: "live",
    friends: 119,
    score: 96,
    license: "MIT",
    repoUrl: "https://github.com/stillworks/venus-tee",
    heartbeatUptime: "99.95%",
    pricing: {
      free: {
        name: "Preview Tier",
        price: "$0",
        period: "Free daily",
        quota: "1.271 iAI daily private inference quota on 0G preview wallet",
      },
      pro: {
        name: "Pro Monthly",
        price: "$10",
        period: "/ month",
        quota: "High-speed Intel TDX enclave inference, confidential image rendering, priority queue",
      },
      premium: {
        name: "Premium Annual",
        price: "$7",
        period: "/ year (prepaid)",
        quota: "Dedicated TEE enclave instance, custom fine-tune memory bounds, 1-year escrow lock",
      },
    },
    details: [
      { label: "TEE Hardware", value: "Intel TDX / AMD SEV-SNP sealed memory" },
      { label: "Storage", value: "0G Storage Turbo Layer (Galileo Chain 16602)" },
      { label: "Audit Key", value: "0x52bA73109624Ff2b7c71CA13277Ff762d4Dc7701" },
      { label: "Stewardship", value: "30% Ops, 20% Contingency, 47.5% Review Lock, 2.5% Hub Upkeep" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Peer-to-peer WebRTC fallback when gateways are blocked", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Automated killswitch refunds escrow balance if TEE node halts", status: "Met" },
      { code: "O", label: "Open Source", evidence: "MIT enclave driver and UI source code", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Hardware attestation guarantees host OS cannot read user prompts", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Local Ollama / vLLM fallback weights downloadable via 0G", status: "Met" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "Hardware attestation quote verified on 0G Galileo", proof: "0x892a…cc41" },
      { date: "Nov 5, 2026", message: "Zero plaintext leakage certified by independent audit", proof: "0xfa11…02de" },
    ],
  },
  {
    slug: "calmcal",
    name: "Calmcal",
    tagline: "Peer-to-peer encrypted appointment calendar & meeting escrow.",
    pitch: "Calmcal replaces Calendly with zero-knowledge availability proofs. Participants verify booking windows without revealing calendar contents, and appointment deposits are locked in Galileo escrow until meetings conclude.",
    category: "Calendar & Scheduling",
    imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80",
    stage: 3,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: true },
    capitalReleasedPct: 100,
    mrr: "$4,120",
    vault: "$31,200",
    backers: 198,
    status: "graduated",
    friends: 67,
    score: 99,
    license: "AGPL-3.0",
    repoUrl: "https://github.com/stillworks/calmcal",
    heartbeatUptime: "99.99%",
    pricing: {
      free: { name: "Preview Tier", price: "$0", period: "Free daily", quota: "3 active meeting slots" },
      pro: { name: "Pro Monthly", price: "$10", period: "/ month", quota: "Unlimited peer calendar syncing, CalDAV bridge" },
      premium: { name: "Premium Annual", price: "$7", period: "/ year", quota: "Multi-party scheduling escrow, custom domain routing" },
    },
    details: [
      { label: "Sync Engine", value: "Local IndexedDB + WSS P2P sync" },
      { label: "Storage", value: "0G Storage Turbo Layer" },
      { label: "Graduation", value: "Stage 3 Sovereign Graduate (100% Capital Released)" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Direct browser-to-browser WebRTC handshake", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Zero dependency on Calmcal central servers", status: "Met" },
      { code: "O", label: "Open Source", evidence: "AGPL-3.0 complete repo", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Availability computed via zero-knowledge range proofs", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "One-click export to standard ICS / CalDAV format", status: "Met" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "Stage 3 sovereign graduation confirmed on StillworksHub", proof: "0xcc89…01fe" },
    ],
  },
  {
    slug: "hushnote",
    name: "Hushnote",
    tagline: "Zero-knowledge encrypted personal notebook with 0G Turbo backup.",
    pitch: "Hushnote gives you an uncompromising personal knowledge base. Your notes are encrypted with your device key before hitting disk. Automated encrypted backups sync seamlessly to 0G Storage nodes, ensuring complete permanence without third-party surveillance.",
    category: "Knowledge Base",
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
    stage: 2,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: true },
    capitalReleasedPct: 70,
    mrr: "$5,110",
    vault: "$36,900",
    backers: 310,
    status: "live",
    friends: 92,
    score: 97,
    license: "MIT",
    repoUrl: "https://github.com/stillworks/hushnote",
    heartbeatUptime: "99.97%",
    pricing: {
      free: { name: "Preview Tier", price: "$0", period: "Free daily", quota: "Up to 50 encrypted markdown notes" },
      pro: { name: "Pro Monthly", price: "$10", period: "/ month", quota: "Unlimited notes, bidirectional links, 0G Turbo sync" },
      premium: { name: "Premium Annual", price: "$7", period: "/ year", quota: "Multi-device cryptographic key sync, encrypted media storage" },
    },
    details: [
      { label: "Encryption", value: "AES-GCM-256 with Argon2id key derivation" },
      { label: "Storage", value: "0G Storage Turbo Layer" },
      { label: "Audit", value: "Zero plaintext leaves user browser" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Static PWA runs completely offline in airplane mode", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Escrow unlocks pro-rata refund upon missed heartbeat", status: "Met" },
      { code: "O", label: "Open Source", evidence: "Fully auditable MIT repository", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Zero knowledge architecture; even 0G nodes store ciphertext only", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Instant export to raw Markdown folder with YAML frontmatter", status: "Met" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "Argon2id client derivation verified across 2,800 vaults", proof: "0x77ba…1100" },
    ],
  },
  {
    slug: "listmonk",
    name: "Listmonk CROPS",
    tagline: "Self-hosted newsletter & subscriber management with local-first export.",
    pitch: "Listmonk CROPS is a sovereign packaging of the high-performance mailing engine. It allows creators to distribute newsletters without platform lock-in, tracking pixels, or subscriber list confiscation. Escrow guarantees walkaway recovery.",
    category: "Newsletter & Email",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    stage: 1,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: false },
    capitalReleasedPct: 40,
    mrr: "$2,890",
    vault: "$19,400",
    backers: 142,
    status: "live",
    friends: 39,
    score: 89,
    license: "AGPL-3.0",
    repoUrl: "https://github.com/stillworks/listmonk-crops",
    heartbeatUptime: "99.85%",
    pricing: {
      free: { name: "Preview Tier", price: "$0", period: "Free daily", quota: "Up to 500 test subscribers" },
      pro: { name: "Pro Monthly", price: "$10", period: "/ month", quota: "Unlimited campaigns, SMTP relay integration, transactional triggers" },
      premium: { name: "Premium Annual", price: "$7", period: "/ year", quota: "Dedicated IP warming rails, walkaway schema backup to 0G" },
    },
    details: [
      { label: "Database", value: "Client-side SQLite WASM + 0G backup" },
      { label: "Protocol", value: "Zero tracking pixels, native plain text delivery" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Self-contained Docker compose deployment", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Automated killswitch unlocks contingency balance", status: "Met" },
      { code: "O", label: "Open Source", evidence: "AGPL-3.0 upstream compliant", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Zero third-party tracking or spy pixels allowed", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Standard PostgreSQL pg_dump walkaway schema", status: "Pending" },
    ],
    attestationLogs: [
      { date: "Nov 5, 2026", message: "Zero spy pixel guarantee certified on 0G Galileo", proof: "0xbb12…90aa" },
    ],
  },
  {
    slug: "ironclad",
    name: "Ironclad DB",
    tagline: "Client-side SQLite & WebAssembly vector search database for local AI.",
    pitch: "Ironclad DB embeds an ultra-fast vector index directly inside your browser tab using WebAssembly and WebGPU. Store millions of embeddings locally without paying SaaS vector database fees or leaking semantic embeddings to central clouds.",
    category: "Developer Tools",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    stage: 2,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: true },
    capitalReleasedPct: 70,
    mrr: "$7,340",
    vault: "$51,800",
    backers: 345,
    status: "live",
    friends: 104,
    score: 95,
    license: "Apache-2.0",
    repoUrl: "https://github.com/stillworks/ironclad-db",
    heartbeatUptime: "99.96%",
    pricing: {
      free: { name: "Preview Tier", price: "$0", period: "Free daily", quota: "10,000 local vectors in memory" },
      pro: { name: "Pro Monthly", price: "$10", period: "/ month", quota: "Unlimited local vectors, WebGPU quantization, 0G Turbo sync" },
      premium: { name: "Premium Annual", price: "$7", period: "/ year", quota: "Multi-tenant browser indexing, zero-latency local RAG pipeline" },
    },
    details: [
      { label: "Engine", value: "SQLite WebAssembly + HNSW indexer" },
      { label: "Acceleration", value: "WebGPU SIMD vector math" },
      { label: "Storage", value: "0G Storage Turbo Layer" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "WASM binary runs entirely offline in user browser", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Subscription escrow protects subscriber capital", status: "Met" },
      { code: "O", label: "Open Source", evidence: "Apache-2.0 permissively licensed", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Zero vector data or embeddings leave client RAM", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Native SQLite .db file dump compatible with any SQLite CLI", status: "Met" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "WebGPU SIMD benchmark attested on 0G Galileo", proof: "0x44aa…8812" },
    ],
  },
  {
    slug: "aethercast",
    name: "Aether Cast",
    tagline: "Censorship-resistant podcast distribution with encrypted walkaway audio.",
    pitch: "Aether Cast empowers audio creators to publish RSS feeds and broadcast episodes without fear of deplatforming. Audio chunks are distributed across 0G decentralized storage nodes with verifiable cryptographic timestamps.",
    category: "Audio & Media",
    imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
    stage: 1,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: false },
    capitalReleasedPct: 40,
    mrr: "$2,150",
    vault: "$15,200",
    backers: 118,
    status: "live",
    friends: 28,
    score: 88,
    license: "MIT",
    repoUrl: "https://github.com/stillworks/aethercast",
    heartbeatUptime: "99.88%",
    pricing: {
      free: { name: "Preview Tier", price: "$0", period: "Free daily", quota: "Up to 3 published episodes" },
      pro: { name: "Pro Monthly", price: "$10", period: "/ month", quota: "Unlimited episodes, decentralized RSS syndication, 0G pinning" },
      premium: { name: "Premium Annual", price: "$7", period: "/ year", quota: "Lossless FLAC permanent archiving, listener micro-tipping rails" },
    },
    details: [
      { label: "Storage", value: "0G Storage Turbo Layer (Chunked Audio Leaves)" },
      { label: "Syndication", value: "W3C RSS 2.0 + Podcasting 2.0 spec" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Decentralized audio chunks cannot be pulled by single hosts", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Killswitch refunds subscribers if gateway uptime falters", status: "Met" },
      { code: "O", label: "Open Source", evidence: "MIT open codebase", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Zero listener fingerprinting or surveillance analytics", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Standard OPML / XML feed export bundle", status: "Pending" },
    ],
    attestationLogs: [
      { date: "Nov 5, 2026", message: "Podcasting 2.0 namespace compliance attested on Galileo", proof: "0x11ff…4421" },
    ],
  },
  {
    slug: "ciphergit",
    name: "Cipher Git",
    tagline: "Verifiable git mirror pinned to 0G decentralized storage.",
    pitch: "Cipher Git mirrors repositories and commit trees directly onto 0G Storage Turbo. Every commit, tag, and signed release is immutably anchored on Galileo, ensuring codebases can never be retroactively censored or deleted.",
    category: "Developer Tools",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    stage: 2,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: true },
    capitalReleasedPct: 70,
    mrr: "$4,850",
    vault: "$33,100",
    backers: 226,
    status: "live",
    friends: 74,
    score: 94,
    license: "GPL-3.0",
    repoUrl: "https://github.com/stillworks/ciphergit",
    heartbeatUptime: "99.94%",
    pricing: {
      free: { name: "Preview Tier", price: "$0", period: "Free daily", quota: "Mirror up to 2 open repositories" },
      pro: { name: "Pro Monthly", price: "$10", period: "/ month", quota: "Unlimited repo mirroring, GPG signature attestation on Galileo" },
      premium: { name: "Premium Annual", price: "$7", period: "/ year", quota: "Continuous CI release pinning, automated 0G snapshot sync" },
    },
    details: [
      { label: "Protocol", value: "Git Smart HTTP + 0G Storage Packfile backend" },
      { label: "Verification", value: "Cryptographic commit hash verified by Galileo DON" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Git packfiles distributed across independent 0G storage nodes", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Escrow funds locked until verifiable packfile hashes match", status: "Met" },
      { code: "O", label: "Open Source", evidence: "GPL-3.0 open source code", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Zero tracking of git clones or commit metadata", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Cloneable via standard git clone command with zero custom tooling", status: "Met" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "14,000 git commits anchored to 0G Turbo Layer", proof: "0x88bb…33aa" },
    ],
  },
  {
    slug: "sentinel",
    name: "Sentinel Guardian",
    tagline: "Automated heartbeat monitor & CROPS killswitch watchtower on 0G Galileo.",
    pitch: "Sentinel Guardian is the platform's autonomous watchdog. It runs verification cycles against registered endpoints, feeds telemetry into Chainlink CRE and StillworksHub, and coordinates subscriber contingency unlocks whenever developer liveness lapses.",
    category: "Infrastructure & Security",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    stage: 3,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: true },
    capitalReleasedPct: 100,
    mrr: "$6,800",
    vault: "$49,000",
    backers: 360,
    status: "graduated",
    friends: 110,
    score: 100,
    license: "MIT",
    repoUrl: "https://github.com/stillworks/sentinel-guardian",
    heartbeatUptime: "99.99%",
    pricing: {
      free: { name: "Preview Tier", price: "$0", period: "Free daily", quota: "Inspect public uptime and audit logs" },
      pro: { name: "Pro Monthly", price: "$10", period: "/ month", quota: "Custom heartbeat webhook monitoring, automated contingency alerting" },
      premium: { name: "Premium Annual", price: "$7", period: "/ year", quota: "Multi-region watchtower deployment, direct CRE keeper upkeep trigger" },
    },
    details: [
      { label: "Network", value: "0G Galileo (16602) Chainlink CRE sync" },
      { label: "Role", value: "Autonomous Killswitch & Upkeep Watchtower" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Operates across decentralized validator nodes", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Stateless verification with zero single-point failure", status: "Met" },
      { code: "O", label: "Open Source", evidence: "MIT permissive license", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Only public cryptographic heartbeats audited", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Open telemetry stream readable by any EVM wallet", status: "Met" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "Epoch #44 upkeep cycle completed with zero missed heartbeats", proof: "0x55ee…9900" },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProducts(): Product[] {
  return products;
}

