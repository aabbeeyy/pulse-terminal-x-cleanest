"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Gem,
  Globe,
  Lock,
  Radar,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { AlertCenter } from "@/components/AlertCenter";
import { AssetChart } from "@/components/AssetChart";
import { HolidayPanel } from "@/components/HolidayPanel";
import NewsPanel from "@/components/NewsPanel";
import { SearchPanel } from "@/components/SearchPanel";
import { SignalCard } from "@/components/SignalCard";
import { SignalFeed } from "@/components/SignalFeed";
import { InteractiveTradingShowcase } from "@/components/InteractiveTradingShowcase";

import { heroFeed, moversConfig, pricingTiers, researchCards } from "@/lib/demo-data";
import { isPaidPlan, isProPlan, premiumFeatureGrid } from "@/lib/plans";
import type { AssetClass, QuotePayload, Timeframe } from "@/lib/types";

type WorkspaceMode =
  | "dashboard"
  | "signals"
  | "markets"
  | "charts"
  | "news"
  | "alerts"
  | "academy"
  | "pricing";

type SessionUser = {
  userId: string;
  name: string;
  email: string;
  plan: string;
  subscriptionStatus?: string;
  stripeCustomerId?: string | null;
};

type HolidayItem = {
  exchange: string;
  date: string;
  holiday: string;
  status: string;
};

type MoversItem = {
  symbol: string;
  label: string;
  category: string;
  assetClass: AssetClass;
  quote: QuotePayload | null;
};

export function MarketWorkspace({ mode }: { mode: WorkspaceMode }) {
  const [symbol, setSymbol] = useState("EUR/USD");
  const [assetClass, setAssetClass] = useState<AssetClass>("forex");
  const [quote, setQuote] = useState<QuotePayload | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("1h");
  const [holidays, setHolidays] = useState<HolidayItem[]>([]);
  const [movers, setMovers] = useState<MoversItem[]>(
    moversConfig.map((item) => ({ ...item, quote: null })),
  );
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<SessionUser | null>(null);

  async function fetchSession() {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const json = await res.json();
      setSession(json.user || null);
    } catch {
      setSession(null);
    }
  }

  async function fetchAsset(
    nextSymbol: string,
    nextAssetClass: AssetClass,
    nextTimeframe: Timeframe,
  ) {
    const res = await fetch(
      `/api/asset?symbol=${encodeURIComponent(nextSymbol)}&assetClass=${nextAssetClass}&timeframe=${nextTimeframe}`,
      { cache: "no-store" },
    );
    const json = await res.json();
    return json.quote as QuotePayload;
  }

  async function loadPrimaryAsset(
    nextSymbol = symbol,
    nextAssetClass = assetClass,
    nextTimeframe = timeframe,
  ) {
    setLoading(true);
    try {
      const [quoteData, holidayRes] = await Promise.all([
        fetchAsset(nextSymbol, nextAssetClass, nextTimeframe),
        fetch(`/api/holidays`, { cache: "no-store" }),
      ]);

      const holidayJson = await holidayRes.json();

      setQuote(quoteData);
      setHolidays(holidayJson.holidays || []);
      setSymbol(nextSymbol);
      setAssetClass(nextAssetClass);
      setTimeframe(nextTimeframe);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPrimaryAsset("EUR/USD", "forex", "1h");
    void fetchSession();

    void (async () => {
      const results = await Promise.all(
        moversConfig.map(async (item) => {
          try {
            const itemQuote = await fetchAsset(item.symbol, item.assetClass, "1h");
            return { ...item, quote: itemQuote };
          } catch {
            return { ...item, quote: null };
          }
        }),
      );

      setMovers(results);
    })();
  }, []);

  const paid = isPaidPlan(session?.plan) && session?.subscriptionStatus === "active";
  const pro = isProPlan(session?.plan) && session?.subscriptionStatus === "active";

  const marketTone = useMemo(() => {
    const changes = movers.map((item) => item.quote?.changePercent || 0);
    const score = changes.reduce((sum, value) => sum + value, 0);

    if (score > 1.5) {
      return {
        label: "Risk-on bias",
        text: "Breadth is leaning positive across the monitored universe.",
      };
    }

    if (score < -1.5) {
      return {
        label: "Defensive tone",
        text: "Cross-asset weakness suggests a more cautious backdrop.",
      };
    }

    return {
      label: "Balanced tape",
      text: "Market internals are mixed, so selectivity matters.",
    };
  }, [movers]);

  const premiumDeskCards = useMemo(() => {
    const primaryChange = quote?.changePercent ?? 0;
    const signal = quote?.signal;

    return [
      {
        title: "Regime board",
        icon: BrainCircuit,
        eyebrow: "Pro desk",
        stat: signal ? `${signal.trend} • ${signal.biasScore}/100` : "Waiting for signal",
        body: signal
          ? `${quote?.symbol || symbol} is reading ${signal.trend.toLowerCase()} with a ${signal.breakout} breakout profile and ${signal.confidence}% confidence.`
          : "Run an analysis to populate the current regime state.",
        chips: [
          signal?.horizon || timeframe.toUpperCase(),
          signal ? `RSI ${signal.rsi.toFixed(0)}` : "RSI --",
          signal ? `Bias ${signal.biasScore}` : "Bias --",
        ],
      },
      {
        title: "Strategy notes",
        icon: ShieldCheck,
        eyebrow: "Execution",
        stat: signal
          ? `${signal.entry.toFixed(assetClass === "forex" ? 5 : 2)} entry`
          : "Plan locked",
        body: signal
          ? `Primary setup maps entry near ${signal.entry.toFixed(assetClass === "forex" ? 5 : 2)} with TP ${signal.takeProfit.toFixed(assetClass === "forex" ? 5 : 2)} and SL ${signal.stopLoss.toFixed(assetClass === "forex" ? 5 : 2)}.`
          : "Pro users get richer strategy notes, scenario planning, and execution framing.",
        chips: [
          signal ? `TP ${signal.takeProfit.toFixed(assetClass === "forex" ? 5 : 2)}` : "TP --",
          signal ? `SL ${signal.stopLoss.toFixed(assetClass === "forex" ? 5 : 2)}` : "SL --",
          signal?.riskReward || "R:R --",
        ],
      },
      {
        title: "Sentiment matrix",
        icon: Gem,
        eyebrow: "Cross-asset",
        stat: primaryChange >= 0 ? "Risk appetite improving" : "Defensive flow active",
        body: movers
          .slice(0, 4)
          .map((item) =>
            `${item.label} ${
              item.quote
                ? `${item.quote.changePercent >= 0 ? "+" : ""}${item.quote.changePercent.toFixed(2)}%`
                : "..."
            }`,
          )
          .join(" • "),
        chips: [marketTone.label, paid ? "Paid desk synced" : "Upgrade for sync", pro ? "Pro refreshed" : "Pro locked"],
      },
    ];
  }, [assetClass, marketTone.label, movers, paid, pro, quote, symbol, timeframe]);

  const board = movers.filter((item) => item.quote);

  const starterGuides = [
    {
      title: "How to read an AI signal card",
      text: "Start with action and confidence, then check entry, take profit, and stop loss before looking at the deeper rationale.",
    },
    {
      title: "Why alerts improve retention",
      text: "Users stick with products longer when the terminal notifies them about price levels and signal shifts instead of asking them to remember everything.",
    },
    {
      title: "How a premium upsell works here",
      text: "The free pages prove value first. Basic and Pro then unlock deeper insights, more alerts, and richer desk modules.",
    },
  ];

  const pageMeta = {
    dashboard: {
      eyebrow: "Workspace",
      title: "A focused trading dashboard instead of one endless page.",
      description:
        "The dashboard keeps the highest-value panels together: search, current signal, charting, and the premium desk preview.",
    },
    signals: {
      eyebrow: "Signals",
      title: "A dedicated signal page makes the product feel alive.",
      description:
        "Lead with ranked ideas, explain why they matter, and keep the premium rationale one click away.",
    },
    markets: {
      eyebrow: "Market board",
      title: "Cross-asset movers deserve their own page.",
      description:
        "This page gives users a faster read on the tape across forex, metals, crypto, and equities.",
    },
    charts: {
      eyebrow: "Chart studio",
      title: "Separate charting from the rest of the dashboard.",
      description:
        "That makes the product feel more professional and gives traders room to focus.",
    },
    news: {
      eyebrow: "Headline desk",
      title: "News should feel like a destination, not a sidebar afterthought.",
      description:
        "Headline risk is easier to scan when it has a dedicated page with chart context nearby.",
    },
    alerts: {
      eyebrow: "Retention",
      title: "Alerts turn one-time visitors into repeat users.",
      description:
        "This page keeps alert creation and active triggers front and center.",
    },
    academy: {
      eyebrow: "Learn",
      title: "An academy page makes the product easier to understand and easier to sell.",
      description:
        "It gives free users a softer entry point and helps justify the paid plans.",
    },
    pricing: {
      eyebrow: "Plans",
      title: "Trade with a clearer value story and a pricing page that feels built to convert.",
      description:
        "This page now pushes outcomes, plan contrast, and a more premium SaaS rhythm instead of looking like a generic checkout list.",
    },
  } as const;

  const meta = pageMeta[mode];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-3 text-xs text-slate-300">
        <div className="flex items-center gap-4">
          <span>
            🌍 Risk: <span className="text-emerald-300">{marketTone.label}</span>
          </span>
          <span>
            📊 Strongest: <span className="text-white">{symbol}</span>
          </span>
          <span>
            ⚡ Volatility: <span className="text-amber-300">Elevated</span>
          </span>
        </div>
        <div className="text-slate-400">Live desk • Updated just now</div>
      </div>

      <section className="rounded-[34px] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.34)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-teal-300">
              <Sparkles className="h-3.5 w-3.5" />
              {meta.eyebrow}
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {meta.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              {meta.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {(mode === "pricing"
              ? [
                  {
                    title: "See plans",
                    text: "Lead with a direct CTA instead of hiding pricing far below the fold.",
                  },
                  {
                    title: "Know your edge",
                    text: "Sell the outcome before the features, then justify the plan differences.",
                  },
                  {
                    title: "Try workspace",
                    text: "Give visitors a second path so pricing feels confident, not desperate.",
                  },
                ]
              : heroFeed
            ).map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="font-semibold text-white">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {mode === "dashboard" && <InteractiveTradingShowcase compact />}

      {mode === "dashboard" && (
        <section className="space-y-6">
          <div className="rounded-[28px] border border-emerald-300/20 bg-emerald-400/10 p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">
              Top setup today
            </div>

            <div className="mt-3 text-2xl font-semibold text-white">
              {symbol} — {quote?.signal?.trend || "Market setup forming"}
            </div>

            <div className="mt-2 text-sm text-slate-300">
              {quote?.signal
                ? `Confidence ${quote.signal.confidence}% with ${quote.signal.breakout} breakout structure`
                : "Run analysis to generate a live signal"}
            </div>

            <div className="mt-4 flex gap-6 text-sm">
              <span>
                Confidence: <span className="text-white">{quote?.signal?.confidence || "--"}%</span>
              </span>
              <span>
                Bias: <span className="text-white">{quote?.signal?.biasScore || "--"}</span>
              </span>
              <span>
                Horizon: <span className="text-white">{quote?.signal?.horizon || "--"}</span>
              </span>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <SearchPanel
                symbol={symbol}
                assetClass={assetClass}
                setSymbol={setSymbol}
                setAssetClass={setAssetClass}
                onSearch={() => void loadPrimaryAsset(symbol, assetClass, timeframe)}
                loading={loading}
              />

              <SignalCard data={quote} isPro={pro} />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Desk summary
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-white">
                    {marketTone.label}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{marketTone.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {board.slice(0, 4).map((item) => (
                      <span
                        key={item.symbol}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
                      >
                        {item.label}{" "}
                        {item.quote
                          ? `${item.quote.changePercent >= 0 ? "+" : ""}${item.quote.changePercent.toFixed(2)}%`
                          : "--"}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Headline snapshot
                  </div>
                  <div className="mt-3 text-lg font-semibold text-white">
                    Why this dashboard is different
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    The dashboard is now an overview page built for workflow, while chart study stays on the charts page by itself.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    <ArrowRight className="h-3.5 w-3.5" />
                    Focused overview layout
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {premiumDeskCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div key={card.title} className="relative">
                      {!pro && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[28px] bg-black/50 backdrop-blur-md">
                          <div className="text-center">
                            <div className="font-semibold text-white">Pro Only</div>
                            <div className="mt-1 text-xs text-slate-300">Unlock full desk</div>
                            <Link
                              href="/pricing"
                              className="mt-3 inline-block rounded-full bg-amber-300 px-4 py-2 text-xs font-semibold text-black"
                            >
                              Upgrade
                            </Link>
                          </div>
                        </div>
                      )}

                      <div className={`rounded-[28px] border border-white/10 bg-white/[0.04] p-5 ${!pro ? "opacity-40" : ""}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                              {card.eyebrow}
                            </div>
                            <div className="mt-2 text-lg font-semibold text-white">
                              {card.title}
                            </div>
                          </div>
                          <div className="rounded-2xl bg-white/5 p-3 text-slate-200">
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>

                        <div className="mt-4 text-xl font-semibold text-teal-300">
                          {card.stat}
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{card.body}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {card.chips.map((chip) => (
                            <span
                              key={chip}
                              className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-4">
                <NewsPanel symbol={symbol} isPro={pro} />
              </div>
            </div>
          </div>
        </section>
      )}

      {mode === "charts" && (
        <section className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
            <div className="space-y-6">
              <SearchPanel
                symbol={symbol}
                assetClass={assetClass}
                setSymbol={setSymbol}
                setAssetClass={setAssetClass}
                onSearch={() => void loadPrimaryAsset(symbol, assetClass, timeframe)}
                loading={loading}
              />
              <SignalCard data={quote} isPro={pro} />
              <HolidayPanel items={holidays} />
            </div>

            <div className="space-y-6">
              <AssetChart
                data={quote}
                timeframe={timeframe}
                onTimeframeChange={(next) => void loadPrimaryAsset(symbol, assetClass, next)}
              />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {premiumDeskCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div key={card.title} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            {card.eyebrow}
                          </div>
                          <div className="mt-2 text-lg font-semibold text-white">
                            {card.title}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-3 text-slate-200">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="mt-4 text-xl font-semibold text-teal-300">{card.stat}</div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{card.body}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {mode === "signals" && (
        <section className="space-y-6">
          <SignalFeed
            items={movers}
            isPro={pro}
            onSelect={(nextSymbol, nextAssetClass) =>
              void loadPrimaryAsset(nextSymbol, nextAssetClass, timeframe)
            }
          />

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <SignalCard data={quote} isPro={pro} />

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
              <div className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Signal lab notes
              </div>
              <div className="mt-4 grid gap-3">
                {researchCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-3xl border border-white/10 bg-slate-950/40 p-4"
                  >
                    <div className="font-medium text-white">{card.title}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{card.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {mode === "markets" && (
        <section className="space-y-6">
          <div className="rounded-[28px] border border-emerald-300/20 bg-gradient-to-br from-emerald-400/10 to-teal-400/5 p-6 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
            <div className="absolute right-5 top-5 hidden items-center gap-2 text-xs text-emerald-300 md:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live setup
            </div>

            <div className="text-xs uppercase tracking-[0.25em] text-emerald-300">
              Top setup today
            </div>

            <div className="mt-3 text-3xl font-semibold text-white">
              {symbol} — {quote?.signal?.trend || "Market setup forming"}
            </div>

            <div className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              {quote?.signal
                ? `${quote.symbol} is showing ${quote.signal.trend.toLowerCase()} structure with ${
                    quote.signal.breakout === "none"
                      ? "range-bound price action and no confirmed breakout yet"
                      : `${quote.signal.breakout} breakout behavior`
                  }. Momentum and RSI alignment suggest continuation potential.`
                : "Run analysis to generate a live AI-backed market setup."}
            </div>

            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                Confidence:{" "}
                <span className="font-semibold text-white">
                  {quote?.signal?.confidence || "--"}%
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                Bias:{" "}
                <span className="font-semibold text-white">
                  {quote?.signal?.biasScore || "--"}
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                Horizon:{" "}
                <span className="font-semibold text-white">
                  {quote?.signal?.horizon || "--"}
                </span>
              </div>
            </div>

            {!pro && (
              <div className="mt-6 rounded-[20px] border border-amber-300/20 bg-amber-400/10 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-amber-300">
                  Pro insight
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  Unlock deeper signal reasoning, full entry/exit strategy, and AI breakdown.
                </div>
                <Link
                  href="/pricing"
                  className="mt-3 inline-block rounded-full bg-amber-300 px-4 py-2 text-xs font-semibold text-black"
                >
                  Upgrade to Pro
                </Link>
              </div>
            )}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-400">Market tone</div>
                  <div className="mt-1 text-3xl font-semibold text-white">
                    {marketTone.label}
                  </div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  {marketTone.text}
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {board.map((item) => (
                  <button
                    key={item.symbol}
                    onClick={() => void loadPrimaryAsset(item.symbol, item.assetClass, timeframe)}
                    className="grid rounded-3xl border border-white/10 bg-slate-950/40 p-4 text-left transition hover:bg-white/[0.05] md:grid-cols-[1fr_0.8fr_0.8fr_0.8fr]"
                  >
                    <div>
                      <div className="font-semibold text-white">{item.label}</div>
                      <div className="mt-1 text-sm text-slate-400">{item.category}</div>
                    </div>

                    <div className="mt-3 text-sm text-slate-300 md:mt-0">
                      {item.quote?.signal.action}
                    </div>
                    <div className="mt-3 text-sm font-semibold text-white md:mt-0">
                      {item.quote?.signal.confidence}%
                    </div>
                    <div
                      className={`mt-3 text-sm font-semibold md:mt-0 ${
                        (item.quote?.changePercent || 0) >= 0 ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {(item.quote?.changePercent || 0) >= 0 ? "+" : ""}
                      {item.quote?.changePercent.toFixed(2)}%
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <SignalCard data={quote} isPro={pro} />
              <HolidayPanel items={holidays} />
            </div>
          </div>
        </section>
      )}

      {mode === "news" && (
        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <NewsPanel symbol={symbol} isPro={pro} />
            <HolidayPanel items={holidays} />
          </div>
          <div className="space-y-6">
            <AssetChart
              data={quote}
              timeframe={timeframe}
              onTimeframeChange={(next) => void loadPrimaryAsset(symbol, assetClass, next)}
            />
            <SignalCard data={quote} isPro={pro} />
          </div>
        </section>
      )}

      {mode === "alerts" && (
        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <AlertCenter quote={quote} isPro={pro} />
          <div className="space-y-6">
            <SignalCard data={quote} isPro={pro} />
            <AssetChart
              data={quote}
              timeframe={timeframe}
              onTimeframeChange={(next) => void loadPrimaryAsset(symbol, assetClass, next)}
            />
          </div>
        </section>
      )}

      {mode === "academy" && (
        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
              <BookOpen className="h-3.5 w-3.5" />
              Starter guides
            </div>

            <div className="mt-5 grid gap-4">
              {starterGuides.map((guide) => (
                <div
                  key={guide.title}
                  className="rounded-3xl border border-white/10 bg-slate-950/40 p-5"
                >
                  <div className="text-lg font-semibold text-white">{guide.title}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{guide.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">
              Plan education
            </div>

            <div className="mt-4 grid gap-4">
              {Object.entries(premiumFeatureGrid).map(([plan, features]) => (
                <div
                  key={plan}
                  className="rounded-3xl border border-white/10 bg-slate-950/40 p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xl font-semibold text-white">{plan}</div>
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      {plan === "Pro" ? "Best for heavy users" : "Great first upgrade"}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    {features.map((feature) => (
                      <div
                        key={feature}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {mode === "pricing" && (
        <section className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-slate-950 via-[#07131d] to-slate-950 p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-teal-300">
                <Sparkles className="h-3.5 w-3.5" />
                Trading plans
              </div>

              <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-white md:text-4xl">
                Choose the setup that fits how serious you are about strategy testing.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Lead with a bold promise, show the workflow, then let visitors pick between starter access and a deeper premium trading desk.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/subscribe"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
                >
                  See plans
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
                >
                  Try workspace
                </Link>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {[
                  "Validate setups before real risk.",
                  "Keep charts, news, and signals in one flow.",
                  "Upgrade only when deeper tools are worth it.",
                  "Give the product a stronger fintech face.",
                ].map((line) => (
                  <div
                    key={line}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6">
              <div className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Current account
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-2xl font-semibold text-white">
                    {session ? session.name : "Guest visitor"}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    This panel keeps the account state visible while the rest of the page pushes outcomes and plan contrast.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 p-3 text-slate-300">
                  <Lock className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                  <span>Plan</span>
                  <strong className="text-white">{session?.plan || "Free"}</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                  <span>Status</span>
                  <strong className="text-white">{session?.subscriptionStatus || "inactive"}</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                  <span>Best version unlocked</span>
                  <strong className="text-white">{pro ? "Yes" : "Upgrade to Pro"}</strong>
                </div>
              </div>

              <img
                src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Trading workstation"
                className="mt-5 h-[220px] w-full rounded-[24px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-[32px] border p-6 ${
                  tier.featured
                    ? "border-amber-300/20 bg-amber-400/10"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                <div className="text-sm uppercase tracking-[0.24em] text-slate-400">
                  {tier.audience}
                </div>
                <div className="mt-3 flex items-end gap-3">
                  <div className="text-4xl font-semibold text-white">{tier.name}</div>
                  <div className="text-2xl text-teal-300">{tier.price}</div>
                </div>

                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  {tier.features.map((feature) => (
                    <div
                      key={feature}
                      className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3"
                    >
                      {feature}
                    </div>
                  ))}
                </div>

                <Link
                  href="/subscribe"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950"
                >
                  Choose {tier.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-300">
              A dedicated pricing destination is easier to send in demos, outreach, and buyer conversations than pricing buried in a long homepage.
            </div>
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-300">
              The plan cards now read more like a product ladder: start light, then unlock richer desk tools as trust builds.
            </div>
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-300">
              The stronger hero, CTA rhythm, and visuals make the product feel closer to a premium fintech brand.
            </div>
          </div>
        </section>
      )}

      {(mode === "dashboard" || mode === "academy" || mode === "pricing") && (
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Globe className="h-4 w-4 text-teal-300" />
              Cross-page flow
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              People can now move from landing page to dashboard to pricing without feeling lost in a single oversized page.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Radar className="h-4 w-4 text-amber-300" />
              Better positioning
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Splitting the product into dedicated pages makes it feel more like a real SaaS platform and less like a prototype.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Zap className="h-4 w-4 text-emerald-300" />
              Cleaner selling story
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              You can demo the strongest page first, then guide buyers through the other pages based on what they care about.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}