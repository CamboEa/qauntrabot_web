# QauntraBot EA licensing (MT5)

Your Expert Advisor calls the QauntraBot API on startup. The server checks:

1. **License key** exists and subscription is active  
2. **MT account number** on the chart matches the account the user registered with  

## 1. Allow WebRequest URL

In MetaTrader: **Tools → Options → Expert Advisors → Allow WebRequest for listed URL**

Add your site (production):

```
https://yourdomain.com
```

## 2. Include the helper

Copy `QauntraBotLicense.mqh` to `MQL5/Include/`.

## 3. Wire into your EA

```mql5
#include <QauntraBotLicense.mqh>

input string InpLicenseKey = "";
input string InpLicenseApiUrl = "https://yourdomain.com/api/license/verify";

int OnInit()
{
   string err;
   if(!QauntraBotVerifyLicense(InpLicenseKey, InpLicenseApiUrl, err, 3600))
   {
      Alert("QauntraBot: ", err);
      return INIT_FAILED;
   }
   return INIT_SUCCEEDED;
}

void OnTick()
{
   string err;
   if(!QauntraBotVerifyLicense(InpLicenseKey, InpLicenseApiUrl, err, 3600))
   {
      ExpertRemove();
      Alert("QauntraBot license lost: ", err);
   }
   // ... your strategy ...
}
```

Users paste the license key from **Dashboard → License**. The EA sends `AccountInfoInteger(ACCOUNT_LOGIN)` automatically — they must run on the same account they registered.

## API (manual test)

```bash
curl "https://yourdomain.com/api/license/verify?licenseKey=QB-XXXX-XXXX-XXXX&account=12345678"
```

Success (`200`):

```json
{
  "valid": true,
  "code": "OK",
  "message": "License valid for this account.",
  "expiresAt": "2026-12-01T00:00:00.000Z",
  "licensedAccount": "12345678"
}
```

Denied (`403`) — wrong account:

```json
{
  "valid": false,
  "code": "ACCOUNT_MISMATCH",
  "message": "License is locked to account 11111111. This terminal is 99999999.",
  ...
}
```

## MT4

MT4 has no built-in `WebRequest` like MT5. Options: run the MT5 build, use a small DLL bridge, or a local licensing proxy. MT5 is recommended for new integrations.
