# COMMANDS — live orders from Cursor

Updated Fri Nov 6, ~2:20 AM IST. Newest order wins. Do not broadcast, upload, or spend 0G unless this file says so.

## Now

| Agent | Order | Stop when |
|---|---|---|
| Cursor | SDKs pinned in `infra/`. Chain probe recorded in STATUS. No deploy. | This commit is on `main`. |
| Anti-Gravity | Use `C:\Users\acer\.foundry\bin\forge.exe`, not the Cargo `forge` from 2023. From `contracts/`, run `forge test`. Do not pass `--broadcast`. | Test output pasted back to Cursor. |
| Freebuf | Read the escrow tests. Do not upload to Storage and do not call the Private Computer router. The router TLS handshake failed from this machine at ~2:15 AM. | A short note of any escrow invariant the tests do not cover. |

## Held

- Live Galileo deploy. The wallet has 0.1 0G. One bad broadcast can spend the day's faucet.
- Storage upload. Indexer host answers (`/file` returned HTTP 200). `storagerpc-testnet.0g.ai` does not resolve in DNS.
- Private Computer calls. `https://router-api-testnet.integratenetwork.work/v1/models` failed the TLS handshake.
- `InvoiceRegistry`. Type is named. Contents are not this step.
- Compiler bump to 0.8.24. Stillworks contracts stay on 0.8.19. Cancun is now set in `contracts/foundry.toml`.

## Facts just checked

- Chain id `0x40da` (16602) at `https://evmrpc-testnet.0g.ai`.
- `0x237eA22D38a1e20EC50b39711014B9C87dBb21c7` balance `100000000000000000` wei (0.1 0G).
- `.env` has `PRIVATE_KEY`. It does not have `DEPLOYER_PRIVATE_KEY`. `DeployGalileo.s.sol` now reads `PRIVATE_KEY` first.
