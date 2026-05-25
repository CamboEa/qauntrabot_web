/** Format MT5 period string (M15, H1, or legacy PERIOD_M15). */
export function formatTimeframe(timeframe?: string | null): string {
  if (!timeframe?.trim()) return "";
  const tf = timeframe.trim().toUpperCase();
  if (tf.startsWith("PERIOD_")) return tf.slice(7);
  return tf;
}

export function formatSymbolTimeframe(symbol: string, timeframe?: string | null): string {
  const tf = formatTimeframe(timeframe);
  return tf ? `${symbol} · ${tf}` : symbol;
}
