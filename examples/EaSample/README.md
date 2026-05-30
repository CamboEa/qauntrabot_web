# SuperFiveCentBot — QauntraBot license test

Sample EA wired to the production license API on [www.quantrabot.com](https://www.quantrabot.com/).

## Files

| File | Role |
|------|------|
| `SuperFiveCentBot.mq5` | XAU / forex grid — Friday close + weekend pause + session filter |
| `SuperFiveCentBotBTC.mq5` | **BTC / crypto 24/7** — no Fri/weekend close; opens BUY+SELL L1 together; trend filter off by default |

### Live dashboard stream

Both EAs push to `/api/trading/report` on a **1s timer** (configurable):

- `InpStreamTimerMs = 1000` — timer push interval
- `InpBalanceSyncMinSeconds = 1` — minimum gap between uploads
- `InpBalanceHeartbeatSeconds = 5` — fallback if nothing changed

Recompile and re-attach after pulling updates. The web dashboard polls + Firestore listener (~2s).

### SuperFiveCentBotBTC (BTCUSD, etc.)

- No Friday shutdown, no weekend pause, no daily market-close filter
- `UseTrendFilter = false` by default — grid trades both directions
- With no open positions, places **BUY L1 and SELL L1** on the same tick (hedged grid start)
- Default `MagicNumber = 20240201` (different from the XAU EA so both can run on one account)
- Tune `GridStep` for your broker’s BTC point size (default `800`)

**Dashboard sync:** only one EA should push live stats per MT account at a time. If both XAU and BTC EAs run on the same login, the last upload wins and the dashboard can look stuck on the other bot. Remove the XAU EA from the chart when testing BTC, recompile `SuperFiveCentBotBTC.mq5` in MetaEditor after updates, and paste **InpLicenseKey** again in EA inputs (each attachment has its own inputs). Experts log should show `QauntraBot: live stream timer … | bot=SuperFiveCentBotBTC`.

## Production setup

1. **Dashboard → License** — copy your license key (`QB-…`).

2. **MT5 → Tools → Options → Expert Advisors** — allow WebRequest:

   ```
   https://www.quantrabot.com
   ```

3. Attach the EA → **Inputs** tab → paste **InpLicenseKey** from the dashboard.

4. Run on the **same MT account** you registered with.

Experts log: `QauntraBot license OK | MT account …`

## API check

```bash
curl "https://www.quantrabot.com/api/license/verify?licenseKey=QB-YOUR-KEY&account=YOUR_MT_LOGIN"
```

## Local dev (optional)

```bash
npm run dev
```

Use `http://127.0.0.1:3000/api/license/verify` and allow `http://127.0.0.1:3000` in WebRequest.

## Offline compile only

Set `InpRequireLicense = false` (not for production).
