# STATUS — evidence only (last update Fri Nov 6, ~02:45 AM IST)

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
| Official 0G skills | Installed locally, gitignored | `https://build.0g.ai/install` with `--agent cursor --parts compute,storage,chain --yes`. 25 skills in `.0g-skills`. ~02:40 AM IST. |
| SDK pin | Root `package.json` | `@0gfoundation/0g-storage-ts-sdk` ^1.2.13, `@0gfoundation/0g-compute-ts-sdk` ^0.9.0, `ethers` 6.13.1 exact. |
| Chain id hex | Settled | Decimal 16602. Live `eth_chainId` was `0x40da`. `0x40EA` was wrong. |
| Storage path | Indexer plus chain RPC | `storagerpc-testnet.0g.ai` does not resolve. Indexer `GET /file` returned 200 at ~02:15 AM IST. |
| Private Computer router | TLS failed from this machine | `router-api-testnet.integratenetwork.work` handshake failed. ~02:15 AM IST. No models list. |
| Foundry Cancun | Set | `contracts/foundry.toml` `evm_version = "cancun"`, solc 0.8.19. 10/10 tests passed ~02:20 AM IST with `C:\Users\acer\.foundry\bin\forge.exe`. |
| Next.js app | Implemented & verified | Full-stack Next.js 14 dApp in `app/` (Wagmi v2, 0G Galileo 16602, 0G Storage Turbo Indexer, 0G Private Computer TEE auditor, CROPS killswitch rehearsal). `npm run build` verified clean (6/6 static/dynamic routes). Pushed in commit `9d9a11a` on `anti-gravity`. |
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
