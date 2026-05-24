//+------------------------------------------------------------------+
//| QauntraBotLicense.mqh — online license + MT account lock         |
//+------------------------------------------------------------------+
#property strict

#ifndef QAUNTRABOT_LICENSE_MQH
#define QAUNTRABOT_LICENSE_MQH

bool QauntraBotVerifyLicense(
   const string licenseKey,
   const string apiBaseUrl,
   string &errorMessage,
   const int recheckSeconds = 3600
);

static string   g_qb_lastError = "";
static datetime g_qb_nextCheck = 0;

string QauntraBotLastError() { return g_qb_lastError; }

bool QauntraBotParseValid(const string body)
{
   if(StringFind(body, "\"valid\":true") >= 0) return true;
   if(StringFind(body, "\"valid\": true") >= 0) return true;
   return false;
}

string QauntraBotParseJsonString(const string body, const string field)
{
   string needle = "\"" + field + "\":\"";
   int p = StringFind(body, needle);
   if(p < 0)
   {
      needle = "\"" + field + "\": \"";
      p = StringFind(body, needle);
   }
   if(p < 0) return "";
   p += StringLen(needle);
   int q = StringFind(body, "\"", p);
   if(q < 0) return "";
   return StringSubstr(body, p, q - p);
}

string QauntraBotFriendlyError(
   const string apiCode,
   const string apiMessage,
   const string terminalAccount,
   const string licensedAccount
)
{
   if(apiCode == "ACCOUNT_MISMATCH")
   {
      if(StringLen(licensedAccount) > 0 && StringLen(terminalAccount) > 0)
         return "Wrong MT account!\n\n"
                + "Licensed account: " + licensedAccount + "\n"
                + "This terminal:    " + terminalAccount + "\n\n"
                + "Log in to the correct MT account, or update your linked account at qauntra-bot.vercel.app";
      return "Wrong MT account for this license.\n\n" + apiMessage;
   }
   if(apiCode == "INVALID_KEY")
      return "Invalid license key.\n\n"
             + "Copy from qauntra-bot.vercel.app → Dashboard → License (QB-…).";
   if(apiCode == "SUBSCRIPTION_INACTIVE")
      return "Subscription inactive or expired.\n\n"
             + "Renew at qauntra-bot.vercel.app/pricing.";
   if(apiCode == "NO_MT_ACCOUNT")
      return "No MT account linked to this license.\n\n"
             + "Register at qauntra-bot.vercel.app or contact support.";
   if(StringLen(apiMessage) > 0) return apiMessage;
   return "License denied. Check qauntra-bot.vercel.app";
}

void QauntraBotShowLicenseError(const string title, const string detail)
{
   Comment(title, "\n\n", detail);
   Alert(title, "\n\n", detail);
}

bool QauntraBotHttpGet(const string url, string &response, string &err)
{
   char data[];
   char result[];
   string resultHeaders;
   ResetLastError();
   int code = WebRequest("GET", url, "", 5000, data, result, resultHeaders);
   if(code == -1)
   {
      err = "WebRequest blocked.\n\nTools > Options > Expert Advisors > allow:\nhttps://qauntra-bot.vercel.app\nThen restart MT5.";
      return false;
   }
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
      errorMessage = "Missing license key.\n\nPaste from Dashboard → License on the website.";
      g_qb_lastError = errorMessage;
      return false;
   }

   string accountStr = IntegerToString((long)AccountInfoInteger(ACCOUNT_LOGIN));
   string base = apiBaseUrl;
   StringTrimRight(base);
   if(StringLen(base) > 0 && StringGetCharacter(base, StringLen(base) - 1) == '/')
      base = StringSubstr(base, 0, StringLen(base) - 1);

   string url = base + "?licenseKey=" + key + "&account=" + accountStr;
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

   string apiCode = QauntraBotParseJsonString(body, "code");
   string apiMsg  = QauntraBotParseJsonString(body, "message");
   string licensed = QauntraBotParseJsonString(body, "licensedAccount");
   errorMessage = QauntraBotFriendlyError(apiCode, apiMsg, accountStr, licensed);
   g_qb_lastError = errorMessage;
   return false;
}

#endif
