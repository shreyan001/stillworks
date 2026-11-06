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
  architecture?: {
    databaseEngine: string;
    inferenceEngine: string;
    storageRuntime: string;
  };
  zeroGIntegration?: {
    storageTurboEndpoint: string;
    stateRootCadence: string;
    servingBrokerAddress: string;
    computeModel: string;
    brokerTrustMode: string;
  };
  stewardship?: {
    opsPercent: number;
    contingencyPercent: number;
    reviewLockPercent: number;
    upkeepFeePercent: number;
    monthlyOpsUsd: string;
    monthlyContingencyUsd: string;
    monthlyReviewLockUsd: string;
    monthlyUpkeepUsd: string;
  };
  governance?: {
    escrowContract: string;
    weeklyProposalLimit: string;
    maxContingencyTranche: string;
    votingPeriodHours: number;
    votingWeights: {
      free: number;
      pro: number;
      premium: number;
    };
  };
};

export const products: Product[] = [
  {
    slug: "clean",
    name: "Clean",
    tagline: "Local-first privacy runtime and CROPS compliance sanitizer.",
    pitch: "Clean sanitizes developer workflows, API keys, and sensitive prompts in client memory before network dispatch. Notes and credential caches remain strictly inside the local browser sandbox while verifiable compliance proofs and walkaway snapshots are anchored to 0G Storage.",
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
    repoUrl: "https://github.com/microsoft/presidio",
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
      { label: "Stewardship", value: "30% Ops ($1,872), 20% Cont ($1,248), 47.5% Lock ($2,964), 2.5% Upkeep ($156)" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Frontend statically pinned on 0G Storage; runs directly via decentralized gateway", status: "Met" },
      { code: "R", label: "Resistant (Killswitch)", evidence: "Subscription escrow unlocks 100% pro-rata refund upon missed heartbeat", status: "Met" },
      { code: "O", label: "Open Source", evidence: "MIT open-source codebase, fully reproducible from repository alone", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Zero central database. Client state is encrypted in local IndexedDB / OPFS", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Walkaway recovery bundle runs completely offline via docker-compose", status: "Met" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "24-Hour snapshot root anchored to Galileo contract 0x6939…1460", proof: "0x4b7c…89ab" },
      { date: "Nov 5, 2026", message: "Zero PII egress verified across 1,420 client sessions", proof: "0x12a9…99ce" },
      { date: "Nov 4, 2026", message: "Intel TDX enclave attestation refreshed with 0G Private Computer", proof: "0x89ee…77fa" },
    ],
    architecture: {
      databaseEngine: "SQLite WASM (OPFS virtual filesystem)",
      inferenceEngine: "ONNX Runtime Web (WebAssembly / WebGPU SIMD)",
      storageRuntime: "Client-side browser sandbox + Docker standalone",
    },
    zeroGIntegration: {
      storageTurboEndpoint: "https://indexer-storage-testnet-turbo.0g.ai",
      stateRootCadence: "24-hour batch Merkle root",
      servingBrokerAddress: "0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939",
      computeModel: "0gm-1.0-35b-a3b",
      brokerTrustMode: "private (Intel TDX sealed)",
    },
    stewardship: {
      opsPercent: 30,
      contingencyPercent: 20,
      reviewLockPercent: 47.5,
      upkeepFeePercent: 2.5,
      monthlyOpsUsd: "$1,872",
      monthlyContingencyUsd: "$1,248",
      monthlyReviewLockUsd: "$2,964",
      monthlyUpkeepUsd: "$156",
    },
    governance: {
      escrowContract: "0x153badA8AB7C65DAF3a90f581E6b34AB7cAC543a",
      weeklyProposalLimit: "1 proposal per 7 days",
      maxContingencyTranche: "20% vault ceiling ($249.60 max per fix)",
      votingPeriodHours: 72,
      votingWeights: { free: 0, pro: 1, premium: 3 },
    },
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
    license: "AGPL-3.0",
    repoUrl: "https://github.com/gitroomhq/postiz",
    heartbeatUptime: "99.82%",
    escrowAddress: "0x32A46e618991D328C66f44C1b5BfAc2dE1644c10",
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
      { label: "Cadence", value: "Queue dispatches verified every epoch (1 hour)" },
      { label: "Storage", value: "0G Storage Turbo Layer (Galileo Chain 16602)" },
      { label: "Inference", value: "Strict 1.271 iAI budget ceiling per preview account" },
      { label: "Stewardship", value: "30% Ops ($1,035), 20% Cont ($690), 47.5% Lock ($1,638.75), 2.5% Upkeep ($86.25)" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Posts signed client-side with user's native Web3 keys", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Missed heartbeat past 2 hours unlocks subscriber contingency refund", status: "Met" },
      { code: "O", label: "Open Source", evidence: "AGPL-3.0 upstream repository with reproducible build steps", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Drafts and keys encrypted with AES-256 in local browser IndexedDB", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Self-hosting queue worker export pending Stage 2 audit", status: "Pending" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "Inference budget quota audit passed on 0G Galileo", proof: "0x33ef…1120" },
      { date: "Nov 4, 2026", message: "Neynar & Lens hub sync attested via Chainlink CRE", proof: "0x77aa…90bc" },
    ],
    architecture: {
      databaseEngine: "PGlite (embedded PostgreSQL in IndexedDB)",
      inferenceEngine: "llama.cpp via local Ollama / 0G Private Computer",
      storageRuntime: "Client-side IndexedDB with P2P relay sync",
    },
    zeroGIntegration: {
      storageTurboEndpoint: "https://indexer-storage-testnet-turbo.0g.ai",
      stateRootCadence: "1-hour epoch schedule root",
      servingBrokerAddress: "0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939",
      computeModel: "0gm-1.0-35b-a3b",
      brokerTrustMode: "private (sealed prompt execution)",
    },
    stewardship: {
      opsPercent: 30,
      contingencyPercent: 20,
      reviewLockPercent: 47.5,
      upkeepFeePercent: 2.5,
      monthlyOpsUsd: "$1,035",
      monthlyContingencyUsd: "$690",
      monthlyReviewLockUsd: "$1,638.75",
      monthlyUpkeepUsd: "$86.25",
    },
    governance: {
      escrowContract: "0x32A46e618991D328C66f44C1b5BfAc2dE1644c10",
      weeklyProposalLimit: "1 proposal per 7 days",
      maxContingencyTranche: "20% vault ceiling ($138 max per fix)",
      votingPeriodHours: 72,
      votingWeights: { free: 0, pro: 1, premium: 3 },
    },
  },
  {
    slug: "venus",
    name: "Venus",
    tagline: "Private AI studio with Intel TDX TEE enclave & zero server retention.",
    pitch: "Venus provides confidential text, AST code auditing, and static analysis. All compute executes inside hardware-enforced Trusted Execution Environments. Prompts and weights are decrypted exclusively in temporary enclave RAM and zeroized immediately after output.",
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
    repoUrl: "https://github.com/crytic/slither",
    heartbeatUptime: "99.95%",
    escrowAddress: "0x52bA73109624Ff2b7c71CA13277Ff762d4Dc7701",
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
        quota: "High-speed Intel TDX enclave inference, confidential static analysis, priority queue",
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
      { label: "Stewardship", value: "30% Ops ($2,676), 20% Cont ($1,784), 47.5% Lock ($4,237), 2.5% Upkeep ($223)" },
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
    architecture: {
      databaseEngine: "DuckDB-WASM (in-memory columnar analytical engine)",
      inferenceEngine: "0G Private Computer TEE (0gm-1.0-35b-a3b) + llama.cpp local fallback",
      storageRuntime: "Client-side WebAssembly RAM + encrypted local cache",
    },
    zeroGIntegration: {
      storageTurboEndpoint: "https://indexer-storage-testnet-turbo.0g.ai",
      stateRootCadence: "Daily cryptographic SBOM & audit snapshot",
      servingBrokerAddress: "0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939",
      computeModel: "0gm-1.0-35b-a3b",
      brokerTrustMode: "private (Intel TDX hardware attested)",
    },
    stewardship: {
      opsPercent: 30,
      contingencyPercent: 20,
      reviewLockPercent: 47.5,
      upkeepFeePercent: 2.5,
      monthlyOpsUsd: "$2,676",
      monthlyContingencyUsd: "$1,784",
      monthlyReviewLockUsd: "$4,237",
      monthlyUpkeepUsd: "$223",
    },
    governance: {
      escrowContract: "0x52bA73109624Ff2b7c71CA13277Ff762d4Dc7701",
      weeklyProposalLimit: "1 proposal per 7 days",
      maxContingencyTranche: "20% vault ceiling ($356.80 max per fix)",
      votingPeriodHours: 72,
      votingWeights: { free: 0, pro: 10, premium: 84 },
    },
  },
  {
    slug: "sentinel",
    name: "Sentinel Pulse",
    tagline: "Automated heartbeat monitor & CROPS killswitch watchtower on 0G Galileo.",
    pitch: "Sentinel Pulse is the platform's autonomous watchdog. It runs verification cycles against registered endpoints, feeds telemetry into Chainlink CRE and StillworksHub, and coordinates subscriber contingency unlocks whenever developer liveness lapses.",
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
    repoUrl: "https://github.com/louislam/uptime-kuma",
    heartbeatUptime: "99.99%",
    escrowAddress: "0xb2b264386d3b88085ca7e4114a6B0eF0358aC450",
    pricing: {
      free: { name: "Preview Tier", price: "$0", period: "Free daily", quota: "Inspect public uptime and audit logs" },
      pro: { name: "Pro Monthly", price: "$10", period: "/ month", quota: "Custom heartbeat webhook monitoring, automated contingency alerting" },
      premium: { name: "Premium Annual", price: "$7", period: "/ year", quota: "Multi-region watchtower deployment, direct CRE keeper upkeep trigger" },
    },
    details: [
      { label: "Network", value: "0G Galileo (16602) Chainlink CRE sync" },
      { label: "Role", value: "Autonomous Killswitch & Upkeep Watchtower" },
      { label: "Stewardship", value: "30% Ops ($2,040), 20% Cont ($1,360), 47.5% Lock ($3,230), 2.5% Upkeep ($170)" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Operates across decentralized validator nodes", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Stateless verification with zero single-point failure", status: "Met" },
      { code: "O", label: "Open Source", evidence: "MIT permissive license with public GitHub tree", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Only public cryptographic heartbeats audited", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Open telemetry stream readable by any EVM wallet", status: "Met" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "Epoch #44 upkeep cycle completed with zero missed heartbeats", proof: "0x55ee…9900" },
    ],
    architecture: {
      databaseEngine: "SQLite 3 with Litestream replication",
      inferenceEngine: "ONNX Runtime Web edge anomaly classifier",
      storageRuntime: "Decentralized node daemon + browser console",
    },
    zeroGIntegration: {
      storageTurboEndpoint: "https://indexer-storage-testnet-turbo.0g.ai",
      stateRootCadence: "1-hour epoch heartbeat Merkle root",
      servingBrokerAddress: "0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939",
      computeModel: "0gm-1.0-35b-a3b",
      brokerTrustMode: "private (isolated challenge verification)",
    },
    stewardship: {
      opsPercent: 30,
      contingencyPercent: 20,
      reviewLockPercent: 47.5,
      upkeepFeePercent: 2.5,
      monthlyOpsUsd: "$2,040",
      monthlyContingencyUsd: "$1,360",
      monthlyReviewLockUsd: "$3,230",
      monthlyUpkeepUsd: "$170",
    },
    governance: {
      escrowContract: "0xb2b264386d3b88085ca7e4114a6B0eF0358aC450",
      weeklyProposalLimit: "1 proposal per 7 days",
      maxContingencyTranche: "20% vault ceiling ($272 max per fix)",
      votingPeriodHours: 72,
      votingWeights: { free: 0, pro: 1, premium: 3 },
    },
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
    license: "AGPL-3.0",
    repoUrl: "https://github.com/standardnotes/app",
    heartbeatUptime: "99.97%",
    escrowAddress: "0x77ba1100fA8c89b21A11c002231A990114dD8821",
    pricing: {
      free: { name: "Preview Tier", price: "$0", period: "Free daily", quota: "Up to 50 encrypted markdown notes" },
      pro: { name: "Pro Monthly", price: "$10", period: "/ month", quota: "Unlimited notes, bidirectional links, 0G Turbo sync" },
      premium: { name: "Premium Annual", price: "$7", period: "/ year", quota: "Multi-device cryptographic key sync, encrypted media storage" },
    },
    details: [
      { label: "Encryption", value: "AES-GCM-256 with Argon2id key derivation" },
      { label: "Storage", value: "0G Storage Turbo Layer" },
      { label: "Stewardship", value: "30% Ops ($1,533), 20% Cont ($1,022), 47.5% Lock ($2,427.25), 2.5% Upkeep ($127.75)" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Static PWA runs completely offline in airplane mode", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Escrow unlocks pro-rata refund upon missed heartbeat", status: "Met" },
      { code: "O", label: "Open Source", evidence: "Fully auditable AGPL-3.0 repository", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Zero knowledge architecture; even 0G nodes store ciphertext only", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Instant export to raw Markdown folder with YAML frontmatter", status: "Met" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "Argon2id client derivation verified across 2,800 vaults", proof: "0x77ba…1100" },
    ],
    architecture: {
      databaseEngine: "LibSQL / SQLite WASM with encrypted client VFS",
      inferenceEngine: "Local Ollama / Web-LLM (Llama-3.2-1B in WebGPU)",
      storageRuntime: "Origin Private File System (OPFS) + 0G ciphertext blobs",
    },
    zeroGIntegration: {
      storageTurboEndpoint: "https://indexer-storage-testnet-turbo.0g.ai",
      stateRootCadence: "24-hour encrypted CRDT snapshot root",
      servingBrokerAddress: "0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939",
      computeModel: "0gm-1.0-35b-a3b",
      brokerTrustMode: "private (confidential synthesis)",
    },
    stewardship: {
      opsPercent: 30,
      contingencyPercent: 20,
      reviewLockPercent: 47.5,
      upkeepFeePercent: 2.5,
      monthlyOpsUsd: "$1,533",
      monthlyContingencyUsd: "$1,022",
      monthlyReviewLockUsd: "$2,427.25",
      monthlyUpkeepUsd: "$127.75",
    },
    governance: {
      escrowContract: "0x77ba1100fA8c89b21A11c002231A990114dD8821",
      weeklyProposalLimit: "1 proposal per 7 days",
      maxContingencyTranche: "20% vault ceiling ($204.40 max per fix)",
      votingPeriodHours: 72,
      votingWeights: { free: 0, pro: 1, premium: 3 },
    },
  },
  {
    slug: "forgeops",
    name: "ForgeOps",
    tagline: "Local-first GitOps runner with automated 0G Storage commit anchoring.",
    pitch: "ForgeOps is a sovereign GitOps engine built on Forgejo. It enables developers to host local git repositories, trigger hermetic CI workflows, and immutably anchor commit packfiles, tags, and signed deployment manifests directly onto 0G Storage Turbo with smart contract validation.",
    category: "Developer Tools",
    imageUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=600&q=80",
    stage: 2,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: true },
    capitalReleasedPct: 70,
    mrr: "$5,420",
    vault: "$38,500",
    backers: 275,
    status: "live",
    friends: 88,
    score: 95,
    license: "GPL-3.0",
    repoUrl: "https://github.com/forgejo/forgejo",
    heartbeatUptime: "99.96%",
    escrowAddress: "0x618991D328C66f44C1b5BfAc2dE1644c10AA89b21",
    pricing: {
      free: { name: "Preview Tier", price: "$0", period: "Free daily", quota: "Mirror up to 3 local git repositories with public commit anchoring" },
      pro: { name: "Pro Monthly", price: "$10", period: "/ month", quota: "Unlimited repos, automated 0G packfile anchoring, TEE build attestation" },
      premium: { name: "Premium Annual", price: "$7", period: "/ year", quota: "Continuous multi-branch 0G mirroring, GPG signature attestation on Galileo" },
    },
    details: [
      { label: "Git Engine", value: "Forgejo / Gitea Core with Smart HTTP & packfile streaming" },
      { label: "Storage", value: "0G Storage Turbo Layer (Chunked Git Objects)" },
      { label: "CI Verifier", value: "0G Private Computer (Reproducible Build Proofs)" },
      { label: "Stewardship", value: "30% Ops ($1,626), 20% Cont ($1,084), 47.5% Lock ($2,574.50), 2.5% Upkeep ($135.50)" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Git packfiles distributed across 0G decentralized storage nodes", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Escrow funds locked until verifiable packfile hashes match", status: "Met" },
      { code: "O", label: "Open Source", evidence: "GPL-3.0 community codebase with zero proprietary dependencies", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Zero tracking of clones, commits, or code content", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Standard git clone compatible with any local Git client", status: "Met" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "18,400 git commit packfiles anchored to 0G Turbo Layer", proof: "0x61ac…9941" },
      { date: "Nov 4, 2026", message: "Hermetic container build verified inside 0G TEE enclave", proof: "0x33aa…bb12" },
    ],
    architecture: {
      databaseEngine: "SQLite 3 (WAL mode) / LibSQL embedded server",
      inferenceEngine: "Local Ollama / llama.cpp (deepseek-coder:6.7b)",
      storageRuntime: "Local filesystem git bare repos + 0G Turbo packfiles",
    },
    zeroGIntegration: {
      storageTurboEndpoint: "https://indexer-storage-testnet-turbo.0g.ai",
      stateRootCadence: "Post-push commit tree root anchoring",
      servingBrokerAddress: "0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939",
      computeModel: "0gm-1.0-35b-a3b",
      brokerTrustMode: "private (reproducible build verification)",
    },
    stewardship: {
      opsPercent: 30,
      contingencyPercent: 20,
      reviewLockPercent: 47.5,
      upkeepFeePercent: 2.5,
      monthlyOpsUsd: "$1,626",
      monthlyContingencyUsd: "$1,084",
      monthlyReviewLockUsd: "$2,574.50",
      monthlyUpkeepUsd: "$135.50",
    },
    governance: {
      escrowContract: "0x618991D328C66f44C1b5BfAc2dE1644c10AA89b21",
      weeklyProposalLimit: "1 proposal per 7 days",
      maxContingencyTranche: "20% vault ceiling ($216.80 max per fix)",
      votingPeriodHours: 72,
      votingWeights: { free: 0, pro: 1, premium: 3 },
    },
  },
  {
    slug: "tracevector",
    name: "TraceVector",
    tagline: "Agentic telemetry & embedded log vector database with DuckDB & LanceDB.",
    pitch: "TraceVector aggregates telemetry, system logs, and agent traces without cloud fees. It parses unstructured logs, computes dense semantic embeddings locally, and executes zero-copy analytical SQL queries via DuckDB, creating verifiable daily state roots on 0G Storage Turbo.",
    category: "Developer Tools",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    stage: 2,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: true },
    capitalReleasedPct: 70,
    mrr: "$6,150",
    vault: "$44,200",
    backers: 298,
    status: "live",
    friends: 94,
    score: 97,
    license: "MPL-2.0",
    repoUrl: "https://github.com/vectordotdev/vector",
    heartbeatUptime: "99.97%",
    escrowAddress: "0x88bb33aa11002231A990114dD88214b7c89ab99c",
    pricing: {
      free: { name: "Preview Tier", price: "$0", period: "Free daily", quota: "Ingest up to 50,000 log events/day locally in DuckDB" },
      pro: { name: "Pro Monthly", price: "$10", period: "/ month", quota: "Unlimited local ingestion, semantic trace search, daily 0G checkpoints" },
      premium: { name: "Premium Annual", price: "$7", period: "/ year", quota: "Cross-organization anomaly clustering, encrypted 0G Parquet archiving" },
    },
    details: [
      { label: "Data Pipeline", value: "Vector (Rust) + Apache Arrow zero-copy memory buffers" },
      { label: "OLAP & Vector Engine", value: "DuckDB (Columnar SQL) + LanceDB (Disk Vector Index)" },
      { label: "Storage", value: "0G Storage Turbo Layer (Compressed Parquet Leaves)" },
      { label: "Stewardship", value: "30% Ops ($1,845), 20% Cont ($1,230), 47.5% Lock ($2,921.25), 2.5% Upkeep ($153.75)" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Telemetry logs run in local container with zero central vendor dependency", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Automated escrow killswitch refunds users if telemetry collector halts", status: "Met" },
      { code: "O", label: "Open Source", evidence: "MPL-2.0 and Apache-2.0 licensed components", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Zero raw log events leave client network; only cryptographic Merkle roots posted", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Direct export to standard Apache Parquet and Lance datasets", status: "Met" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "12,000,000 trace logs compacted to 0G Parquet Merkle tree", proof: "0x91df…221a" },
      { date: "Nov 5, 2026", message: "Zero-copy LanceDB vector search benchmark verified", proof: "0x44ce…8812" },
    ],
    architecture: {
      databaseEngine: "DuckDB (columnar SQL) + LanceDB (vector index)",
      inferenceEngine: "ONNX Runtime Web / local llama.cpp (bge-small-en-v1.5 embeddings)",
      storageRuntime: "Local Arrow IPC memory buffers + local NVMe disk",
    },
    zeroGIntegration: {
      storageTurboEndpoint: "https://indexer-storage-testnet-turbo.0g.ai",
      stateRootCadence: "Daily telemetry Merkle root snapshot",
      servingBrokerAddress: "0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939",
      computeModel: "0gm-1.0-35b-a3b",
      brokerTrustMode: "private (confidential cross-org clustering)",
    },
    stewardship: {
      opsPercent: 30,
      contingencyPercent: 20,
      reviewLockPercent: 47.5,
      upkeepFeePercent: 2.5,
      monthlyOpsUsd: "$1,845",
      monthlyContingencyUsd: "$1,230",
      monthlyReviewLockUsd: "$2,921.25",
      monthlyUpkeepUsd: "$153.75",
    },
    governance: {
      escrowContract: "0x88bb33aa11002231A990114dD88214b7c89ab99c",
      weeklyProposalLimit: "1 proposal per 7 days",
      maxContingencyTranche: "20% vault ceiling ($246 max per fix)",
      votingPeriodHours: 72,
      votingWeights: { free: 0, pro: 1, premium: 3 },
    },
  },
  {
    slug: "docusovereign",
    name: "DocuSovereign",
    tagline: "Local-first knowledge agent with embedded LanceDB & 0G Storage sync.",
    pitch: "DocuSovereign is a private RAG workstation built on AnythingLLM. Ingest PDFs, research papers, and technical docs into local vector stores. Run queries through local Ollama or 0G TEE inference with zero cloud telemetry or data leakage.",
    category: "Knowledge Base",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    stage: 2,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: true },
    capitalReleasedPct: 70,
    mrr: "$7,890",
    vault: "$51,300",
    backers: 382,
    status: "live",
    friends: 104,
    score: 97,
    license: "MIT",
    repoUrl: "https://github.com/Mintplex-Labs/anything-llm",
    heartbeatUptime: "99.98%",
    escrowAddress: "0x99ce12a989ee77fa4b7c89ab1120002231aa9901",
    pricing: {
      free: { name: "Preview Tier", price: "$0", period: "Free daily", quota: "Query up to 10 local documents with 1.271 iAI daily preview credits" },
      pro: { name: "Pro Monthly", price: "$10", period: "/ month", quota: "Unlimited documents, local LanceDB vector search, automated 0G backup" },
      premium: { name: "Premium Annual", price: "$7", period: "/ year", quota: "Multi-device encrypted vector sync, dedicated 0G TEE reasoning node" },
    },
    details: [
      { label: "RAG Engine", value: "AnythingLLM Core + LanceDB embedded vector storage" },
      { label: "Storage", value: "0G Storage Turbo Layer (Encrypted Vector Chunks)" },
      { label: "Inference", value: "Local Ollama (llama3.2:3b) + 0G Serving Broker TEE" },
      { label: "Stewardship", value: "30% Ops ($2,367), 20% Cont ($1,578), 47.5% Lock ($3,747.75), 2.5% Upkeep ($197.25)" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Client executes entirely locally; works 100% offline without internet connection", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Missed heartbeat releases pro-rata refund from escrow vault", status: "Met" },
      { code: "O", label: "Open Source", evidence: "Permissive MIT license upstream repository", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Zero document tokens transmitted to commercial OpenAI/Anthropic APIs", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Full raw vector embedding and markdown dump exportable in 1 click", status: "Met" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "450,000 document vector embeddings verified on 0G Storage", proof: "0x77cd…3319" },
    ],
    architecture: {
      databaseEngine: "LanceDB embedded vector store + SQLite metadata catalog",
      inferenceEngine: "Ollama (llama3.2:3b) with WebGPU fallback",
      storageRuntime: "Client filesystem + AES-256 encrypted 0G Turbo snapshots",
    },
    zeroGIntegration: {
      storageTurboEndpoint: "https://indexer-storage-testnet-turbo.0g.ai",
      stateRootCadence: "Daily encrypted document index root",
      servingBrokerAddress: "0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939",
      computeModel: "0gm-1.0-35b-a3b",
      brokerTrustMode: "private (sealed confidential document reasoning)",
    },
    stewardship: {
      opsPercent: 30,
      contingencyPercent: 20,
      reviewLockPercent: 47.5,
      upkeepFeePercent: 2.5,
      monthlyOpsUsd: "$2,367",
      monthlyContingencyUsd: "$1,578",
      monthlyReviewLockUsd: "$3,747.75",
      monthlyUpkeepUsd: "$197.25",
    },
    governance: {
      escrowContract: "0x99ce12a989ee77fa4b7c89ab1120002231aa9901",
      weeklyProposalLimit: "1 proposal per 7 days",
      maxContingencyTranche: "20% vault ceiling ($315.60 max per fix)",
      votingPeriodHours: 72,
      votingWeights: { free: 0, pro: 1, premium: 3 },
    },
  },
  {
    slug: "flowstate",
    name: "FlowState",
    tagline: "Offline workflow engine & deterministic agent runner with n8n core.",
    pitch: "FlowState is a sovereign DAG automation engine based on n8n and Temporal Lite. Create visual multi-step agent automations, webhook consumers, and local tool loops with guaranteed deterministic execution and zero cloud subscriptions.",
    category: "Developer Tools",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    stage: 2,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: true },
    capitalReleasedPct: 70,
    mrr: "$4,980",
    vault: "$35,600",
    backers: 245,
    status: "live",
    friends: 79,
    score: 94,
    license: "Fair-code",
    repoUrl: "https://github.com/n8n-io/n8n",
    heartbeatUptime: "99.95%",
    escrowAddress: "0x44aa8812fa1102de892acc4111ff4421b2b26438",
    pricing: {
      free: { name: "Preview Tier", price: "$0", period: "Free daily", quota: "Execute up to 50 active workflows locally on desktop" },
      pro: { name: "Pro Monthly", price: "$10", period: "/ month", quota: "Unlimited local workflows, webhook triggers, 0G Turbo state backups" },
      premium: { name: "Premium Annual", price: "$7", period: "/ year", quota: "Multi-agent orchestration loops, priority 0G TEE broker compute routing" },
    },
    details: [
      { label: "Engine", value: "n8n Embedded Engine + SQLite transaction log" },
      { label: "Storage", value: "0G Storage Turbo Layer (DAG State Roots)" },
      { label: "Inference", value: "LocalAI / Ollama tool call routing + 0G TEE broker" },
      { label: "Stewardship", value: "30% Ops ($1,494), 20% Cont ($996), 47.5% Lock ($2,365.50), 2.5% Upkeep ($124.50)" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Workflows execute purely on local machine with no central cloud killswitch", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Escrow funds locked until verifiable execution receipts match", status: "Met" },
      { code: "O", label: "Open Source", evidence: "Transparent open source codebase with full auditability", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "API credentials and webhook payloads encrypted in local memory", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Export workflows as standard JSON portable to any n8n or Node.js runtime", status: "Met" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "68,000 deterministic workflow executions logged on 0G", proof: "0x22ab…88ff" },
    ],
    architecture: {
      databaseEngine: "SQLite WASM / PGlite deterministic transactional state log",
      inferenceEngine: "Ollama / LocalAI edge tool router",
      storageRuntime: "Local container filesystem + 0G Turbo encrypted state",
    },
    zeroGIntegration: {
      storageTurboEndpoint: "https://indexer-storage-testnet-turbo.0g.ai",
      stateRootCadence: "Post-execution DAG state root checkpoint",
      servingBrokerAddress: "0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939",
      computeModel: "0gm-1.0-35b-a3b",
      brokerTrustMode: "private (isolated tool calling)",
    },
    stewardship: {
      opsPercent: 30,
      contingencyPercent: 20,
      reviewLockPercent: 47.5,
      upkeepFeePercent: 2.5,
      monthlyOpsUsd: "$1,494",
      monthlyContingencyUsd: "$996",
      monthlyReviewLockUsd: "$2,365.50",
      monthlyUpkeepUsd: "$124.50",
    },
    governance: {
      escrowContract: "0x44aa8812fa1102de892acc4111ff4421b2b26438",
      weeklyProposalLimit: "1 proposal per 7 days",
      maxContingencyTranche: "20% vault ceiling ($199.20 max per fix)",
      votingPeriodHours: 72,
      votingWeights: { free: 0, pro: 1, premium: 3 },
    },
  },
  {
    slug: "memstate",
    name: "MemState",
    tagline: "Sovereign agent memory & state sync engine with Mem0 & Letta core.",
    pitch: "MemState is a long-term hierarchical memory layer for AI agents. It gives agents persistent episodic recall, working memory, and cross-application state without sending conversation graphs to closed servers. Anchored to 0G Storage Turbo with cryptographic state proofs.",
    category: "Developer Tools",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    stage: 2,
    maxStages: 3,
    cropsMet: { c: true, r: true, o: true, p: true, s: true },
    capitalReleasedPct: 70,
    mrr: "$8,420",
    vault: "$56,100",
    backers: 395,
    status: "live",
    friends: 114,
    score: 98,
    license: "Apache-2.0",
    repoUrl: "https://github.com/mem0ai/mem0",
    heartbeatUptime: "99.98%",
    escrowAddress: "0x7c71CA13277Ff762d4Dc7701153badA8AB7C65DA",
    pricing: {
      free: { name: "Preview Tier", price: "$0", period: "Free daily", quota: "Retain up to 2,000 semantic agent memories locally in SQLite" },
      pro: { name: "Pro Monthly", price: "$10", period: "/ month", quota: "Unlimited memories, hierarchical graph extraction, 0G state sync" },
      premium: { name: "Premium Annual", price: "$7", period: "/ year", quota: "Multi-agent cross-synchronization, automated TEE memory distillation" },
    },
    details: [
      { label: "Memory Graph", value: "Mem0 Core + LibSQL graph triples + LanceDB vectors" },
      { label: "Storage", value: "0G Storage Turbo Layer (Encrypted Episodic Roots)" },
      { label: "Distillation", value: "0G Serving Broker (0gm-1.0-35b-a3b, TEE sealed)" },
      { label: "Stewardship", value: "30% Ops ($2,526), 20% Cont ($1,684), 47.5% Lock ($3,999.50), 2.5% Upkeep ($210.50)" },
    ],
    cropsEvidence: [
      { code: "C", label: "Censorship-Resistant", evidence: "Memory database lives on user's device; no SaaS lock-in or account freezing", status: "Met" },
      { code: "R", label: "Resistant", evidence: "Escrow funds locked until verifiable memory checkpoints match", status: "Met" },
      { code: "O", label: "Open Source", evidence: "Apache-2.0 permissive upstream codebase", status: "Met" },
      { code: "P", label: "Privacy-First", evidence: "Zero third-party retention; memory embeddings encrypted client-side", status: "Met" },
      { code: "S", label: "Sovereign Exit", evidence: "Complete export to standard SQLite and JSON graph triples", status: "Met" },
    ],
    attestationLogs: [
      { date: "Nov 6, 2026", message: "2,100,000 agent episodic memories synced to 0G Turbo", proof: "0x88cc…44bb" },
      { date: "Nov 4, 2026", message: "Confidential TEE memory consolidation attested on Galileo", proof: "0x11ee…77cc" },
    ],
    architecture: {
      databaseEngine: "LibSQL / SQLite + LanceDB embedded vector storage",
      inferenceEngine: "llama.cpp / Ollama memory summarizer (hermes-3-llama-3.1:8b)",
      storageRuntime: "Local client filesystem + AES-256 0G Turbo snapshots",
    },
    zeroGIntegration: {
      storageTurboEndpoint: "https://indexer-storage-testnet-turbo.0g.ai",
      stateRootCadence: "Epoch memory snapshot root",
      servingBrokerAddress: "0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939",
      computeModel: "0gm-1.0-35b-a3b",
      brokerTrustMode: "private (confidential TEE memory distillation)",
    },
    stewardship: {
      opsPercent: 30,
      contingencyPercent: 20,
      reviewLockPercent: 47.5,
      upkeepFeePercent: 2.5,
      monthlyOpsUsd: "$2,526",
      monthlyContingencyUsd: "$1,684",
      monthlyReviewLockUsd: "$3,999.50",
      monthlyUpkeepUsd: "$210.50",
    },
    governance: {
      escrowContract: "0x7c71CA13277Ff762d4Dc7701153badA8AB7C65DA",
      weeklyProposalLimit: "1 proposal per 7 days",
      maxContingencyTranche: "20% vault ceiling ($336.80 max per fix)",
      votingPeriodHours: 72,
      votingWeights: { free: 0, pro: 10, premium: 84 },
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProducts(): Product[] {
  return products;
}
