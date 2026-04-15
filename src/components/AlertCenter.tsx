"use client";

import type { QuotePayload } from "@/lib/types";
import { Bell, BellRing, Crown, Lock, Plus, Siren, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type AlertRule = {
  id: string;
  symbol: string;
  mode: "price" | "signal";
  targetPrice?: number;
  signalAction?: "BUY" | "SELL" | "HOLD";
  createdAt: string;
  triggeredAt?: string;
  active: boolean;
};

const STORAGE_KEY = "pulse-terminal-alerts";
const TRIGGER_KEY = "pulse-terminal-alert-log";

function readAlerts(): AlertRule[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function readLog(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(TRIGGER_KEY) || "[]");
  } catch {
    return [];
  }
}

export function AlertCenter({ quote, isPro = false }: { quote: QuotePayload | null; isPro?: boolean }) {
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [mode, setMode] = useState<"price" | "signal">("price");
  const [targetPrice, setTargetPrice] = useState(quote?.price || 0);
  const [signalAction, setSignalAction] = useState<"BUY" | "SELL" | "HOLD">("BUY");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setAlerts(readAlerts());
    setLog(readLog());
  }, []);

  useEffect(() => {
    if (quote?.price) setTargetPrice(quote.price);
  }, [quote?.price, quote?.symbol]);

  useEffect(() => {
    if (!quote) return;
    const nextAlerts = readAlerts();
    let changed = false;
    const nextLog = readLog();

    const updated = nextAlerts.map((rule) => {
      if (!rule.active || rule.symbol !== quote.symbol) return rule;

      const triggered =
        rule.mode === "price"
          ? typeof rule.targetPrice === "number" && quote.price >= rule.targetPrice
          : rule.signalAction === quote.signal.action;

      if (!triggered) return rule;
      changed = true;
      const stamp = new Date().toISOString();
      const line =
        rule.mode === "price"
          ? `${quote.symbol} hit ${quote.price.toFixed(quote.assetClass === "forex" ? 5 : 2)} for alert ${rule.targetPrice?.toFixed(quote.assetClass === "forex" ? 5 : 2)}.`
          : `${quote.symbol} generated a ${quote.signal.action} signal at ${quote.signal.confidence}% confidence.`;
      nextLog.unshift(line);
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification("Pulse Terminal X alert", { body: line });
      }
      return { ...rule, active: false, triggeredAt: stamp };
    });

    if (changed) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.localStorage.setItem(TRIGGER_KEY, JSON.stringify(nextLog.slice(0, 8)));
      setAlerts(updated);
      setLog(nextLog.slice(0, 8));
    }
  }, [quote]);

  const activeAlerts = alerts.filter((item) => item.active);
  const canCreateMore = isPro ? activeAlerts.length < 20 : activeAlerts.length < 3;

  const summary = useMemo(() => {
    if (!quote) return "Pick an asset to start setting up alerts.";
    return `${quote.symbol} is currently ${quote.signal.action} with ${quote.signal.confidence}% confidence and trades at ${quote.price.toFixed(quote.assetClass === "forex" ? 5 : 2)}.`;
  }, [quote]);

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setMessage("Browser notifications are not supported here.");
      return;
    }
    const permission = await Notification.requestPermission();
    setMessage(permission === "granted" ? "Browser notifications enabled." : "Notifications were not enabled.");
  }

  function save(ruleSet: AlertRule[]) {
    setAlerts(ruleSet);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ruleSet));
  }

  function handleCreate() {
    if (!quote) return;
    setMessage("");
    if (!canCreateMore) {
      setMessage(isPro ? "Alert limit reached." : "Free and Basic plans can keep up to 3 active alerts. Upgrade to Pro for more.");
      return;
    }
    const next: AlertRule = {
      id: `${Date.now()}`,
      symbol: quote.symbol,
      mode,
      targetPrice: mode === "price" ? Number(targetPrice) : undefined,
      signalAction: mode === "signal" ? signalAction : undefined,
      createdAt: new Date().toISOString(),
      active: true,
    };
    save([next, ...alerts]);
    setMessage(mode === "price" ? `Price alert created for ${quote.symbol}.` : `Signal alert created for ${quote.symbol}.`);
  }

  function removeAlert(id: string) {
    save(alerts.filter((item) => item.id !== id));
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 lg:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-300">
            <BellRing className="h-3.5 w-3.5" />
            Alerts system
          </div>
          <h3 className="mt-3 text-3xl font-semibold text-white">Let users set alerts so the website keeps pulling them back in.</h3>
          <p className="mt-3 max-w-3xl text-slate-300">Alerts create habit. People stay subscribed when the desk reminds them about price levels and fresh signals instead of expecting them to remember everything.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => void enableNotifications()} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5">Enable browser notifications</button>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">{isPro ? "Pro: up to 20 active alerts" : "Free/Basic: up to 3 active alerts"}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm text-slate-400">Create alert</div>
              <div className="mt-1 text-xl font-semibold text-white">{quote?.symbol || "No asset selected"}</div>
            </div>
            <div className="rounded-2xl bg-white/5 p-3 text-slate-300"><Bell className="h-5 w-5" /></div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">{summary}</p>

          <div className="mt-5 flex gap-2">
            <button onClick={() => setMode("price")} className={`rounded-full px-4 py-2 text-sm ${mode === "price" ? "bg-white text-slate-950" : "border border-white/10 text-slate-300 hover:bg-white/5"}`}>Price alert</button>
            <button onClick={() => setMode("signal")} className={`rounded-full px-4 py-2 text-sm ${mode === "signal" ? "bg-amber-300 text-slate-950" : "border border-white/10 text-slate-300 hover:bg-white/5"}`}>Signal alert</button>
          </div>

          {mode === "price" ? (
            <div className="mt-5">
              <label className="text-sm text-slate-300">Notify when price reaches</label>
              <input value={targetPrice} onChange={(event) => setTargetPrice(Number(event.target.value))} type="number" step={quote?.assetClass === "forex" ? "0.00001" : "0.01"} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" />
            </div>
          ) : (
            <div className="mt-5">
              <label className="text-sm text-slate-300">Notify when signal becomes</label>
              <select value={signalAction} onChange={(event) => setSignalAction(event.target.value as "BUY" | "SELL" | "HOLD")} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none">
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
                <option value="HOLD">HOLD</option>
              </select>
            </div>
          )}

          <button onClick={handleCreate} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-400 px-4 py-3 font-semibold text-slate-950 hover:bg-teal-300">
            <Plus className="h-4 w-4" />Create alert
          </button>
          {message ? <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">{message}</div> : null}

          {!isPro ? (
            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100">
              <div className="flex items-center gap-2 font-semibold text-amber-200"><Lock className="h-4 w-4" />Pro unlock</div>
              <div className="mt-2">Pro expands the alert limit, keeps a bigger trigger log, and pairs alerts with premium desk modules.</div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              <div className="flex items-center gap-2 font-semibold text-emerald-200"><Crown className="h-4 w-4" />Pro alerts active</div>
              <div className="mt-2">Your premium desk now supports more active alerts and a richer trigger history.</div>
            </div>
          )}
        </div>

        <div className="grid gap-4">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm text-slate-400">Active alerts</div>
                <div className="mt-1 text-xl font-semibold text-white">{activeAlerts.length} running</div>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Stored in browser for this build</div>
            </div>
            <div className="mt-4 space-y-3">
              {alerts.length === 0 ? <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-300">No alerts yet. Create your first alert on the left.</div> : alerts.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{item.symbol}</div>
                      <div className="mt-1 text-sm text-slate-300">
                        {item.mode === "price" ? `Price ≥ ${item.targetPrice}` : `Signal becomes ${item.signalAction}`}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">{item.active ? "Active" : `Triggered ${item.triggeredAt ? new Date(item.triggeredAt).toLocaleString() : "recently"}`}</div>
                    </div>
                    <button onClick={() => removeAlert(item.id)} className="rounded-full border border-white/10 p-2 text-slate-300 hover:bg-white/5"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white"><Siren className="h-4 w-4 text-rose-300" />Trigger log</div>
            <div className="mt-4 space-y-3">
              {log.length === 0 ? (
                <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
                  Triggered alerts will appear here after the market data refresh matches your rules.
                </div>
              ) : (
                log.map((entry, index) => (
                  <div key={`${entry}-${index}`} className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200">
                    {entry}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
