# Stillworks: first prompt for the Cursor coding agent

You are helping me build **Stillworks** at ETHGlobal Mumbai 2026 (From Scratch track, started 9 PM IST Thu Nov 5, submission due 9 AM IST Sat Nov 7). Stillworks is sovereign software commerce: an open, private SaaS marketplace on 0G where buyers discover a product, see its product passport, subscribe with bilateral escrow, and can walk away with their data and code.

**Read first:** `START_HERE.md`, `ops/STATE.md`, `ops/RULES.md`, `ops/TASKS.md`, `ops/RESOURCES.md`, then `dataroom/data-room-canvas.md` (source of truth for scope and contract specs). `LINKS.md` has chain IDs, RPCs and SDKs.

The repo **already has the scaffold**: README.md (with `CROPS` draft), LICENSE (MIT), AI_LOG.md (first entry), .gitignore, .env.example, arkiv/ stubs, empty contracts/ and app/. Do not recreate these; extend them.

## Hard rules (compliance)
1. From Scratch: the repo starts empty tonight. Use only public libraries/SDKs, no prior code of mine.
2. AI attribution is required by ETHGlobal. Keep `AI_LOG.md` at the repo root. After every change you make, append one entry: time (IST), files touched, what you generated vs what I wrote or edited, and the prompt summary. Never skip it.
3. Commit small and often, with clear messages (`feat:`, `fix:`, `docs:`). Prefix AI-generated commits with `[ai]`, and include `[ai-assisted]` when I edited. Push after every working step so the history shows the build happening live.
4. I must make meaningful contributions myself. Before writing each contract, explain the design in 5 lines so I can decide and adjust; keep anything I change attributed to me in `AI_LOG.md`.
5. License: MIT. No third-party trackers or analytics in the client. Keys and personal data stay on the user's device.

## Prize requirements to build toward
- **EF Best CROPS App**: README section titled exactly `CROPS`, 1-2 lines each for Censorship resistance, Open source, Privacy, Security. Demo video under 3 min.
- **0G Private Computer**: 0G Private Computer inference (OpenAI-compatible client, pc.0g.ai) in the main flow, logging request IDs; README line on what breaks without 0G; contract addresses; live demo link.
- **Arkiv**: real write + read on Arkiv testnet via `@arkiv-network/sdk`; README with writer wallet and one runnable query; files `/arkiv/schema.md`, `/arkiv/friction.md`, `/arkiv/reach.md`, `/arkiv/why-arkiv.md`, `/arkiv/how-you-use-arkiv.md`.

## Do now, in order
1. Explain in plain words how ProductRegistry, SubscriptionAgreement, SubscriptionEscrow and InvoiceRegistry fit together, and what 0G, CROPS and Arkiv each do. Max 15 lines.
2. Propose the 3 build stages for an overnight MVP, with time estimates. Stage 1 must be the repo + ProductRegistry.
3. Stage 1: init Foundry inside the existing `contracts/` folder. Write `ProductRegistry.sol` with tests, make it compile and pass, then commit and push.
4. Stop and show me the stages and test output before stage 2.
