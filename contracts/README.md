# contracts/
Foundry project for Stillworks on 0G Galileo (Chain ID: 16602).

## Run Tests
```bash
forge test
```

## Contracts
- `src/ProductRegistry.sol`: Listing registry with founder/steward controls, 0G Storage passport root, frontend root, and founder heartbeat attestation.
- `src/SubscriptionAgreement.sol`: Bilateral agreement recording product terms, subscriber, period length, grace window, and walkaway bundle root.
- `src/SubscriptionEscrow.sol`: Holds locked subscriber funds, sequential release to founder per attested period, and pro-rata instant refund when heartbeat misses past the grace window.
- `src/InvoiceRegistry.sol` *(Stage 3)*: Non-transferable receipt NFT/record storing heartbeatTx and 0G Private Computer auditRequestId.

## Test Suites
- `test/ProductRegistry.t.sol`: Registration, steward approvals, proposal lifecycle, heartbeat monotonicity.
- `test/SubscriptionFlow.t.sol`: Agreement lifecycle, funding, sequential releases, walkaway requests, and pro-rata refund on missed heartbeat.
