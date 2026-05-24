"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export type ProofMediaItem = {
  id: string;
  label: string;
  tabLabel: string;
  windowTitle?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

type ProofMediaShowcaseProps = {
  items: ProofMediaItem[];
  windowTitle?: string;
  className?: string;
  /** Cycle through tabs automatically */
  autoAdvance?: boolean;
  /** Milliseconds between auto-advance steps (default 5000) */
  autoAdvanceMs?: number;
};

export default function ProofMediaShowcase({
  items,
  windowTitle = "MetaTrader 5 — Strategy Tester",
  className = "",
  autoAdvance = false,
  autoAdvanceMs = 5000,
}: ProofMediaShowcaseProps) {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);

  const active = items.find((item) => item.id === activeId) ?? items[0];

  const goToNext = useCallback(() => {
    setActiveId((current) => {
      const idx = items.findIndex((item) => item.id === current);
      const next = items[(idx + 1) % items.length];
      return next?.id ?? current;
    });
  }, [items]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoAdvance || items.length < 2 || paused || !inView) return;

    const timer = window.setInterval(goToNext, autoAdvanceMs);
    return () => window.clearInterval(timer);
  }, [autoAdvance, autoAdvanceMs, goToNext, inView, items.length, paused]);

  useEffect(
    () => () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    },
    [],
  );

  const selectTab = (id: string) => {
    setActiveId(id);
    setPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setPaused(false), autoAdvanceMs);
  };

  if (!active || items.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className={`proof-showcase ${className}`.trim()}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <div className="proof-showcase-chrome">
        <div className="proof-showcase-dots" aria-hidden>
          <span className="proof-showcase-dot proof-showcase-dot--close" />
          <span className="proof-showcase-dot proof-showcase-dot--min" />
          <span className="proof-showcase-dot proof-showcase-dot--max" />
        </div>
        <p className="proof-showcase-window-title">{active.windowTitle ?? windowTitle}</p>
      </div>

      <div className="proof-showcase-tabs" role="tablist" aria-label="Backtest report views">
        {items.map((item) => {
          const selected = item.id === active.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(item.id)}
              className={`proof-showcase-tab ${selected ? "proof-showcase-tab--active" : ""}`}
            >
              {item.tabLabel}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${active.id}`}
        aria-labelledby={`${baseId}-tab-${active.id}`}
        aria-live={autoAdvance ? "polite" : undefined}
        className="proof-showcase-viewport"
      >
        <Image
          key={active.src}
          src={active.src}
          alt={active.alt}
          width={active.width}
          height={active.height}
          className="proof-showcase-image"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      <p className="proof-showcase-caption">{active.label}</p>
    </div>
  );
}
