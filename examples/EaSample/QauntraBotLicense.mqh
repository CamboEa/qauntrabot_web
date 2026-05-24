//+------------------------------------------------------------------+
//| QauntraBotLicense.mqh — online license + MT account lock         |
//| Copy into MQL5/Include and #include in your EA                    |
//+------------------------------------------------------------------+
#property strict

#ifndef QAUNTRABOT_LICENSE_MQH
#define QAUNTRABOT_LICENSE_MQH

// Call from OnInit; returns false → set INIT_FAILED
bool QauntraBotVerifyLicense(
   const string licenseKey,
   const string apiBaseUrl,   // e.g. "https://qauntra-bot.vercel.app/api/license/verify"
   string &errorMessage,
   const int recheckSeconds = 3600  // 0 = only on init
);

//+------------------------------------------------------------------+
static string g_qb_lastError = "";
static datetime g_qb_nextCheck = 0;

string QauntraBotLastError() { return g_qb_lastError; }

// Minimal check for `"valid":true` in JSON body
bool QauntraBotParseValid(const string body)
{
   if(StringFind(body, "\"valid\":true") >= 0) return true;
   if(StringFind(body, "\"valid\": true") >= 0) return true;
   return false;
}

string QauntraBotParseMessage(const string body)
{
   int p = StringFind(body, "\"message\":");
   if(p < 0) return "License denied";
   p = StringFind(body, "\"", p + 11);
   if(p < 0) return "License denied";
   int q = StringFind(body, "\"", p + 1);
   if(q < 0) return "License denied";
   return StringSubstr(body, p + 1, q - p - 1);
}

bool QauntraBotHttpGet(const string url, string &response, string &err)
{
   char data[];
   char result[];
   string headers;
   string resultHeaders;

   ResetLastError();
   int code = WebRequest("GET", url, "", 5000, data, result, resultHeaders);
   if(code == -1)
   {
      err = "WebRequest failed. Add URL in Tools → Options → Expert Advisors → WebRequest.";
      return false;
   }
   // 403 = valid JSON denial (wrong account / expired); still parse body
   if(code != 200 && code != 403)
   {
      err = "HTTP " + IntegerToString(code);
      return false;
   }
   response = CharArrayToString(result, 0, WHOLE_ARRAY, CP_UTF8);
   return true;
}

bool QauntraBotVerifyLicense(
   const string licenseKey,
   const string apiBaseUrl,
   string &errorMessage,
   const int recheckSeconds
)
{
   if(recheckSeconds > 0 && TimeCurrent() < g_qb_nextCheck && g_qb_lastError == "")
      return true;

   string key = licenseKey;
   StringTrimLeft(key);
   StringTrimRight(key);
   StringToUpper(key);
   if(StringLen(key) < 8)
   {
      errorMessage = "Enter your QauntraBot license key (Dashboard → License).";
      g_qb_lastError = errorMessage;
      return false;
   }

   long account = AccountInfoInteger(ACCOUNT_LOGIN);
   string accountStr = IntegerToString(account);

   string base = apiBaseUrl;
   StringTrimRight(base);
   if(StringGetCharacter(base, StringLen(base) - 1) == '/')
      base = StringSubstr(base, 0, StringLen(base) - 1);

   string url = base
      + "?licenseKey=" + key
      + "&account=" + accountStr;

   string body, err;
   if(!QauntraBotHttpGet(url, body, err))
   {
      errorMessage = err;
      g_qb_lastError = errorMessage;
      return false;
   }

   if(QauntraBotParseValid(body))
   {
      errorMessage = "";
      g_qb_lastError = "";
      if(recheckSeconds > 0)
         g_qb_nextCheck = TimeCurrent() + recheckSeconds;
      return true;
   }

   errorMessage = QauntraBotParseMessage(body);
   g_qb_lastError = errorMessage;
   return false;
}

#endif
