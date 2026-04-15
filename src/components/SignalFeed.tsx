"use client";

import type { AssetClass, QuotePayload } from "@/lib/types";
import {
  ArrowUpRight,
  BrainCircuit,
  Crown,
  Lock,
  Radar,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Waves,
} from "lucide-react";

type FeedItem = {
  symbol: string;
  label: string;
  category: string;
  assetClass: AssetClass;
  quote: QuotePayload | null;
};

export function SignalFeed({
  items,
  isPro = false,
  onSelect,
}: {
  items: FeedItem[];
  isPro?: boolean;
  onSelect: (symbol: string, assetClass: AssetClass) => void;
}) {
  const feed = [...items]
    .filter((item) => item.quote)
    .sort((a, b) => (b.quote?.signal.confidence || 0) - (a.quote?.signal.confidence || 0));

  const aiAgents = [
    { name: "Momentum AI", text: "Ranks breakouts, continuation setups, and trend alignment.", stat: "19 active scans" },
    { name: "Macro Pulse", text: "Flags calendar-driven volatility and sentiment shifts before major prints.", stat: "6 catalysts today" },
    { name: "Risk Guard", text: "Downweights noisy structures and highlights cleaner reward-to-risk profiles.", stat: "11 filtered setups" },
  ];

  return (
    
    <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 lg:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-teal-300">
            <Sparkles className="h-3.5 w-3.5" />
            AI signal stream
          </div>
          <h3 className="mt-3 text-3xl font-semibold text-white">TradingView-style signals with a live-looking AI desk around them.</h3>
          <p className="mt-3 max-w-3xl text-slate-300">Show ranked setups, direction, confidence, and a clean trade plan, then surround them with AI desk modules so the whole page feels active instead of static.</p>
          <p className="mt-3 max-w-3xl text-slate-300">
  Show ranked setups, direction, confidence, and a clean trade plan...
</p>

{/* 🔥 ADD THIS RIGHT HERE */}
<div className="mb-6 rounded-[28px] border border-green-400/20 bg-green-400/5 p-6">
  <div className="flex items-center justify-between">
    <div>
      <div className="text-xs text-green-400 font-semibold tracking-wide">
        #1 SIGNAL TODAY
      </div>

      <div className="mt-1 text-2xl font-bold text-white">
        EUR/USD — Strong Buy
      </div>

      <div className="mt-2 text-sm text-slate-300">
        AI model detects continuation breakout with strong intraday momentum.
      </div>
    </div>

    <div className="text-right">
      <div className="text-green-400 text-lg font-bold">
        +0.36%
      </div>
      <div className="text-xs text-slate-400">
        projected move
      </div>
    </div>
  </div>
</div>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">Refreshed from the market board and signal engine</div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-[28px] border border-white/10">
          <div className="grid grid-cols-[1.2fr_0.8fr_0.75fr_0.75fr] bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-400">
            <div>Asset</div>
            <div>Action</div>
            <div>Confidence</div>
            <div>Bias</div>
          </div>
          <div className="divide-y divide-white/10">
            {feed.map((item) => {
              const signal = item.quote?.signal;
              if (!signal || !item.quote) return null;
              const buy = signal.action === "BUY";
              const sell = signal.action === "SELL";
              const actionClass = buy
                ? "bg-emerald-400/15 text-emerald-300"
                : sell
                  ? "bg-rose-400/15 text-rose-300"
                  : "bg-amber-400/15 text-amber-300";
              return (
                <button
                  key={`${item.symbol}-${item.assetClass}`}
                  onClick={() => onSelect(item.symbol, item.assetClass)}
                  className="grid w-full grid-cols-[1.2fr_0.8fr_0.75fr_0.75fr] items-center px-4 py-4 text-left transition hover:bg-white/[0.03]"
                >
                  <div>
                    <div className="font-medium text-white">{item.label}</div>
                    <div className="mt-1 text-xs text-slate-400">{item.category} · {signal.trend} · {signal.horizon}</div>
                  </div>
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${actionClass}`}>{signal.action}</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{signal.confidence}%</div>
                  <div className={`text-sm font-semibold ${signal.biasScore >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{signal.biasScore > 0 ? "+" : ""}{signal.biasScore}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.12),transparent_30%),rgba(2,6,23,0.76)] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <BrainCircuit className="h-4 w-4 text-teal-300" />
AI Signal Engine (v2.4)
              <div className="flex items-center gap-2 text-xs text-green-400 mt-2">
  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
  Live scan active
</div>

<div className="text-xs text-slate-400 mt-1">
  Running real-time market scan...
</div>
            </div>
            <div className="mt-4 space-y-3">
              {aiAgents.map((agent) => (
                <div key={agent.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-white">{agent.name}</div>
                    <div className="rounded-full bg-teal-400/10 px-3 py-1 text-xs text-teal-300">{agent.stat}</div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{agent.text}</p>
                </div>
              ))}
            </div>
          </div>

          {feed.slice(0, 2).map((item, index) => {
            const signal = item.quote?.signal;
            if (!signal || !item.quote) return null;
            const positive = item.quote.changePercent >= 0;
            return (
              <div key={`${item.symbol}-detail`} className="rounded-[28px] border border-white/10 bg-slate-950/40 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">#{index + 1} highest conviction</div>
                    <div className="mt-2 text-xl font-semibold text-white">{item.label}</div>
                  </div>
                  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${positive ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300"}`}>
                    {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {positive ? "+" : ""}{item.quote.changePercent.toFixed(2)}%
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{signal.action}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">RSI {signal.rsi}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">R:R {signal.riskReward}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">{signal.summary}</p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-2xl bg-white/5 p-3"><div className="text-slate-400">Entry</div><div className="mt-1 font-semibold text-white">{signal.entry.toFixed(item.assetClass === "forex" ? 5 : 2)}</div></div>
                  <div className="rounded-2xl bg-white/5 p-3"><div className="text-slate-400">TP</div><div className="mt-1 font-semibold text-white">{signal.takeProfit.toFixed(item.assetClass === "forex" ? 5 : 2)}</div></div>
                  <div className="rounded-2xl bg-white/5 p-3"><div className="text-slate-400">SL</div><div className="mt-1 font-semibold text-white">{signal.stopLoss.toFixed(item.assetClass === "forex" ? 5 : 2)}</div></div>
                </div>
                {isPro ? (
                  <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                    <div className="flex items-center gap-2 font-semibold text-emerald-200"><Target className="h-4 w-4" />Pro rationale</div>
                    <div className="mt-2">{signal.rationale.join(" • ")}</div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                    <div className="flex items-center gap-2 font-semibold text-amber-200"><Lock className="h-4 w-4" />Upgrade for full rationale</div>
                    <div className="mt-2">Pro reveals the complete thesis, support and resistance map, and trade planning notes behind every signal.</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white"><Radar className="h-4 w-4 text-teal-300" />Daily habit engine</div>
          <p className="mt-2 text-sm leading-6 text-slate-300">A ranked signal stream gives users a reason to open the desk every day instead of seeing it once and leaving.</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white"><ArrowUpRight className="h-4 w-4 text-emerald-300" />Stronger conversion</div>
          <p className="mt-2 text-sm leading-6 text-slate-300">Active setups sell faster than static claims because traders can instantly picture how they would use the product.</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white"><Crown className="h-4 w-4 text-amber-300" />Premium upsell</div>
          <p className="mt-2 text-sm leading-6 text-slate-300">Keep the ranking visible, then reserve deep rationale, smart alerts, and premium AI modules for Pro.</p>
        </div>
      </div>
    </div>
  );
}
