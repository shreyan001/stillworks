# Stillworks

The store where you subscribe to open tools that publish a live passport and heartbeat. Escrow only releases when the product is alive; if it dies, you get a pro-rata refund and a walkaway bundle you can run yourself.

Built at ETHGlobal Mumbai 2026 (From Scratch). Stack: 0G Chain (ProductRegistry, SubscriptionAgreement, SubscriptionEscrow, InvoiceRegistry), 0G Storage (passports, frontend, walkaway bundles), 0G Private Computer (passport audit with request IDs), Arkiv (passport discovery, stretch).

## How to run
_TODO — filled in during the build._
```
forge build && forge test   # contracts/
pnpm i && pnpm dev           # app/
```

## CROPS
- **C — Censorship resistant:** We control the domain, a static frontend and an optional indexer. If any disappears, the frontend is pinned on 0G Storage, contracts are on 0G Chain, and your walkaway bundle and refund claim work from any RPC.
- **O — Open source:** MIT. Contracts, frontend and passport schema build from this repo alone.
- **P — Private:** No backend required, so our server learns nothing; no analytics or trackers. The RPC sees your address and calls; 0G Private Computer sees audit prompts (public passport data only) in verified private mode.
- **S — Secure:** Keys stay in your wallet; walkaway bundles are encrypted client-side with a key derived from your wallet signature. Trust assumptions: 0G Chain consensus, 0G Storage availability, founder heartbeat honesty.

## What breaks if 0G is removed
No neutral escrow, no takedown-proof storefront or walkaway bundle, and no verifiable private audit: Stillworks becomes a directory with a Stripe button.

## Deployments
_TODO: contract addresses on 0G Galileo (16602), live demo link, example 0G request ID._

## Team
_TODO: names, Telegram, X._

## AI Attribution
AI tools were used. Every change is logged in [AI_LOG.md](AI_LOG.md) with which files and parts were AI-generated vs written by the team.

## Docs
- [START_HERE.md](START_HERE.md) · [ops/](ops/README.md) · [dataroom/](dataroom/README.md) · [prompts/](prompts/README.md) · [arkiv/](arkiv/) · [LINKS.md](LINKS.md)
