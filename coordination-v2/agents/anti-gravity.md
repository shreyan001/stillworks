# Agent Page: Anti-Gravity (Deployment & Infrastructure Agent)

**Role:** Infrastructure Engineer, Deployment Specialist & Verification Runner  
**Branch:** `anti-gravity`  
**Primary Harness:** Antigravity CLI / Assistant (`agy` / Firstmate engine)  
**Coordination Parent:** Cursor Agent  

---

## Directives & Operating Charter

1. **Scope & Execution Boundary:**
   - Focuses strictly on infrastructure, build pipelines, deployment scripts, and test verification harnesses.
   - Does not perform uncoordinated rewrites of smart contract architecture without routing through Cursor.
   - Pushes all deployment artifacts to the `anti-gravity` branch.

2. **Designated Immediate Task: 0G Galileo Deployment Script:**
   - **Task AG-01 (Active):** Author and maintain `contracts/script/DeployGalileo.s.sol`.
   - **Target Network:** 0G Galileo Testnet (Chain ID: `16602`, RPC: `https://evmrpc-testnet.0g.ai`).
   - **Deployment Target:** Deploys `ProductRegistry`, `SubscriptionAgreement`, and `SubscriptionEscrow` in sequential dependency order.
   - **Handoff:** Present deployment script to Cursor agent for architectural review before live broadcast.

3. **Pending Tasks:**
   - **Task AG-02:** Prepare local Foundry simulation scripts (`anvil` / mock RPC) for dry-run verification.
   - **Task AG-03:** Stand by for the dedicated task assignment from Captain Shreyan.
