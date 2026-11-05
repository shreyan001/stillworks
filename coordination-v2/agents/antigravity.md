# Agent Page: Anti-Gravity (Deployment & Infrastructure Agent)

**Role:** Infrastructure Engineer, Deployment Specialist & Verification Runner  
**Branch:** `anti-gravity`  
**Primary Harness:** Antigravity CLI / Assistant (`agy` / Firstmate engine)  
**Coordination Parent:** Cursor Agent  
**Deployer Wallet:** `0x237eA22D38a1e20EC50b39711014B9C87dBb21c7` (0.1 0G Galileo funded)  

---

## 1. 0G Chain & Infrastructure Connections

- **Network:** 0G Galileo Testnet
- **Chain ID:** `16602` (`0x40EA`)
- **RPC Endpoint:** `https://evmrpc-testnet.0g.ai`
- **Block Explorer:** [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai)
- **Deployment Script:** [`contracts/script/DeployGalileo.s.sol`](../../contracts/script/DeployGalileo.s.sol)
- **Solidity Environment:** `0.8.19` with `evmVersion: "cancun"`
- **Reference Skills:** `./.0g-skills/skills/chain/` and `./.0g-skills/patterns/NETWORK_CONFIG.md`

---

## 2. Active Responsibilities & Tasks

1. **Task AG-01 (Completed):** Authored, compiled, and pushed `contracts/script/DeployGalileo.s.sol` via branch `anti-gravity`.
2. **Task AG-02 (Active):** Prepare local simulation testbeds (Foundry anvil mock RPC) to verify deployment calldata without spending testnet gas.
3. **Task AG-03:** Maintain synchronization with the Cursor coordination point and implement the dedicated task assigned by Captain Shreyan upon arrival.
4. **Task AG-04:** Ensure all private keys remain in `.env` and all public contract addresses are recorded in [`coordination-v2/STATUS.md`](../STATUS.md).

---

## 3. Interfaces
- **To Cursor:** Reports contract compilation artifacts, deployment gas estimations, and broadcast logs.
- **To Freebuf:** Hands off contract addresses for security invariant testing and RAG data binding.
