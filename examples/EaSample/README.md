# SuperFiveCentBot — QauntraBot license test

Sample EA wired to the production license API on [qauntra-bot.vercel.app](https://qauntra-bot.vercel.app/).

## Files

| File | Role |
|------|------|
| `SuperFiveCentBot.mq5` | Strategy + license gate |
| `QauntraBotLicense.mqh` | WebRequest helper (keep beside the `.mq5`) |

Copy **both** into `MQL5/Experts/` and compile in MetaEditor.

## Production setup

1. **Dashboard → License** — copy your license key (`QB-…`).

2. **MT5 → Tools → Options → Expert Advisors** — allow WebRequest:

   ```
   https://qauntra-bot.vercel.app
   ```

3. Attach the EA. Defaults are already set:

   | Input | Default |
   |--------|---------|
   | InpLicenseApiUrl | `https://qauntra-bot.vercel.app/api/license/verify` |
   | InpLicenseKey | *(paste from dashboard)* |

4. Run on the **same MT account** you registered with.

Experts log: `QauntraBot license OK | MT account …`

## API check

```bash
curl "https://qauntra-bot.vercel.app/api/license/verify?licenseKey=QB-YOUR-KEY&account=YOUR_MT_LOGIN"
```

## Local dev (optional)

```bash
npm run dev
```

Use `http://127.0.0.1:3000/api/license/verify` and allow `http://127.0.0.1:3000` in WebRequest.

## Offline compile only

Set `InpRequireLicense = false` (not for production).
