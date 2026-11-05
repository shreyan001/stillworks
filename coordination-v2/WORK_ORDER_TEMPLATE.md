# WORK_ORDER_TEMPLATE

Issued by the lead agent **only after shreyan approves it**. One order = one bounded piece of work.

```
ID:                 WO-###
Owner (agent):      e.g. Gemini sub-agent / Cursor CLI session (model)
Approved by:        shreyan · date time IST
Type:               research / review / evidence-check / implementation
Goal:               one sentence
Question or task:   exactly what to do
Inputs:             files, links, prior decisions (IDs)
Depends on:         decisions / work orders that must be closed first
Out of scope:       what not to touch
Constraints:        no transactions; no secrets in output; repo access: none / read / branch only
Merge constraints:  where output goes; who reviews; nothing merged to main without shreyan
Time cap:           …
Output:             format (e.g. Facts with source+time / Assumptions / Unknowns / Options / Recommendation)
Acceptance:         checkable criteria the lead verifies
Attribution:        AI tool + model logged (ETHGlobal AI rule) if it touches the repo
Status:             open / in progress / returned / accepted / rejected
```
