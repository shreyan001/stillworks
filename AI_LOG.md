# AI_LOG

ETHGlobal requires AI attribution. One entry per change, newest at the bottom.

Format:
```
## YYYY-MM-DD HH:MM IST — short title
- Files: paths touched
- AI-generated: what the AI wrote
- Human (shreyan): what shreyan wrote, edited or decided
- Tool / model: e.g. Cursor agent (model), Grok Bot
- Prompt summary: one line
- Commit: hash
```

## 2026-11-05 22:55 IST — scaffold, docs and ops pack
- Files: README.md, LICENSE, AI_LOG.md, .gitignore, .env.example, START_HERE.md, LINKS.md, prompts/*, ops/*, dataroom/*, arkiv/*, contracts/README.md, app/README.md
- AI-generated: all of these files (docs and folder scaffold only; no contract or app code)
- Human (shreyan): idea, product name, prize choices, scope direction, instructions for this pack
- Tool / model: tasky (Grok Bot)
- Prompt summary: "Build a clean hackathon ops pack and starter folder from the data rooms, link pack and prize pages"
- Commit: (first commit)

## 2026-11-05 23:18 IST — note where Cursor skills landed
- Files: ops/SYSTEM.md
- AI-generated: one bullet recording the global Cursor install of `lavish` and `stow`
- Human (shreyan): asked to install those skills in Cursor globally, then ran /stow
- Tool / model: Cursor agent
- Prompt summary: "/stow what does this skill do"
- Commit: not committed

## 2026-11-05 23:45 IST — firstmate skills native to Cursor
- Files: ops/SYSTEM.md; machine-global `~/.agents/skills/` (firstmate entry + 27 copied skills; not in Stillworks repo)
- AI-generated: global firstmate install, projects/stillworks junction under FM_HOME, SYSTEM.md update
- Human (shreyan): asked to make firstmate native urgently
- Tool / model: Cursor agent
- Prompt summary: "now complete as much as you want"
- Commit: not committed

## 2026-11-06 01:00 IST — ProductRegistry v0
- Files: contracts/foundry.toml, contracts/src/ProductRegistry.sol, contracts/test/ProductRegistry.t.sol, contracts/README.md, .gitignore
- AI-generated: the Foundry project, ProductRegistry, and its four tests
- Human (shreyan): asked to stop planning and make the contract real; has not edited this code yet
- Tool / model: Cursor agent (Grok 4.7)
- Prompt summary: "work is not moving; make progress on the smart contract"
- Commit: not committed

## 2026-11-06 01:25 IST — Firstmate initialization & git baseline
- Files: .git, .gitignore, coordination-v2/ (cleaned duplicate), AI_LOG.md
- AI-generated: Firstmate orchestration setup, repository git init, remote configuration
- Human (shreyan): approved git repository initialization and provided remote repo URL https://github.com/shreyan001/stillworks
- Tool / model: Firstmate (Antigravity)
- Prompt summary: "yup https://github.com/shreyan001/stillworks is the git"
- Commit: ee32d99

## 2026-11-06 01:28 IST — SubscriptionAgreement & SubscriptionEscrow with Foundry tests
- Files: contracts/src/SubscriptionAgreement.sol, contracts/src/SubscriptionEscrow.sol, contracts/test/SubscriptionFlow.t.sol, contracts/README.md, ops/TASKS.md, ops/STATE.md
- AI-generated: SubscriptionAgreement and SubscriptionEscrow contracts; comprehensive Foundry test suite covering sequential release, walkaway requests, and pro-rata refunds on missed heartbeats (10/10 tests passing across suite); task and ops updates
- Human (shreyan): approved Phase 2 contract design and direction
- Tool / model: Firstmate (Antigravity)
- Prompt summary: "yup https://github.com/shreyan001/stillworks is the git"
- Commit: 5168a96

## 2026-11-06 01:36 IST — Multi-agent coordination pages & 0G Galileo deployment script
- Files: coordination-v2/agents/cursor.md, coordination-v2/agents/anti-gravity.md, coordination-v2/agents/freebuf.md, contracts/script/DeployGalileo.s.sol, coordination-v2/STATUS.md, .gitignore
- AI-generated: Dedicated coordination pages for Cursor, Anti-Gravity, and Freebuf agents; Foundry deployment script for 0G Galileo (chain 16602); gitignore updates; status ledger update
- Human (shreyan): instructed setup of three agent coordination branches (cursor, anti-gravity, freebuf) with Cursor as coordinator, and pushing deployment script via designated agent
- Tool / model: Firstmate (Antigravity)
- Prompt summary: "create three separate branches, one for each agent involved in coordination... separate pages... push the Gallio deployment script"
- Commit: (pending commit)
