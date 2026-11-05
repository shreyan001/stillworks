# RULES

## A. ETHGlobal (From Scratch track) — from ETHGlobal FAQ (as given by researcher; ⚠️ not re-fetched by me)
1. **Empty repo during the event.** No code or design work made before 9:00 PM IST Thu Nov 5.
2. Public libraries, SDKs, templates from docs: OK.
3. **AI is allowed but must be attributed**: say which files and which parts were AI-generated or AI-assisted.
4. Entirely-AI projects without meaningful team contributions **may be ineligible** for partner prizes and finalist consideration. → shreyan must make and log real decisions/edits.
5. Max **3 partner prizes** per project.
6. Teams up to 5. **One project** per team.
7. No explicit commit-log rule, but **frequent commits prove the build happened live**.

## B. EF — Best CROPS App ($3.5k ⚠️ amount not re-checked) — ✅ verified on prize page
1. Public repo, **FOSS license** (MIT/Apache-2.0/GPL/MPL or similar), README explains **how to run**.
2. README section titled exactly **`CROPS`**, 1–2 lines per letter:
   - C: what you control that the user depends on, and what happens if it disappears
   - O: open source, builds from the repo
   - P: what your server / RPC / analytics / indexers learn about the user
   - S: how keys and user data are protected, and the trust assumptions
3. **Demo video, 3 min max**, shows the **lead property end to end, including the moment it matters** (e.g. switch off backend/domain, swap RPC, show server logs with nothing identifying). Our moment: kill founder server + domain, reopen from 0G Storage root, claim refund, run walkaway bundle.
4. **No third-party trackers or analytics** in the client.
5. **Keys and personal data on the user's device**, or README explains why not (0G PC prompts leave the device → disclose under P).
6. Judging (✅ seen): works end to end in the demo; depth of lead property (structural); UX for someone who doesn't know CROPS; could it ship after.
7. One EF placement max (⚠️ from researcher; we submit only to Best CROPS App).

## C. 0G — Build with Private Computer ($5k) — ✅ verified on prize page
Must show:
1. Inference on **0G Private Computer in the main user flow, with request IDs** (log `X-Request-ID` / `x_0g_trace.request_id`, show in UI, store in InvoiceRegistry).
2. A working app a judge can try, with a **clear reason to come back tomorrow** (weekly trust report).
3. **One sentence on what breaks if 0G is removed** (README).
4. iAI bonus: user signs in with 0G account (0G's **Privy app ID**, shared by 0G) and **credit balance goes down**. Works only on **localhost:3000, 3001 or 5173** — demo it there. No need to buy/mint iAI; use team credits.
Submission:
5. Project name + short description.
6. **Public GitHub repo** with README + setup instructions.
7. **Demo video under 3 min** and a **live demo link**.
8. **Contract deployment addresses.**
9. Team names + contacts: **Telegram and X**.
Not wanted: **generic chat wrappers**; apps where the AI could be removed unnoticed.
Note: paid at 0G's discretion; quality threshold, not every place guaranteed.
SDKs: OpenAI-compatible client to pc.0g.ai router, 0G Storage SDK, 0G Chain for contracts.

## D. Arkiv (stretch) — ✅ verified on prize page
1. Public repo, **open-source license**; **say how you used AI**.
2. **Real write + read** on Arkiv testnet (`@arkiv-network/sdk` or JSON-RPC). A **user-facing feature reads its data from Arkiv**.
3. README: **writer wallet address(es)** + **one query judges can run**.
4. Files: `/arkiv/schema.md` (entities, queried fields, owner, expiry), `/arkiv/friction.md` (feedback: what got in the way, what broke, what you did), `/arkiv/reach.md`, `/arkiv/why-arkiv.md`, `/arkiv/how-you-use-arkiv.md` — one file per judging criterion, with links, numbers or a runnable query.
5. Not counted: SDK installed but never read; Arkiv used only as a log nothing reads.
6. One Arkiv track prize per team.
7. **Skip rule:** if escrow + 0G demo isn't solid by **Sat ~3 AM IST** (data room said "Sat noon", which is after the deadline — corrected), drop Arkiv.

## E. Our working rules
1. **AI_LOG.md entry for every change**: time (IST), files, AI-generated vs written/edited by shreyan, prompt summary.
2. **Small commits, pushed often.** Prefix `[ai]` (AI-generated) or `[ai-assisted]` (shreyan edited). Push after every working step.
3. **One task at a time.** Finish → tick in TASKS.md → next. New ideas go to a "Later" list, not into the build.
4. shreyan decides each contract design (5-line explain first) and logs his changes.
5. MIT. No trackers. Keys stay in wallet.
6. Scope = data room P0. P1 only after P0 is green. P2/Out = never this weekend.
7. **Stop working after submission.** No commits after submit (judges may check timestamps).
