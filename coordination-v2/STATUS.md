# STATUS — evidence only (last update Fri Nov 6, ~02:20 AM IST)

No percentages. Each line has evidence or says unknown.

| Item | State | Evidence |
|---|---|---|
| Repo created | Confirmed | `https://github.com/shreyan001/stillworks`, pushed commits `ee32d99`, `5168a96`, `b9d50e3` |
| Core contracts | Implemented | `ProductRegistry.sol`, `SubscriptionAgreement.sol`, `SubscriptionEscrow.sol` |
| Unit tests | 10/10 Passing | `contracts/test/ProductRegistry.t.sol` (4), `contracts/test/SubscriptionFlow.t.sol` (6) |
| Galileo deploy script | Implemented | `contracts/script/DeployGalileo.s.sol` compiled with solc 0.8.19 |
| Multi-agent architecture | Active | 3 Agent Pages created: `cursor`, `anti-gravity`, `freebuf` |
| Primary coordination point | Cursor Agent | Defined in `coordination-v2/agents/cursor.md` |
| Deployer wallet | 0.1 0G on Galileo | Live `eth_getBalance` ~02:15 AM IST: `100000000000000000` wei for `0x237eA22D38a1e20EC50b39711014B9C87dBb21c7`. Chain id `0x40da` (16602). Private key is in local `.env` and is not in git. |
| Storage indexer | Host up, root is not a page | `indexer-storage-testnet-turbo.0g.ai` DNS ok. `GET /` = 404. `GET /file` = 200. ~02:15 AM IST. |
| Storage RPC hostname | Does not resolve | `storagerpc-testnet.0g.ai` DNS name does not exist. ~02:15 AM IST. Upload skill uses the chain RPC plus the indexer. |
| Private Computer router | TLS failed from this machine | `router-api-testnet.integratenetwork.work` handshake failed. ~02:15 AM IST. No models list. |
| 0G SDKs | Installed in `infra/` | storage `1.2.13`, compute `0.9.0`, `ethers` `6.13.1`. `npm install` added 325 packages. ~02:20 AM IST. |
| Contract tests after Cancun | 10/10 passing | `forge test` with `C:\Users\acer\.foundry\bin\forge.exe`, solc 0.8.19, `evm_version = cancun`. ~02:20 AM IST. |
| Foundry binary | Two copies | Cargo `forge` is March 2023. Use `C:\Users\acer\.foundry\bin\forge.exe` (build 2024-10-26). |
| Live deploy | Not authorized | `coordination-v2/COMMANDS.md` |
| Submission deadline | Sat Nov 7, 9:00 AM IST | Hackathon rules (target 7:30 AM IST) |

## Active Agent Branches & Roles
- **`cursor`:** Lead coordination agent and architectural clearinghouse.
- **`anti-gravity`:** Deployment & infrastructure agent (Galileo deployment script owner).
- **`freebuf`:** Protocol security audit, 0G PC inference harness, and off-chain data integrity.

## Decisions
- Nov 6 01:23 IST: Repo URL confirmed as `https://github.com/shreyan001/stillworks` (shreyan).
- Nov 6 01:32 IST: Three separate agent branches established (`cursor`, `anti-gravity`, `freebuf`) with Cursor as central coordination point (shreyan).
- Nov 6 01:32 IST: Testing tokens and live chain deployment deferred while focus is placed on the three agent workspaces and iterative smart contract lifecycle (shreyan).
