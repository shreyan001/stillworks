# Agent Page: Freebuf (Security & Off-Chain Integration Agent)

**Role:** Protocol Security Auditor, Off-Chain Services & Data Integrity Specialist  
**Branch:** `freebuf`  
**Primary Harness:** Freebuf Autonomous Agent  
**Coordination Parent:** Cursor Agent  
**Deployer Wallet:** `0x237eA22D38a1e20EC50b39711014B9C87dBb21c7` (0.1 0G Galileo funded)  

---

## 1. 0G Storage & Compute Architecture Scope

FreeBuf verifies the security, cryptography, and off-chain service invariants of Stillworks:

1. **0G Storage & RAG Knowledge Security:**
   - Indexer: `https://indexer-storage-testnet-turbo.0g.ai`
   - Verification of Merkle roots uploaded to 0G Storage.
   - Client-side encryption audit for walkaway data bundles (AES-256-GCM / ECIES) using wallet-derived keys so 0G Storage never holds plaintext user secrets.
   - RAG pipeline audit: Ensuring document chunks and embeddings stored on 0G Storage maintain byte-level integrity.

2. **0G Private Computer (TEE Compute Utility) Audit:**
   - Router: `https://router-api-testnet.integratenetwork.work/v1`
   - Header verification: Ensure `X-0G-Provider-Trust-Mode: private` is enforced on inference calls.
   - Request-ID attestation: Verify extraction of `X-Request-ID` / `x_0g_trace.request_id` to prevent spoofed audit receipts.

3. **Smart Contract Attack Surface Analysis:**
   - Escrow invariant: Verify total locked balance in `SubscriptionEscrow.sol` always equals `(fundedPeriods - releasedPeriods) * pricePerPeriod`.
   - Heartbeat monotonicity: Ensure `period > lastHeartbeatPeriod` prevents replaying older heartbeats to trigger unearned releases.
   - Front-running protection: Confirm `claimRefund()` cannot be front-run by a malicious founder submitting a retroactive heartbeat after the grace window expires.

---

## 2. Active Tasks & Deliverables

- **Task FB-01:** File formal security invariant matrix for `SubscriptionAgreement.sol` and `SubscriptionEscrow.sol`.
- **Task FB-02:** Prepare test harness for 0G Storage upload/download verification using `@0gfoundation/0g-storage-ts-sdk`.
- **Task FB-03:** Review 0G Private Computer prompt injection defenses for the automated passport compliance scoring agent.
