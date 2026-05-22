"use client";

const EQUITY_POINTS = [
  [0, 148], [18, 143], [35, 138], [52, 145], [68, 130], [84, 122],
  [100, 132], [116, 112], [132, 102], [148, 110], [164, 90], [180, 95],
  [196, 76], [212, 68], [228, 80], [244, 58], [260, 48], [276, 62],
  [292, 40], [308, 32], [324, 45], [340, 28], [356, 22], [372, 30],
  [388, 18], [400, 24],
];

const BUY_MARKERS = [68, 148, 244, 340];
const SELL_MARKERS = [116, 196, 292, 388];

function buildPath(points: number[][]): string {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
}

function buildFillPath(points: number[][]): string {
  const line = buildPath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${line} L ${last[0]} 170 L ${first[0]} 170 Z`;
}

export default function TradingChart() {
  return (
    <div className="relative w-full overflow-hidden bg-card">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-profit" />
          <span className="text-xs text-muted-foreground font-data uppercase tracking-wide">
            XAUUSD — Equity Curve
          </span>
          <span className="text-xs font-semibold text-profit font-data">+247.3%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-data">12M</span>
          <span className="text-[0.65rem] border border-profit/30 text-profit rounded-full px-2 py-0.5 font-data">
            LIVE
          </span>
        </div>
      </div>

      <div className="relative px-2 pb-2 pt-2">
        <svg
          viewBox="0 0 400 180"
          className="w-full"
          style={{ height: "180px" }}
          preserveAspectRatio="none"
          aria-label="Equity curve chart"
        >
          <defs>
            <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A7F5A" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1A7F5A" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1A7F5A" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1A7F5A" stopOpacity="1" />
            </linearGradient>
          </defs>

          {[40, 80, 120, 160].map((y) => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(11,31,61,0.06)" strokeWidth="1" />
          ))}
          {[0, 100, 200, 300, 400].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="170" stroke="rgba(11,31,61,0.06)" strokeWidth="1" />
          ))}

          <path d={buildFillPath(EQUITY_POINTS)} fill="url(#equityFill)" />
          <path
            d={buildPath(EQUITY_POINTS)}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {BUY_MARKERS.map((x) => {
            const pt = EQUITY_POINTS.find((p) => p[0] === x);
            const y = pt ? pt[1] : 100;
            return (
              <g key={`buy-${x}`}>
                <polygon
                  points={`${x},${y + 14} ${x - 4},${y + 21} ${x + 4},${y + 21}`}
                  fill="#1A7F5A"
                  opacity="0.9"
                />
              </g>
            );
          })}

          {SELL_MARKERS.map((x) => {
            const pt = EQUITY_POINTS.find((p) => p[0] === x);
            const y = pt ? pt[1] : 100;
            return (
              <g key={`sell-${x}`}>
                <polygon
                  points={`${x},${y - 14} ${x - 4},${y - 21} ${x + 4},${y - 21}`}
                  fill="#C23B3B"
                  opacity="0.8"
                />
              </g>
            );
          })}

          <circle cx="400" cy="24" r="3" fill="#1A7F5A" />
          <circle cx="400" cy="24" r="7" fill="#1A7F5A" opacity="0.15" />
        </svg>

        <div className="absolute left-1 top-2 bottom-2 flex flex-col justify-between pointer-events-none">
          {["2,847", "2,710", "2,574", "2,438"].map((v) => (
            <span key={v} className="text-[0.55rem] text-muted-foreground font-data">
              {v}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 border-t border-border divide-x divide-border">
        {[
          { label: "Balance", value: "$24,831", color: "text-foreground" },
          { label: "Open P&L", value: "+$412", color: "text-profit" },
          { label: "Trades", value: "847", color: "text-muted-foreground" },
          { label: "Drawdown", value: "−8.2%", color: "text-warning" },
        ].map((m) => (
          <div key={m.label} className="px-3 py-2 text-center">
            <div className={`text-xs font-medium font-data ${m.color}`}>{m.value}</div>
            <div className="text-[0.55rem] text-muted-foreground mt-0.5 uppercase tracking-wide font-data">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
