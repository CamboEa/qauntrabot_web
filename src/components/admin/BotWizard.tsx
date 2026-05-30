"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  LineChart,
  Activity,
  FileCheck,
  Package,
  Sparkles,
  Upload,
  ImageIcon,
} from "lucide-react";
import { adminFetch, adminJson } from "@/lib/admin-client";
import { toast } from "@/lib/toast";
import { resolveBotStorageFolder, botStoragePrefix, slugifyBotFolder } from "@/lib/bot-storage";
import type {
  BotDoc,
  BotProof,
  BotStatus,
  RiskLevel,
  TradingPlatform,
  BacktestProof,
  LiveProof,
} from "@/lib/firestore";
import { EMPTY_BOT_PROOF } from "@/lib/firestore";

type BotFormData = Omit<BotDoc, "id" | "createdAt" | "updatedAt">;

const STEPS = [
  { id: 1, label: "Identity", icon: Sparkles },
  { id: 2, label: "Performance", icon: LineChart },
  { id: 3, label: "Backtest proof", icon: FileCheck },
  { id: 4, label: "Live proof", icon: Activity },
  { id: 5, label: "Files & publish", icon: Package },
] as const;

const EMPTY_FORM: BotFormData = {
  name: "",
  subtitle: "",
  asset: "",
  assetTag: "",
  status: "soon",
  risk: "Medium",
  gain: "—",
  drawdown: "—",
  winRate: "—",
  trades: "—",
  description: "",
  pairs: [],
  minDeposit: "$500",
  storageFolder: "",
  imageKey: "",
  fileKey: "",
  proof: EMPTY_BOT_PROOF,
};

const EMPTY_BACKTEST: BacktestProof = {
  period: "",
  platform: "MT5",
  broker: "",
  timeframe: "H1",
  initialDeposit: "$500",
  imageKeys: [],
  reportKey: undefined,
  notes: "",
};

const EMPTY_LIVE: LiveProof = {
  runningSince: "",
  platform: "MT5",
  broker: "",
  accountType: "Standard",
  imageKeys: [],
  reportKey: undefined,
  notes: "",
};

export function botToFormData(bot: BotDoc): {
  form: BotFormData;
  pairsText: string;
} {
  return {
    form: {
      name: bot.name,
      subtitle: bot.subtitle,
      asset: bot.asset,
      assetTag: bot.assetTag,
      status: bot.status,
      risk: bot.risk,
      gain: bot.gain,
      drawdown: bot.drawdown,
      winRate: bot.winRate,
      trades: bot.trades,
      description: bot.description,
      pairs: bot.pairs,
      minDeposit: bot.minDeposit,
      storageFolder:
        bot.storageFolder ??
        resolveBotStorageFolder(bot.name, { botId: bot.id }),
      imageKey: bot.imageKey,
      fileKey: bot.fileKey,
      proof: bot.proof ?? EMPTY_BOT_PROOF,
    },
    pairsText: bot.pairs.join(", "),
  };
}

type Props = {
  mode: "create" | "edit";
  editingId?: string;
  initialForm?: BotFormData;
  initialPairsText?: string;
};

export default function BotWizard({
  mode,
  editingId = undefined,
  initialForm,
  initialPairsText = "",
}: Props) {
  const router = useRouter();
  const isEdit = mode === "edit" && !!editingId;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BotFormData>(initialForm ?? EMPTY_FORM);
  const [pairsText, setPairsText] = useState(initialPairsText);
  const [includeBacktest, setIncludeBacktest] = useState(!!initialForm?.proof?.backtest);
  const [includeLive, setIncludeLive] = useState(!!initialForm?.proof?.live);
  const [backtest, setBacktest] = useState<BacktestProof>(
    initialForm?.proof?.backtest ?? EMPTY_BACKTEST
  );
  const [live, setLive] = useState<LiveProof>(initialForm?.proof?.live ?? EMPTY_LIVE);
  const [eaPlatform, setEaPlatform] = useState<TradingPlatform>("MT5");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const botId = isEdit
    ? slugifyBotFolder(editingId!)
    : slugifyBotFolder(form.name);
  const storageFolder = resolveBotStorageFolder(form.name, {
    storageFolder: form.storageFolder,
    botId,
  });
  const canUpload = Boolean(form.name.trim());

  useEffect(() => {
    if (mode === "edit" && initialForm) {
      setForm(initialForm);
      setPairsText(initialPairsText);
      setIncludeBacktest(!!initialForm.proof?.backtest);
      setIncludeLive(!!initialForm.proof?.live);
      setBacktest(initialForm.proof?.backtest ?? { ...EMPTY_BACKTEST });
      setLive(initialForm.proof?.live ?? { ...EMPTY_LIVE });
    }
  }, [mode, initialForm, initialPairsText]);

  const exitToList = () => router.push("/admin/bots");

  const upload = async (
    file: File,
    type: string,
    index?: number
  ): Promise<string> => {
    if (!canUpload) throw new Error("Set bot name on step 1 first");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", type);
      fd.append("folder", storageFolder);
      fd.append("name", form.name.trim());
      if (botId) fd.append("id", botId);
      if (index !== undefined) fd.append("index", String(index));
      if (type === "bot-file") fd.append("platform", eaPlatform);

      const res = await adminFetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      toast.success("File uploaded.");
      return data.key as string;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
      throw e;
    } finally {
      setUploading(false);
    }
  };

  const validateStep = (s: number): string | null => {
    if (s === 1) {
      if (!form.name.trim()) return "Bot name is required";
      if (!isEdit && (!botId || botId === "unnamed")) {
        return "Bot name must include letters or numbers to generate an ID";
      }
      if (!storageFolder || storageFolder === "unnamed") {
        return "Bot name must contain letters or numbers for the storage folder";
      }
      return null;
    }
    if (s === 2) {
      if (form.status !== "soon" && form.gain === "—") {
        return "Enter gain % for live or beta bots";
      }
      return null;
    }
    if (s === 3 && includeBacktest) {
      if (!backtest.period.trim()) return "Backtest period is required";
      if (!backtest.broker.trim()) return "Backtest broker is required";
      if (backtest.imageKeys.length === 0 && !backtest.reportKey) {
        return "Add at least one backtest screenshot or report";
      }
      return null;
    }
    if (s === 4 && includeLive) {
      if (!live.runningSince.trim()) return "Live running since date is required";
      if (!live.broker.trim()) return "Live broker is required";
      if (live.imageKeys.length === 0 && !live.reportKey) {
        return "Add at least one live account screenshot or statement";
      }
      return null;
    }
    if (s === 5) {
      if (form.status === "live" && !form.fileKey) {
        return "Live bots need an EA file uploaded";
      }
      return null;
    }
    return null;
  };

  const goNext = () => {
    const err = validateStep(step);
    if (err) {
      toast.warning(err);
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  };

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const buildProof = (): BotProof => ({
    backtest: includeBacktest ? { ...backtest } : null,
    live: includeLive ? { ...live } : null,
  });

  const handleSave = async () => {
    const err = validateStep(5);
    if (err) {
      toast.warning(err);
      return;
    }
    for (let s = 1; s <= 4; s++) {
      const e = validateStep(s);
      if (e) {
        setStep(s);
        toast.warning(e);
        return;
      }
    }

    const pairs = pairsText.split(",").map((p) => p.trim()).filter(Boolean);
    const payload: BotFormData = {
      ...form,
      storageFolder,
      pairs,
      asset: pairs.length > 0 ? pairs.join(" · ") : form.subtitle.trim() || form.name.trim(),
      assetTag: pairs[0] ?? (form.subtitle.trim() || "EA"),
      proof: buildProof(),
    };

    setSaving(true);
    try {
      if (isEdit && editingId) {
        await adminJson(`/api/admin/bots/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminJson("/api/admin/bots", {
          method: "POST",
          body: JSON.stringify({ id: botId, ...payload }),
        });
      }
      toast.success(isEdit ? "Bot updated." : "Bot created.");
      router.push("/admin/bots");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card-surface flex flex-col overflow-hidden w-full">
        {/* Step progress */}
        <div className="px-6 pt-6 pb-4 border-b border-border stack-4 shrink-0">
          <p className="text-sm text-muted-foreground font-data">
            Step {step} of 5 — {STEPS[step - 1].label}
          </p>

          <nav className="flex gap-1 overflow-x-auto pb-1" aria-label="Wizard steps">
            {STEPS.map(({ id, label, icon: Icon }) => {
              const done = id < step;
              const active = id === step;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => id < step && setStep(id)}
                  disabled={id > step}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-data whitespace-nowrap transition-colors cursor-pointer disabled:cursor-default ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : done
                        ? "bg-profit/10 text-profit"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {done ? <Check size={14} /> : <Icon size={14} />}
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{id}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 stack-4">
          {step === 1 && (
            <div className="stack-4">
              <p className="text-sm text-muted-foreground">
                Define how this bot appears in the catalogue. The bot ID is generated from the name and
                cannot be changed after creation. Files upload to{" "}
                <code className="font-data text-xs bg-secondary px-1.5 py-0.5 rounded">
                  bots/{storageFolder || "…"}/
                </code>{" "}
                in your R2 bucket (from the bot name).
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  className={isEdit ? "" : "sm:col-span-2"}
                  label="Name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  placeholder="XAUUSD Grid Pro"
                />
                {(isEdit || form.name.trim()) && (
                  <div className={`stack-2 ${isEdit ? "sm:col-span-2" : ""}`}>
                    <span className="field-label">Bot ID {isEdit ? "" : "(auto)"}</span>
                    <p className="font-data text-sm text-foreground bg-secondary/60 border border-border rounded-xl px-3 py-2">
                      {botId || "—"}
                    </p>
                    {isEdit && (
                      <p className="text-xs text-muted-foreground">
                        Permanent — used in URLs and Firestore.
                      </p>
                    )}
                  </div>
                )}
                <Field
                  label="Subtitle"
                  value={form.subtitle}
                  onChange={(v) => setForm({ ...form, subtitle: v })}
                />
                <SelectField
                  label="Status"
                  value={form.status}
                  onChange={(v) => setForm({ ...form, status: v as BotStatus })}
                  options={[
                    { value: "live", label: "Live" },
                    { value: "beta", label: "Beta" },
                    { value: "soon", label: "Coming soon" },
                  ]}
                />
                <Field
                  className="sm:col-span-2"
                  label="Pairs (comma-separated)"
                  value={pairsText}
                  onChange={setPairsText}
                  placeholder="XAUUSD, EURUSD"
                />
                <div className="stack-2 sm:col-span-2">
                  <label className="text-xs font-data uppercase text-muted-foreground">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm resize-y"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="stack-4">
              <p className="text-sm text-muted-foreground">
                Public performance stats shown on bot cards. Use verified numbers from your proof steps.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <SelectField
                  label="Risk level"
                  value={form.risk}
                  onChange={(v) => setForm({ ...form, risk: v as RiskLevel })}
                  options={[
                    { value: "Low", label: "Low" },
                    { value: "Medium", label: "Medium" },
                    { value: "High", label: "High" },
                  ]}
                />
                <Field
                  label="Min. deposit"
                  value={form.minDeposit}
                  onChange={(v) => setForm({ ...form, minDeposit: v })}
                />
                <Field label="Gain" value={form.gain} onChange={(v) => setForm({ ...form, gain: v })} placeholder="+247.3%" />
                <Field label="Drawdown" value={form.drawdown} onChange={(v) => setForm({ ...form, drawdown: v })} placeholder="12.4%" />
                <Field label="Win rate" value={form.winRate} onChange={(v) => setForm({ ...form, winRate: v })} placeholder="73.2%" />
                <Field label="Trades" value={form.trades} onChange={(v) => setForm({ ...form, trades: v })} placeholder="847" />
              </div>
            </div>
          )}

          {step === 3 && (
            <ProofStep
              title="Backtest proof"
              description="Strategy Tester screenshots, equity curves, or third-party backtest reports (e.g. FX Blue)."
              enabled={includeBacktest}
              onEnabledChange={setIncludeBacktest}
              disabled={!canUpload}
              uploading={uploading}
              onUploadImage={async (file, index) => {
                const key = await upload(file, "proof-backtest-image", index);
                setBacktest((b) => ({
                  ...b,
                  imageKeys: [...b.imageKeys, key],
                }));
              }}
              onUploadReport={async (file) => {
                const key = await upload(file, "proof-backtest-report");
                setBacktest((b) => ({ ...b, reportKey: key }));
              }}
              onRemoveImage={(index) =>
                setBacktest((b) => ({
                  ...b,
                  imageKeys: b.imageKeys.filter((_, i) => i !== index),
                }))
              }
              onRemoveReport={() => setBacktest((b) => ({ ...b, reportKey: undefined }))}
              imageKeys={backtest.imageKeys}
              reportKey={backtest.reportKey}
              fields={
                <>
                  <Field label="Test period" value={backtest.period} onChange={(v) => setBacktest({ ...backtest, period: v })} placeholder="Jan 2023 – Dec 2024" />
                  <SelectField
                    label="Platform"
                    value={backtest.platform}
                    onChange={(v) => setBacktest({ ...backtest, platform: v as TradingPlatform })}
                    options={[
                      { value: "MT5", label: "MT5" },
                      { value: "MT4", label: "MT4" },
                    ]}
                  />
                  <Field label="Broker / server" value={backtest.broker} onChange={(v) => setBacktest({ ...backtest, broker: v })} />
                  <Field label="Timeframe" value={backtest.timeframe} onChange={(v) => setBacktest({ ...backtest, timeframe: v })} placeholder="H1" />
                  <Field label="Initial deposit" value={backtest.initialDeposit} onChange={(v) => setBacktest({ ...backtest, initialDeposit: v })} />
                  <div className="stack-2 sm:col-span-2">
                    <label className="text-xs font-data uppercase text-muted-foreground">Notes (optional)</label>
                    <textarea
                      value={backtest.notes ?? ""}
                      onChange={(e) => setBacktest({ ...backtest, notes: e.target.value })}
                      rows={2}
                      className="w-full rounded-xl border border-border px-3 py-2 text-sm resize-y"
                      placeholder="Modeling quality, spread assumptions…"
                    />
                  </div>
                </>
              }
            />
          )}

          {step === 4 && (
            <ProofStep
              title="Live / forward proof"
              description="Real account or forward-test screenshots — Myfxbook, broker statements, or terminal history."
              enabled={includeLive}
              onEnabledChange={setIncludeLive}
              disabled={!canUpload}
              uploading={uploading}
              onUploadImage={async (file, index) => {
                const key = await upload(file, "proof-live-image", index);
                setLive((l) => ({
                  ...l,
                  imageKeys: [...l.imageKeys, key],
                }));
              }}
              onUploadReport={async (file) => {
                const key = await upload(file, "proof-live-report");
                setLive((l) => ({ ...l, reportKey: key }));
              }}
              onRemoveImage={(index) =>
                setLive((l) => ({
                  ...l,
                  imageKeys: l.imageKeys.filter((_, i) => i !== index),
                }))
              }
              onRemoveReport={() => setLive((l) => ({ ...l, reportKey: undefined }))}
              imageKeys={live.imageKeys}
              reportKey={live.reportKey}
              fields={
                <>
                  <Field label="Running since" value={live.runningSince} onChange={(v) => setLive({ ...live, runningSince: v })} placeholder="Mar 2024" />
                  <SelectField
                    label="Platform"
                    value={live.platform}
                    onChange={(v) => setLive({ ...live, platform: v as TradingPlatform })}
                    options={[
                      { value: "MT5", label: "MT5" },
                      { value: "MT4", label: "MT4" },
                    ]}
                  />
                  <Field label="Broker" value={live.broker} onChange={(v) => setLive({ ...live, broker: v })} />
                  <Field label="Account type" value={live.accountType} onChange={(v) => setLive({ ...live, accountType: v })} placeholder="ECN, Standard…" />
                  <div className="stack-2 sm:col-span-2">
                    <label className="text-xs font-data uppercase text-muted-foreground">Notes (optional)</label>
                    <textarea
                      value={live.notes ?? ""}
                      onChange={(e) => setLive({ ...live, notes: e.target.value })}
                      rows={2}
                      className="w-full rounded-xl border border-border px-3 py-2 text-sm resize-y"
                    />
                  </div>
                </>
              }
            />
          )}

          {step === 5 && (
            <div className="stack-4">
              <p className="text-sm text-muted-foreground">
                Upload the EA file and card image into{" "}
                <code className="font-data text-xs bg-secondary px-1.5 py-0.5 rounded">
                  {botStoragePrefix(storageFolder)}/
                </code>
                , then review before publishing.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="stack-2">
                  <label className="text-xs font-data uppercase text-muted-foreground">EA platform</label>
                  <select
                    value={eaPlatform}
                    onChange={(e) => setEaPlatform(e.target.value as TradingPlatform)}
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm"
                  >
                    <option value="MT5">MT5</option>
                    <option value="MT4">MT4</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <UploadButton
                  label="Card image"
                  accept="image/*"
                  disabled={!canUpload || uploading}
                  onFile={async (file) => {
                    const key = await upload(file, "bot-image");
                    setForm((f) => ({ ...f, imageKey: key }));
                  }}
                />
                <UploadButton
                  label="EA file (.ex4, .ex5, .mq5)"
                  accept=".ex4,.ex5,.mq5"
                  disabled={!canUpload || uploading}
                  onFile={async (file) => {
                    const key = await upload(file, "bot-file");
                    setForm((f) => ({ ...f, fileKey: key }));
                  }}
                />
              </div>

              {(form.imageKey || form.fileKey) && (
                <ul className="text-xs font-data text-muted-foreground stack-1">
                  {form.imageKey && <li>Image: {form.imageKey}</li>}
                  {form.fileKey && <li>EA: {form.fileKey}</li>}
                </ul>
              )}

              <ReviewSummary
                botId={botId}
                storageFolder={storageFolder}
                form={form}
                pairsText={pairsText}
                includeBacktest={includeBacktest}
                includeLive={includeLive}
                backtest={backtest}
                live={live}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3 shrink-0 bg-card">
          <button
            type="button"
            onClick={step === 1 ? exitToList : goBack}
            className="btn-outline-brand text-sm cursor-pointer inline-flex items-center gap-1"
          >
            {step === 1 ? (
              "Cancel"
            ) : (
              <>
                <ChevronLeft size={16} /> Back
              </>
            )}
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={uploading}
              className="btn-primary-brand text-sm cursor-pointer inline-flex items-center gap-1 disabled:opacity-50"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || uploading}
              className="btn-primary-brand text-sm cursor-pointer disabled:opacity-50"
            >
              {saving ? "Publishing…" : isEdit ? "Save changes" : "Publish bot"}
            </button>
          )}
        </div>
    </div>
  );
}

function ProofStep({
  title,
  description,
  enabled,
  onEnabledChange,
  disabled,
  uploading,
  fields,
  imageKeys,
  reportKey,
  onUploadImage,
  onUploadReport,
  onRemoveImage,
  onRemoveReport,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  disabled: boolean;
  uploading: boolean;
  fields: React.ReactNode;
  imageKeys: string[];
  reportKey?: string;
  onUploadImage: (file: File, index: number) => Promise<void>;
  onUploadReport: (file: File) => Promise<void>;
  onRemoveImage: (index: number) => void;
  onRemoveReport: () => void;
}) {
  return (
    <div className="stack-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
          className="mt-1 rounded border-border"
        />
        <span>
          <span className="font-medium text-foreground block">{title}</span>
          <span className="text-sm text-muted-foreground">{description}</span>
        </span>
      </label>

      {enabled && (
        <>
          {disabled && (
            <p className="text-sm text-warning">Enter the bot name on step 1 before uploading files.</p>
          )}
          <div className="grid sm:grid-cols-2 gap-4">{fields}</div>

          <div className="stack-3 pt-2 border-t border-border">
            <p className="text-xs font-data uppercase text-muted-foreground">Evidence files</p>
            <div className="flex flex-wrap gap-2">
              <UploadButton
                label="Add screenshot"
                accept="image/*"
                disabled={disabled || uploading}
                onFile={(file) => onUploadImage(file, imageKeys.length)}
              />
              <UploadButton
                label="Upload report (PDF/HTML)"
                accept=".pdf,.html,.htm"
                disabled={disabled || uploading}
                onFile={onUploadReport}
              />
            </div>

            {imageKeys.length > 0 && (
              <ul className="stack-2">
                {imageKeys.map((key, i) => (
                  <li
                    key={key}
                    className="flex items-center justify-between gap-2 text-xs font-data bg-secondary/60 rounded-lg px-3 py-2"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground truncate">
                      <ImageIcon size={14} className="shrink-0" />
                      {key.split("/").pop()}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveImage(i)}
                      className="text-loss hover:underline cursor-pointer shrink-0"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {reportKey && (
              <div className="flex items-center justify-between gap-2 text-xs font-data bg-secondary/60 rounded-lg px-3 py-2">
                <span className="text-muted-foreground truncate">Report: {reportKey.split("/").pop()}</span>
                <button type="button" onClick={onRemoveReport} className="text-loss hover:underline cursor-pointer">
                  Remove
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {!enabled && (
        <p className="text-sm text-muted-foreground italic">Skipped — you can enable this later when editing.</p>
      )}
    </div>
  );
}

function ReviewSummary({
  botId,
  storageFolder,
  form,
  pairsText,
  includeBacktest,
  includeLive,
  backtest,
  live,
}: {
  botId: string;
  storageFolder: string;
  form: BotFormData;
  pairsText: string;
  includeBacktest: boolean;
  includeLive: boolean;
  backtest: BacktestProof;
  live: LiveProof;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 card-pad stack-3 text-sm">
      <p className="font-display font-semibold text-foreground">Review</p>
      <dl className="grid sm:grid-cols-2 gap-x-4 gap-y-2 font-data text-xs">
        <div>
          <dt className="text-muted-foreground">ID</dt>
          <dd className="text-foreground">{botId || "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">R2 folder</dt>
          <dd className="text-foreground font-data text-[0.65rem]">
            {botStoragePrefix(storageFolder)}/
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Status</dt>
          <dd className="text-foreground uppercase">{form.status}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Performance</dt>
          <dd className="text-foreground">
            {form.gain} gain · {form.drawdown} DD
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Pairs</dt>
          <dd className="text-foreground">{pairsText || "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Proof</dt>
          <dd className="text-foreground">
            {includeBacktest ? `Backtest (${backtest.imageKeys.length} img)` : "No backtest"}
            {" · "}
            {includeLive ? `Live (${live.imageKeys.length} img)` : "No live"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function UploadButton({
  label,
  accept,
  disabled,
  onFile,
}: {
  label: string;
  accept: string;
  disabled?: boolean;
  onFile: (file: File) => void | Promise<void>;
}) {
  return (
    <label
      className={`btn-outline-brand text-xs cursor-pointer inline-flex items-center gap-1.5 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <Upload size={14} />
      {label}
      <input
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onFile(f);
          e.target.value = "";
        }}
      />
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`stack-2 ${className ?? ""}`}>
      <label className="text-xs font-data uppercase text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border px-3 py-2 text-sm"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="stack-2">
      <label className="text-xs font-data uppercase text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
