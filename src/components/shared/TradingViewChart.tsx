"use client";

import TradingViewEmbed from "@/components/shared/TradingViewEmbed";

const CHART_CONFIG = {
  autosize: true,
  symbol: "OANDA:XAUUSD",
  interval: "60",
  timezone: "Etc/UTC",
  theme: "light",
  style: "1",
  locale: "en",
  enable_publishing: false,
  allow_symbol_change: true,
  calendar: false,
  hide_side_toolbar: true,
  hide_top_toolbar: false,
  hide_legend: false,
  hide_volume: false,
  save_image: false,
  support_host: "https://www.tradingview.com",
  backgroundColor: "#FFFFFF",
  gridColor: "rgba(11, 31, 61, 0.06)",
  widgetFontColor: "rgba(92, 107, 130, 1)",
};

export default function TradingViewChart() {
  return (
    <div className="relative w-full bg-card">
      <TradingViewEmbed
        widget="advanced-chart"
        height={380}
        title="XAUUSD live chart"
        config={CHART_CONFIG}
      />
    </div>
  );
}
