# RESOURCES

Source: `/workspace/stillworks/LINKS.md` (researcher-checked Nov 5) unless marked.

## Scope + planning
- Data room Page (scope source of truth): https://cursor.com/canvas/store-06dd6927-e24f-45af-95a0-cbaa5e74b995/b1c77045-8ce3-4613-9165-74301a26bfab
- Coding agent prompt: `/workspace/stillworks/AGENT_PROMPT.md`
- Data room (Markdown copy): `dataroom/data-room-canvas.md`
- Old data room site (⚠️ login-gated, not captured): https://sovereign-software-ethglobal-mumbai-data-fv2l.pages.grok.bot/
- Repo: `stillworks` (MIT) — ⚠️ URL to add once created

## Prize pages (✅ fetched with curl Thu Nov 5)
- EF Best CROPS App: https://ethglobal.com/events/mumbai/prizes/ethereum-foundation
- 0G: https://ethglobal.com/events/mumbai/prizes/0g
- Arkiv: https://ethglobal.com/events/mumbai/prizes/arkiv
- All prizes: https://ethglobal.com/events/mumbai/prizes

## 0G Galileo testnet (chain)
- Chain ID: **16602**
- RPC: https://evmrpc-testnet.0g.ai
- Explorer: https://chainscan-galileo.0g.ai
- Faucet: https://faucet.0g.ai (0.1 0G/day)
- Docs: https://docs.0g.ai/developer-hub/testnet/testnet-overview

## 0G Private Computer (OpenAI-compatible)
- API keys: https://pc.0g.ai · testnet UI: https://pc.testnet.0g.ai
- Mainnet base URL: https://router-api.0g.ai/v1
- Testnet base URL: https://router-api-testnet.integratenetwork.work/v1
- Router overview: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/router/overview
- Quickstart: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/router/quickstart
- Chat completions: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/router/features/chat-completions
- Request IDs: https://0gfoundation.github.io/0g-router/ — log `X-Request-ID` / `x_0g_trace.request_id`; optional `X-Client-Request-Id`
- Models (from data room, ⚠️ not checked): `0gm-1.0` audits, qwen vision, whisper-large-v3
- Package: `openai` (npm)

## 0G Storage
- SDK docs: https://docs.0g.ai/developer-hub/building-on-0g/storage/sdk
- npm: `@0gfoundation/0g-storage-ts-sdk` + `ethers`
- Testnet indexer: https://indexer-storage-testnet-turbo.0g.ai

## Privy / iAI bonus (✅ prize page)
- 0G shares the Privy app ID; works only on localhost:3000 / 3001 / 5173. Use team credits.

## Arkiv (Rabdi testnet)
- Docs: https://docs.arkiv.network
- Network: https://docs.arkiv.network/networks/rabdi/ (chain ID **7794095**)
- RPC: https://rpc.rabdi.db-chain.testnet.arkiv.network
- Explorer: https://rabdi.explorer.arkiv.network
- Faucet: https://hub.arkiv.network/faucet
- Access keys (public RPC rate-limited): https://hub.arkiv.network/access-keys
- npm: `@arkiv-network/sdk` + `viem`

## Coordination tools (✅ READMEs read)
- firstmate: https://github.com/kunchenguid/firstmate
- lavish-axi: https://github.com/kunchenguid/lavish-axi (npm `lavish-axi`)

## Build tooling (⚠️ standard, not version-checked)
- Foundry (`forge build`, `forge test`), pnpm, docker compose (walkaway demo)

## Setup checklist (accounts + keys)
- [ ] GitHub account + `gh auth login` (needed by firstmate)
- [ ] Deployer wallet (fresh, testnet only) — private key in local `.env`, gitignored
- [ ] 0G Galileo faucet funds
- [ ] 0G PC API key (pc.0g.ai / testnet UI)
- [ ] 0G team credits + Privy app ID (from 0G team)
- [ ] Arkiv faucet funds + access key
- [ ] Heartbeat signer wallet (separate key)
- [ ] Telegram + X handles for submission
- [ ] Video host (YouTube unlisted or similar ⚠️ check ETHGlobal accepted hosts)
- [ ] ETHGlobal dashboard login for the submission form
