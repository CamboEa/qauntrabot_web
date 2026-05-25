"use client";

import { CandlestickChart } from "lucide-react";
import type { BotRuntimeStatus } from "@/lib/firestore";
import { formatSymbolTimeframe, formatTimeframe } from "@/lib/chart-context";

type Props = {
  status: BotRuntimeStatus;
  className?: string;
};

export default function AttachedChartBadge({ status, className = "" }: Props) {
  const tf = formatTimeframe(status.timeframe);
  const label = formatSymbolTimeframe(status.symbol, status.timeframe);

  return (
    <div
      className={`attached-chart-badge ${className}`.trim()}
      title="Symbol and timeframe from the chart where your EA is attached"
    >
      <CandlestickChart size={18} className="text-primary shrink-0" aria-hidden />
      <div className="min-w-0">
        <p className="text-[0.65rem] font-data uppercase tracking-wide text-muted-foreground">
          Attached chart
        </p>
        <p className="font-data text-lg sm:text-xl font-bold text-foreground tracking-tight truncate">
          {status.symbol}
          {tf ? (
            <>
              <span className="text-muted-foreground font-medium mx-1.5">·</span>
              <span className="text-primary">{tf}</span>
            </>
          ) : null}
        </p>
        {status.botName && (
          <p className="text-xs text-muted-foreground truncate">{status.botName}</p>
        )}
      </div>
      <span className="attached-chart-badge-pill font-data">{label}</span>
    </div>
  );
}
