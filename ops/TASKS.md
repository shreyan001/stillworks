# TASKS — now → submission (all times IST)

Rule: one box at a time per lane. Tick it only when the "done when" is true.

## Main timeline (Lane A: coding agent, supervised by firstmate)

### Phase 1 — Stage 1 contracts · Thu 10:45 PM → 11:05 PM (overrun cap: 11:45 PM)
- [ ] Repo `stillworks` public, MIT, scaffold (contracts/ app/ arkiv/ README with empty CROPS, AI_LOG.md, .gitignore) — *done when:* pushed to GitHub
- [ ] `ProductRegistry.sol` (register, proposePassport, approvePassport, heartbeat; events) + tests — *done when:* `forge test` green, pushed

### Phase 2 — Stage 2 escrow/agreement · Thu 11:45 PM → Fri 3:00 AM
- [ ] `SubscriptionAgreement.sol` (create, cancel, requestWalkaway) — *done when:* tests green
- [ ] `SubscriptionEscrow.sol` (fund(n), release(period), claimRefund; pro-rata on missed heartbeat) — *done when:* release + refund math tests green
- [ ] shreyan reviews design of both — *done when:* his edits logged in AI_LOG.md

### Phase 3 — Stage 3 invoice + 0G PC + Storage + Arkiv · Fri 3:00 AM → 9:00 AM
- [ ] `InvoiceRegistry.sol` (escrow-only mint, stores heartbeatTx + auditRequestId) — *done when:* tests green
- [ ] Deploy all 4 to 0G Galileo (16602) — *done when:* addresses in README + explorer links work
- [ ] 0G PC passport audit script (OpenAI client, log request ID) — *done when:* one real request ID printed
- [ ] 0G Storage: upload passport JSON + encrypted walkaway bundle — *done when:* root hashes retrievable
- [ ] Heartbeat bot (signs + posts per period) — *done when:* Heartbeat event on explorer
- [ ] Arkiv write + read of ProductPassport (stretch) — *done when:* query returns our entity

### Phase 4 — Frontend core loop · Fri 9:00 AM → 4:00 PM
- [ ] Catalog + passport page (reads chain over public RPC) — *done when:* seeded listing shows
- [ ] Subscribe: 0G PC audit with visible request ID → fund escrow — *done when:* tx on explorer
- [ ] Refund after missed heartbeat — *done when:* claimRefund works in UI
- [ ] Walkaway: download + decrypt bundle, run with docker compose — *done when:* tool runs locally with data
- [ ] Privy 0G sign-in + credits decreasing on localhost:3000/3001/5173 (P1 bonus) — *done when:* balance visibly drops
- [ ] Arkiv-backed discovery filter (stretch) — *done when:* UI filter reads from Arkiv

### Phase 5 — Deploy · by **Fri 6:00 PM**
- [ ] Static frontend pinned on 0G Storage + live demo URL — *done when:* opens by root hash and by URL
- [ ] Kill-switch rehearsal (founder server + domain off) — *done when:* full path works twice

### Phase 6 — Freeze + docs + video · by **Fri 11:00 PM**
- [ ] Feature freeze (bug fixes only after this)
- [ ] README: run steps, `CROPS` section, "what breaks without 0G" line, contract addresses, live link, team Telegram + X, request-ID example, AI attribution section
- [ ] AI_LOG.md complete; attribution lists AI vs human files/parts
- [ ] /arkiv/*.md 5 files + writer wallet + runnable query (if Arkiv kept)
- [ ] Demo video < 3 min, follows data room script — *done when:* uploaded, link works logged-out

### Phase 7 — Polish · by **Sat 6:00 AM**
- [ ] Fresh-clone test: run README steps from zero — *done when:* works
- [ ] Check no trackers in client bundle — *done when:* network tab clean

### Phase 8 — Submit · by **Sat 7:30 AM** (hard deadline 9:00 AM)
- [ ] ETHGlobal submission form: description, repo, video, live link, 3 prizes selected — *done when:* confirmation shown
- [ ] **Stop. No more commits.** Judging 9:30 AM.

## Parallel lanes

### Lane B — Web3 Idea Researcher
- [ ] Re-verify Sat 9:00 AM deadline on the ETHGlobal event page — *done when:* source link in RESOURCES.md
- [ ] Export the old data room site into `dataroom/` (needs shreyan login) and update CONFLICTS.md — *done when:* merged
- [ ] Get 0G Privy app ID / iAI details from 0G booth or Discord — *done when:* ID handed to shreyan
- [ ] Draft README CROPS + "what breaks without 0G" final text — *done when:* in repo
- [ ] Draft /arkiv/*.md content — *done when:* drafts ready by Fri 6 PM
- [ ] Answer blockers from coding agent on SDK docs — *done when:* within 15 min each

### Lane C — shreyan (only you can do these)
- [ ] 0G Galileo faucet → deployer wallet (0.1 0G/day; ask 0G booth if short) — *by Fri 2 AM*
- [ ] 0G Private Computer API key at pc.0g.ai (testnet UI pc.testnet.0g.ai) — *by Fri 3 AM*
- [ ] Arkiv faucet + access key (hub.arkiv.network) — *by Fri 3 AM*
- [ ] GitHub: create public repo `stillworks` — *now*
- [ ] Telegram + X handles ready for the form — *by Fri 6 PM*
- [ ] Approve each contract design; make real edits — *every stage*
- [ ] Record demo video — *Fri 9–11 PM*
- [ ] Submit the form — *Sat by 7:30 AM*
- [ ] Sleep 90 min somewhere between Fri 4 AM and 8 AM if possible

### Lane D — Coordination tools
- [ ] tasky: keep TASKS.md ticked; one current task per lane — *hourly*
- [ ] plan and organize: hourly progress % ping from TASKS.md ticks — *hourly*
- [ ] firstmate: run coding crew in worktrees (contracts / frontend / integrations) — *from Phase 2*
- [ ] lavish-axi: open plans/diagrams as HTML for quick visual review — *at each phase gate*
