const TICKERS = [
  { pair: "XAUUSD", val: "+2.34%", pos: true },
  { pair: "EURUSD", val: "+0.87%", pos: true },
  { pair: "GBPJPY", val: "-0.23%", pos: false },
  { pair: "BTCUSD", val: "+4.12%", pos: true },
  { pair: "USDJPY", val: "-0.45%", pos: false },
  { pair: "NAS100", val: "+1.67%", pos: true },
];

export default function TickerTape() {
  const items = [...TICKERS, ...TICKERS];

  return (
    <div className="overflow-hidden bg-secondary/80 border-b border-border">
      <div className="flex animate-ticker gap-8 py-2.5 px-4 w-max">
        {items.map(({ pair, val, pos }, i) => (
          <div key={`${pair}-${i}`} className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground font-data">{pair}</span>
            <span className={`text-xs font-semibold font-data ${pos ? "text-profit" : "text-loss"}`}>
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
