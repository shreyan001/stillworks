# Arkiv schema
> Track: **Build on Arkiv** (new app). Answer with links, numbers or a query judges can run. Questions copied from the prize page (✅ fetched Nov 5).

Required: your entities, the fields you query, who owns them, and when they expire.

| Entity | Fields queried | Owner | Expiry |
|---|---|---|---|
| ProductPassport | category, license, selfHostable, dataLocation, thirdParties, passportScore, storageRoot | Founder wallet | 90 days; renewed by heartbeat |
| Heartbeat | productId, period, status, latencyMs | Founder wallet | 7 days |
| Listing | productId, priceUsd, period, escrowAddress | Founder wallet | Period end |
| AuditReport | productId, requestId (0G), score, model | Auditor wallet | 30 days |

_(Draft from data room; confirm after build.)_
