"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const TV_EMBED_BASE = "https://s3.tradingview.com/external-embedding";

type TradingViewEmbedProps = {
  widget: string;
  config: Record<string, unknown>;
  className?: string;
  height?: number | string;
  title?: string;
};

function buildInitKey(widget: string, configJson: string) {
  return `${widget}::${configJson}`;
}

export default function TradingViewEmbed({
  widget,
  config,
  className = "",
  height,
  title = "TradingView market widget",
}: TradingViewEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const configJson = useMemo(() => JSON.stringify(config), [config]);
  const initKey = useMemo(() => buildInitKey(widget, configJson), [widget, configJson]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const existingKey = root.dataset.tvInitKey;
    const hasIframe = Boolean(root.querySelector("iframe"));

    if (existingKey === initKey && hasIframe) {
      setReady(true);
      return;
    }

    setReady(false);
    root.innerHTML = "";
    root.dataset.tvInitKey = initKey;

    const wrapper = document.createElement("div");
    wrapper.className = "tradingview-widget-container";
    wrapper.style.height = "100%";
    wrapper.style.width = "100%";

    const widgetEl = document.createElement("div");
    widgetEl.className = "tradingview-widget-container__widget";
    widgetEl.style.height = "100%";
    widgetEl.style.width = "100%";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `${TV_EMBED_BASE}/embed-widget-${widget}.js`;
    script.textContent = configJson;

    wrapper.appendChild(widgetEl);
    wrapper.appendChild(script);
    root.appendChild(wrapper);

    const markReady = () => setReady(true);

    const observer = new MutationObserver(() => {
      const iframe = root.querySelector("iframe");
      if (iframe) {
        markReady();
        observer.disconnect();
      }
    });
    observer.observe(root, { childList: true, subtree: true });

    const fallback = window.setTimeout(markReady, 5000);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
      // Intentionally keep DOM on cleanup — React Strict Mode remounts immediately
      // and clearing here races TradingView's iframe resize listener (contentWindow error).
    };
  }, [initKey, widget, configJson]);

  const resolvedHeight =
    height === undefined ? undefined : typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`relative ${className}`}
      style={resolvedHeight ? { height: resolvedHeight, minHeight: resolvedHeight } : undefined}
      role="region"
      aria-label={title}
    >
      {!ready && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-[1px]"
          aria-hidden
        >
          <div className="flex flex-col items-center gap-2">
            <span className="w-6 h-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <span className="text-[0.65rem] font-data uppercase tracking-wider text-muted-foreground">
              Loading market data…
            </span>
          </div>
        </div>
      )}
      <div ref={containerRef} className="h-full w-full overflow-hidden" />
    </div>
  );
}
