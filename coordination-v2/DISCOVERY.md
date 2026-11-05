# DISCOVERY — deriving segmentation and dependencies

Goal: find the product's real parts and the real order between them, from evidence, with shreyan. **No default order** (not frontend-first, not contracts-first).

## Steps
1. **Outcomes.** With shreyan, write the outcomes the product must deliver to each actor (users, builders, judges, operators). Plain sentences.
2. **Capabilities.** For each outcome, list the capabilities needed to make it true. A capability is "the system can …", not a file or a layer.
3. **Knowledge per capability.** For each: what is known (fact + source), assumed, unknown. Mark unknowns that could change the design.
4. **Couplings.** Find where capabilities share data, money, trust, keys, time or rules. Coupled capabilities can't be decided alone.
5. **Dependencies.** A depends on B only if A can't be decided or built without B's answer. Write the reason for each edge. Prefer "decision depends on knowledge" edges over "code depends on code".
6. **Risk ranking.** Rank unknowns by (impact if wrong) × (how hard to change later). Highest first. This, not habit, sets the order.
7. **Workstreams.** Group capabilities that share knowledge and owners. Each workstream gets: purpose, open questions, inputs, outputs, dependencies.
8. **Review with shreyan.** Show the map (diagram allowed). He approves, edits or rejects. Record it via DECISION_PROTOCOL.md.
9. **Revisit** when a research result or decision changes an edge.

## Output format (proposal until approved)
```
Capability: …
  Serves outcome: …
  Known (source, date): …
  Unknown: …
  Depends on: … because …
  Coupled with: …
  Risk: high/med/low — why
```

## Anti-patterns
- Turning examples from earlier chats/docs into requirements.
- Fixed stage plans copied from templates.
- Splitting by tech layer before knowing what must be decided.
- Launching parallel work on parts whose dependencies aren't settled.
