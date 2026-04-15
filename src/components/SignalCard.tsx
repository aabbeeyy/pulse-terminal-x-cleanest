"use client";

import Link from "next/link";
import {
  BrainCircuit,
  CandlestickChart,
  Crown,
  Lock,
  Radar,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { QuotePayload } from "@/lib/types";

type Props = {
  data: QuotePayload | null;
  isPro?: boolean;
};

function format(v?: number, d = 5) {
  if (!v && v !== 0) return "--";
  return v.toFixed(d);
}

export function SignalCard({ data, isPro = false }: Props) {
  const s = data?.signal;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-400">
            Primary setup
          </div>
          <div className="mt-1 text-3xl font-semibold text-white">
            {data?.symbol || "EUR/USD"}
          </div>
        </div>

        <div className="flex gap-3">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
            {s?.action || "BUY"} · {s?.confidence || "--"}%
          </span>
          <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300">
            {data?.changePercent?.toFixed(2) || "--"}%
          </span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="space-y-5">
          {/* PRICE CARD */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-slate-400">Live price</div>
            <div className="mt-2 text-3xl font-semibold text-white">
              ${format(data?.price, 5)}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Mini label="Entry" value={format(s?.entry)} />
              <Mini label="TP" value={format(s?.takeProfit)} />
              <Mini label="SL" value={format(s?.stopLoss)} />
            </div>
          </div>

          {/* CONTEXT */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-white">
              <Radar className="h-4 w-4 text-amber-300" />
              Setup context
            </div>

            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <Row label="Trend" value={s?.trend} />
              <Row label="RSI" value={s?.rsi?.toFixed(1)} />
              <Row label="Horizon" value={s?.horizon} />
            </div>
          </div>

          {/* SUPPORT / RESISTANCE */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Box label="Support" value={format(s?.support)} />
            <Box label="Resistance" value={format(s?.resistance)} />
          </div>

          {/* PRO MAP */}
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
            <div className="flex items-center gap-2 text-white">
              <TrendingUp className="h-4 w-4" />
              Trade map
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <BoxSmall label="Action" value={s?.action} />
              <BoxSmall label="Conf" value={`${s?.confidence || "--"}%`} />
              <BoxSmall label="Bias" value={s?.biasScore?.toString()} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-5">
          {/* AI THESIS */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-2 text-white">
                <BrainCircuit className="h-4 w-4 text-teal-300" />
                AI thesis
              </div>

              <span className="flex items-center gap-2 text-xs text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-300">
              {data?.symbol} shows {s?.trend || "neutral"} structure with{" "}
              {s?.confidence || "--"}% confidence.
            </p>
          </div>

          {/* AI ENGINE */}
          <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4">
            <div className="flex items-center gap-2 text-indigo-200">
              <Sparkles className="h-4 w-4" />
              AI engine
            </div>

            <div className="mt-3 grid grid-cols-3 text-center text-sm">
              <Stat label="Momentum" value="78%" />
              <Stat label="Volatility" value="64%" />
              <Stat label="Liquidity" value="81%" />
            </div>
          </div>

          {/* UPSSELL */}
          <div className="relative rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4">
            {!isPro && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur">
                <div className="text-center">
                  <div className="text-white">Pro only</div>
                  <Link href="/pricing" className="mt-2 inline-block text-xs text-amber-300">
                    Upgrade
                  </Link>
                </div>
              </div>
            )}

            <div className={!isPro ? "opacity-40" : ""}>
              <div className="flex items-center gap-2 text-white">
                <Lock className="h-4 w-4" />
                Premium tools
              </div>

              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>• Scenario engine</li>
                <li>• Strategy notes</li>
                <li>• Position planning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* SMALL COMPONENTS */

function Mini({ label, value }: any) {
  return (
    <div className="rounded-xl bg-black/30 p-2 text-center">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-sm text-white">{value}</div>
    </div>
  );
}

function Row({ label, value }: any) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="text-white">{value || "--"}</span>
    </div>
  );
}

function Box({ label, value }: any) {
  return (
    <div className="rounded-xl bg-black/30 p-3">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-lg text-white">{value}</div>
    </div>
  );
}

function BoxSmall({ label, value }: any) {
  return (
    <div className="rounded-xl bg-black/30 p-2 text-center">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-sm text-white">{value}</div>
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-white">{value}</div>
    </div>
  );
}