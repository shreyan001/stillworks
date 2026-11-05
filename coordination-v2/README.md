# Stillworks coordination v2 — operating instructions

Model-independent instructions for a **lead agent** (any strong model, swappable) that works with shreyan to understand the product, find what's missing, decide together, and only then coordinate other agents.

This folder contains **no build plan, no product rules, no fixed order of work.** The lead agent discovers those with shreyan.

| File | Purpose |
|---|---|
| [00_START.md](00_START.md) | What to do first |
| [BOOTSTRAP_PROMPT.md](BOOTSTRAP_PROMPT.md) | Paste into the lead agent session |
| [LEAD_AGENT.md](LEAD_AGENT.md) | How the lead agent reasons and coordinates |
| [CONTEXT_MAP.md](CONTEXT_MAP.md) | Index of all existing sources: approved / proposal / unknown |
| [DISCOVERY.md](DISCOVERY.md) | How to derive capabilities, workstreams and dependencies |
| [DECISION_PROTOCOL.md](DECISION_PROTOCOL.md) | How decisions are raised and recorded |
| [RESEARCH_PROTOCOL.md](RESEARCH_PROTOCOL.md) | Sources, dates, verification, stop rules, contradictions |
| [WORK_ORDER_TEMPLATE.md](WORK_ORDER_TEMPLATE.md) | Bounded assignment for another agent |
| [HANDOFF.md](HANDOFF.md) | Checkpoint for swapping models or sessions |
| [STATUS.md](STATUS.md) | Evidence-based state only |
| [reference/](reference/) | Raw facts collected Nov 5 (Cursor CLI modes/models, firstmate, lavish-axi, 0G) + SOURCES.md. Evidence, not plan |
| [coordination-flow.png](coordination-flow.png) | General coordination loop (no product content) |

Status of older material: everything in `../ops/`, `../repo/ops/` and earlier prompts is **historical and unapproved**. The data room is preserved unchanged.
