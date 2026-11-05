# REFERENCE — Cursor CLI facts — Cursor CLI (checked Thu Nov 5, ~11:35 PM IST, from cursor.com/docs)

## Modes (✅ docs)
| Mode | What | How to start |
|---|---|---|
| Agent (default) | Full tools, edits files | `agent` (no flag) |
| **Plan** | Designs approach, asks clarifying questions | `agent --plan` or `agent --mode=plan`; inside: `/plan [prompt]` or Shift+Tab |
| Ask | Read-only questions, no edits | `agent --mode=ask`; inside: `/ask` |
| Debug | Debug mode | `/debug [prompt]` |
Other docs facts: `/model [filter]` picks a model; `agent models` or `agent --list-models` lists models **for your account**; `--model <id>` sets one; `/goal [objective]` gives a long-lived objective; `-p` is non-interactive print mode.

## Model choice (secondary)
The process is model-independent. Any strong model can lead. One option documented by Cursor as suited to coordination: **Claude Opus 5.5 (high thinking)** — its docs page says it "works well as a coordinator for subagents" and recommends the high thinking variant; it is a third-party model (Premium+ plan, prepaid credit). An included-pool alternative: **Grok 4.7 at high/xhigh effort** (fixed at medium on Plus). ⚠️ Run `agent models` to see what your account actually has.

## firstmate and lavish-axi (from their READMEs; not confirmed installed)
- **firstmate**: agent distro (clone repo, launch a harness inside). Cursor Agent CLI and Antigravity CLI (`agy`) are listed as verified primary harnesses; Cursor needs `--trust` and an interactive session (no turn-end hook in headless `-p`). Spawns crewmates in tmux windows with separate git worktrees. No firstmate slash command found in the README.
- **lavish-axi**: `npx -y lavish-axi` (zero setup) or skill `npx skills add kunchenguid/lavish-axi --skill lavish`, or `lavish-axi setup plugin` (registers with Cursor among others). Opens agent-made HTML locally for click-to-comment review. `/lavish` is shown only for agents that expose skills as slash commands (Claude Code example); ⚠️ not confirmed for Cursor CLI.
