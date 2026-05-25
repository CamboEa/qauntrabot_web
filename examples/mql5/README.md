# QauntraBot EA licensing (MT5)

Production site: [https://www.quantrabot.com](https://www.quantrabot.com/)

Your EA calls:

```
https://www.quantrabot.com/api/license/verify
```

The server checks an active subscription and that `ACCOUNT_LOGIN` matches the registered MT account.

## 1. Allow WebRequest URL

**Tools → Options → Expert Advisors → Allow WebRequest for listed URL:**

```
https://www.quantrabot.com
```

## 2. Include the helper

Copy `QauntraBotLicense.mqh` to `MQL5/Include/` (or next to your `.mq5`).

## 3. Wire into your EA

```mql5
#include <QauntraBotLicense.mqh>

input string InpLicenseKey = "";
input string InpLicenseApiUrl = "https://www.quantrabot.com/api/license/verify";

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
```

## API test

```bash
curl "https://www.quantrabot.com/api/license/verify?licenseKey=QB-XXXX-XXXX-XXXX&account=12345678"
```

## MT4

MT4 has no native `WebRequest` like MT5. Use MT5 builds or a bridge for licensing.
