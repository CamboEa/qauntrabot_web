"use client";

import TradingViewEmbed from "@/components/shared/TradingViewEmbed";

const TICKER_SYMBOLS = [
  { proName: "OANDA:XAUUSD", title: "XAUUSD" },
  { proName: "FX_IDC:EURUSD", title: "EURUSD" },
  { proName: "FX_IDC:GBPJPY", title: "GBPJPY" },
  { proName: "BITSTAMP:BTCUSD", title: "BTCUSD" },
  { proName: "FX_IDC:USDJPY", title: "USDJPY" },
  { proName: "NASDAQ:NDX", title: "NAS100" },
];

const TICKER_CONFIG = {
  symbols: TICKER_SYMBOLS,
  showSymbolLogo: true,
  colorTheme: "light",
  isTransparent: false,
  displayMode: "adaptive",
  locale: "en",
};

export default function TradingViewTickerTape() {
  return (
    <TradingViewEmbed
      widget="ticker-tape"
      className="border-b border-border bg-secondary/80"
      height={46}
      title="Live market ticker"
      config={TICKER_CONFIG}
    />
  );
}
