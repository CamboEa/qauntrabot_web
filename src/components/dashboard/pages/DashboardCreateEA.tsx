"use client";

import { useState, useRef, useCallback } from "react";
import { Bot, ChevronRight, Copy, Check, RotateCcw, Sparkles, Download } from "lucide-react";
import DashboardSectionHead from "@/components/dashboard/DashboardSectionHead";

type Question = { id: string; text: string; chips: string[] };

const QUESTIONS: Question[] = [
  {
    id: "name",
    text: "What would you like to name your EA?",
    chips: [],
  },
  {
    id: "market",
    text: "What market do you want to trade?",
    chips: ["Gold (XAUUSD)", "EUR/USD", "GBP/USD", "USD/JPY", "US30 (Dow Jones)", "BTC/USD"],
  },
  {
    id: "timeframe",
    text: "What timeframe do you prefer?",
    chips: ["M1 (1 min)", "M5 (5 min)", "M15 (15 min)", "M30 (30 min)", "H1 (1 hour)", "H4 (4 hours)", "D1 (Daily)"],
  },
  {
    id: "style",
    text: "What is your trading style?",
    chips: ["Scalping", "Day trading", "Swing trading", "Position trading"],
  },
  {
    id: "risk",
    text: "How much risk per trade (% of account balance)?",
    chips: ["0.5%", "1%", "2%", "3%", "5%"],
  },
  {
    id: "entry",
    text: "What should trigger an entry signal?",
    chips: [
      "Moving average crossover",
      "RSI overbought / oversold",
      "MACD crossover",
      "Bollinger Band breakout",
      "Price action / candlestick patterns",
    ],
  },
  {
    id: "exit",
    text: "How should the EA exit trades?",
    chips: ["Fixed take profit & stop loss", "Trailing stop", "Indicator-based exit", "Time-based exit"],
  },
  {
    id: "session",
    text: "Which trading sessions should the EA be active?",
    chips: ["Asian (00:00–09:00 UTC)", "European (07:00–16:00 UTC)", "American (13:00–22:00 UTC)", "24/7 — all sessions"],
  },
  {
    id: "extra",
    text: "Any additional rules or constraints?",
    chips: ["Max 3 trades per day", "Avoid high-impact news", "No Martingale / no grid", "None — just generate"],
  },
];

const SYSTEM_PROMPT = `You are an expert MetaTrader 5 Expert Advisor (EA) designer and MQL5 developer.
Based on the user's trading preferences, produce a detailed, professional EA specification that a developer can use to implement the strategy in MQL5.

Structure your response with these sections:
## Strategy Overview
## Entry Conditions
## Exit Conditions
## Risk Management
## Recommended Input Parameters
## MQL5 Pseudocode Sketch

Be specific with indicator settings, numeric thresholds, and parameter names. Keep the pseudocode concise but actionable.`;

type Phase = "questions" | "generating" | "done" | "error";

export default function DashboardCreateEA() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [phase, setPhase] = useState<Phase>("questions");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const isLastStep = step === QUESTIONS.length - 1;

  const generate = useCallback(async (finalAnswers: string[]) => {
    setPhase("generating");
    setResult("");

    const userMessage = QUESTIONS.map(
      (q, i) => `**${q.text}**\nAnswer: ${finalAnswers[i] ?? "—"}`,
    ).join("\n\n");

    try {
      const res = await fetch("/api/create-ea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Please design an EA specification based on my trading preferences:\n\n${userMessage}`,
            },
          ],
        }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const delta = (JSON.parse(data) as { choices?: { delta?: { content?: string } }[] })
              .choices?.[0]?.delta?.content ?? "";
            if (delta) {
              setResult((prev) => prev + delta);
              if (resultRef.current) {
                resultRef.current.scrollTop = resultRef.current.scrollHeight;
              }
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }

      setPhase("done");
    } catch {
      setPhase("error");
    }
  }, []);

  const handleAnswer = useCallback(
    (answer: string) => {
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);
      setCustom("");

      if (isLastStep) {
        void generate(newAnswers);
      } else {
        setStep((s) => s + 1);
      }
    },
    [answers, isLastStep, generate],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const name = (answers[0] || answers[1] || "EA").replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `${name}_Spec.txt`;
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setCustom("");
    setResult("");
    setPhase("questions");
  };

  const progress = phase === "done" ? 100 : (step / QUESTIONS.length) * 100;

  return (
    <div className="dashboard-page">
      <DashboardSectionHead
        eyebrow="AI Builder"
        title="Create your EA"
        description="Answer a few questions and the AI will design a custom Expert Advisor specification for you."
      />

      {/* Progress bar (always visible) */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-data text-xs text-muted-foreground tabular-nums shrink-0">
          {phase === "done" ? "Done" : `${step + 1} / ${QUESTIONS.length}`}
        </span>
      </div>

      {/* ——— Question phase ——— */}
      {phase === "questions" && (
        <div className="dashboard-card dashboard-card--accent">
          {/* Previous answers summary */}
          {answers.length > 0 && (
            <div className="flex flex-col gap-2 pb-4 border-b border-border">
              {answers.map((ans, i) => (
                <div key={i} className="flex items-baseline gap-2 text-sm">
                  <span className="font-data text-[0.6rem] text-muted-foreground w-4 shrink-0 text-right">
                    {i + 1}.
                  </span>
                  <span className="text-muted-foreground flex-1 min-w-0 truncate">
                    {QUESTIONS[i]?.text}
                  </span>
                  <span className="text-primary font-medium shrink-0 text-right">{ans}</span>
                </div>
              ))}
            </div>
          )}

          {/* Current question */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
              <Bot size={15} className="text-primary-foreground" />
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <p className="text-base font-semibold text-foreground leading-snug">
                {QUESTIONS[step]?.text}
              </p>

              {/* Quick-pick chips */}
              {(QUESTIONS[step]?.chips.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-2">
                  {QUESTIONS[step]?.chips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleAnswer(chip)}
                      className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Custom text input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={step === 0 ? "e.g. GoldScalperPro, TrendMaster, MyStrategy…" : "Or type a custom answer…"}
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && custom.trim()) handleAnswer(custom.trim());
                  }}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  disabled={!custom.trim()}
                  onClick={() => custom.trim() && handleAnswer(custom.trim())}
                  className="btn-primary-brand py-2! px-4! text-sm! disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isLastStep ? <Sparkles size={14} /> : <ChevronRight size={14} />}
                  {isLastStep ? "Generate" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ——— Generating / done / error phase ——— */}
      {phase !== "questions" && (
        <div className="dashboard-card" style={{ gap: "1rem" }}>
          {/* Answers summary chips */}
          <div className="flex flex-wrap gap-1.5">
            {answers.map((ans, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-2.5 py-1 text-xs text-muted-foreground"
              >
                <span className="font-data text-[0.55rem] opacity-50">{i + 1}</span>
                {ans}
              </span>
            ))}
          </div>

          {/* Loading spinner */}
          {phase === "generating" && !result && (
            <div className="flex items-center gap-2.5 py-10 justify-center text-muted-foreground text-sm">
              <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Designing your EA…
            </div>
          )}

          {/* Error state */}
          {phase === "error" && (
            <p className="text-sm text-red-500 py-4 text-center">
              Something went wrong. Check that your API key is configured and try again.
            </p>
          )}

          {/* Streamed result */}
          {result && (
            <div
              ref={resultRef}
              className="max-h-[36rem] overflow-y-auto rounded-lg border border-border bg-secondary/40 p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-data"
            >
              {result}
              {phase === "generating" && (
                <span className="inline-block w-2 h-[1.1em] bg-primary ml-0.5 align-middle animate-pulse" />
              )}
            </div>
          )}

          {/* Actions */}
          {(phase === "done" || phase === "error") && (
            <div className="flex flex-wrap gap-2 pt-1">
              {phase === "done" && (
                <>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="btn-primary-brand py-2! px-4! text-sm! flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    Download .txt
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="btn-outline-brand py-2! px-4! text-sm! flex items-center gap-1.5"
                  >
                    {copied ? (
                      <Check size={14} className="text-profit" />
                    ) : (
                      <Copy size={14} />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="btn-outline-brand py-2! px-4! text-sm! flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                Start over
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
