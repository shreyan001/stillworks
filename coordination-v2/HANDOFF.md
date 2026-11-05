# HANDOFF — checkpoint for model or session swap

```
Checkpoint:          Fri Nov 6, ~03:45 AM IST · crewmate-scout (architectural audit)
Goal:                Complete architectural audit, backend necessity analysis, Arkiv strategy, and master handover for Cursor and First Mate
Verified state:      
- Contracts: 10/10 tests passing in contracts/test/ (ProductRegistry.t.sol & SubscriptionFlow.t.sol) via Solc 0.8.19 Cancun.
- Deploy script: DeployGalileo.s.sol configured for Galileo (16602) using PRIVATE_KEY.
- Frontend: app/ compiles with output: 'export'. Page.tsx implements pure client-side 0G Storage MemData/Indexer.
- Discrepancy discovered: app/src/lib/contracts/abis.ts does not match contracts/src/ contracts; StorageExplorer & ComputeAuditor have legacy /api/* calls that must be client-side.
- Strategy brief created: coordination-v2/HANDOFF_AND_STRATEGY.md.
Approved decisions:  
- Pure client-side zero-backend architecture for user storefront (CROPS compliance).
- Founder heartbeats handled via lightweight external script (scripts/heartbeat-daemon.mjs).
- Arkiv maintained as P1 stretch; Rabdi testnet RPC verified live (Chain ID 7794095).
Proposals pending:   InvoiceRegistry.sol implementation (Work Order 1 in HANDOFF_AND_STRATEGY.md)
Open questions for shreyan:  Provision Arkiv faucet funds and Hub access key when entering Phase 3.
Unknowns / research in flight: 0G Private Computer router TLS stability from dev machine; local TEE simulation fallback verified in compute.ts.
Contradictions open: app/src/lib/contracts/abis.ts vs contracts/src/*.sol (documented in HANDOFF_AND_STRATEGY.md Section 4).
Artifacts:           coordination-v2/HANDOFF_AND_STRATEGY.md, coordination-v2/HANDOFF.md
Next action:         Cursor executes Work Order 1 (InvoiceRegistry.sol) and Work Order 3 (ABI alignment).
Don't do:            Do not introduce a centralized user backend; do not spend 0G testnet balance until broadcasting authorized.
```
