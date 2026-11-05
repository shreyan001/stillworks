# REFERENCE — 0G facts collected Thu Nov 5, ~11:35 PM IST (evidence only; NOT a plan, NOT approved scope)

Three separate things. Separate endpoints, separate money.

## A. 0G Chain (contracts) ✅
- Galileo testnet: chain ID **16602**, RPC `https://evmrpc-testnet.0g.ai` (development only), explorer `https://chainscan-galileo.0g.ai`, token 0G.
- Faucet: `https://faucet.0g.ai` or Google Cloud faucet `https://cloud.google.com/application/web3/faucet/0g/galileo` — **0.1 0G/day per wallet**; more via 0G Discord.
- Mainnet (don't use for hackathon unless decided): chain 16661, RPC `https://evmrpc.0g.ai`.
- Compiler: Builder Hub says Solidity 0.8.19, `evmVersion: cancun`.
- Starter: `0gfoundation/0g-deployment-scripts` (Hardhat/Foundry/Truffle, ERC20 example). ⚠️ Its README still says chain **16601** (last commit May 15, 2025) → set **16602** yourself.
- Full-stack example (not an official scaffold for us): `0gfoundation/agenticID-examples` ex. 01 — Next.js + RainbowKit + wagmi + viem + Hardhat on Galileo.

## B. 0G Storage ✅
- Starter kits: `0g-storage-ts-starter-kit`, `0g-storage-web-starter-kit`, `0g-storage-go-starter-kit`.
- npm: docs use `@0gfoundation/0g-storage-ts-sdk` (npm latest 1.2.13); TS starter kit README names `@0gfoundation/0g-ts-sdk` (npm latest 1.2.8). ⚠️ Two names — unresolved.
- Testnet indexers: turbo `https://indexer-storage-testnet-turbo.0g.ai` (active); standard `https://indexer-storage-testnet-standard.0g.ai` (under maintenance). Turbo and standard are separate networks.
- Uploads cost gas in 0G (from wallet). Root hash = Merkle root (byte integrity only).
- Encryption in starter kit: AES-256 or ECIES.
- ⚠️ Unknown: an official way to host a static website from 0G Storage.

## C. 0G Private Computer / Compute Router ✅
- Web UI: mainnet `pc.0g.ai`, testnet `pc.testnet.0g.ai`. API: mainnet `https://router-api.0g.ai/v1`, testnet `https://router-api-testnet.integratenetwork.work/v1`. **Fully separate** balances and API keys.
- Steps: connect wallet (MetaMask/WalletConnect or Privy social login) → **deposit 0G** to the Payment Layer → create API key (`sk-…`, shown once) → OpenAI-compatible call.
- Payment Layer: testnet `0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939`, mainnet `0xA3b15Bd2aD18BFB6b5f92D8AA9F444Dd59d1cE32`.
- Billing: per token, quoted in neuron (1e18 = 1 0G), no subscriptions, no Router markup; prices from `GET /v1/models`. Balance check needs an `mk-` management key. Empty → `402 insufficient_balance`.
- Request ID: `X-Request-ID` = `x_0g_trace.request_id` = usage history ID. Billing reconciliation, **not attestation**.
- Trust: header `X-0G-Provider-Trust-Mode: standard | verified | private`. `standard` = non-verifiable; `verified` = TeeML/TeeTLS; `private` = TeeML only (sealed).
- Old compute-marketplace.0g.ai funds don't show in the Router balance (Advanced mode).
- Hackathon: 0G prize page says use "the 0G credits we give your team"; Privy app ID shared by 0G; iAI sign-in only on localhost:3000/3001/5173.

## Testnet vs paid
- Testnet: faucet 0G (free, 0.1/day) pays Chain gas, Storage gas, and testnet Router deposits ⚠️ (assumed: testnet Router uses testnet 0G — unconfirmed).
- Paid/mainnet: real 0G tokens. **Don't transact on mainnet without a decision.**

## Unknowns
1. How team credits from 0G are delivered (testnet or mainnet? to which wallet?).
2. Is 0.1 0G/day enough for deploy + storage + PC deposit?
3. Which models are on the testnet router, and do any support `private`/`verified`?
4. Frontend hosting on 0G Storage: official path or not.
5. Arkiv (Rabdi, chain 7794095) facts are from the earlier link pack, **not re-checked today**.
