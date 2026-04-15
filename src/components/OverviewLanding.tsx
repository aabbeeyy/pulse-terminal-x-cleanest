import { pricingTiers, researchCards } from "@/lib/demo-data";
import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  CandlestickChart,
  CheckCircle2,
  Crown,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { InteractiveTradingShowcase } from "@/components/InteractiveTradingShowcase";
import Link from "next/link";

const pageCards = [
  {
    title: "Dashboard",
    href: "/dashboard",
    text: "Institutional-style workspace with desk modules, market summaries, and stronger premium framing.",
  },
  {
    title: "Signals",
    href: "/signals",
    text: "Ranked trade setups backed by AI rationale and deeper market context.",
  },
  {
    title: "Markets",
    href: "/markets",
    text: "Cross-asset read on forex, metals, crypto, and equities in one view.",
  },
  {
    title: "Charts",
    href: "/charts",
    text: "Focused charting environment with room to analyze instead of scroll.",
  },
  {
    title: "News",
    href: "/news",
    text: "Catalyst-driven headline desk built around event risk and reaction.",
  },
  {
    title: "Alerts",
    href: "/alerts",
    text: "Retention layer that turns one-time visitors into daily users.",
  },
  {
    title: "Academy",
    href: "/academy",
    text: "Education and onboarding that make the desk easier to adopt.",
  },
  {
    title: "Pricing",
    href: "/pricing",
    text: "Clear monetization flow with stronger upgrade contrast and conversion framing.",
  },
];

const outcomeCards = [
  "Ranked signals with cleaner hierarchy, stronger contrast, and faster decision flow.",
  "AI signal engine powering real-time market analysis and premium desk positioning.",
  "A trading desk experience designed to convert insight into execution.",
  "A clearer path from product proof to plans, billing, and conversion.",
];

const trustPoints = [
  "Signal-first workflow",
  "AI desk narrative",
  "Cleaner CTA hierarchy",
  "Premium plan contrast",
];

const aiModules = [
  {
    name: "Momentum AI",
    text: "Continuously scans forex, metals, crypto, and equities for continuation strength, compression breaks, and trend alignment.",
    tone: "text-emerald-300",
    stat: "+12.4% momentum",
  },
  {
    name: "Macro Pulse",
    text: "Weights headline risk, session structure, and calendar context before ranking which setups deserve attention.",
    tone: "text-teal-300",
    stat: "6 catalysts live",
  },
  {
    name: "Risk Guard",
    text: "Filters weaker structures so the desk keeps highlighting cleaner reward-to-risk opportunities.",
    tone: "text-amber-300",
    stat: "11 setups filtered",
  },
];

const trustPills = [
  "Live signals",
  "AI-powered desk",
  "Stripe secure billing",
  "Multi-asset tracking",
];

export function OverviewLanding() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_28%),linear-gradient(135deg,#020617_0%,#07111c_42%,#020617_100%)] shadow-[0_35px_90px_rgba(0,0,0,0.38)]">
        <div className="grid gap-8 p-7 lg:grid-cols-[1.08fr_0.92fr] lg:p-10">
          <div className="py-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs uppercase tracking-[0.26em] text-teal-300">
              <Sparkles className="h-3.5 w-3.5" />
              Premium trading workspace
            </div>

            <h1 className="mt-5 max-w-4xl text-6xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
              AI-powered trading intelligence 
              <span className="block bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">
               for serious market operators.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Pulse Terminal X gives you ranked signals, AI-backed setups, and a real trading desk environment
              so you stop guessing and start executing.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                See plans
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signals"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Open signal desk
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-xs text-slate-300">
              {trustPills.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {outcomeCards.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-200"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] hover:border-teal-300/30">
              <div className="absolute left-10 top-10 z-10 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-300 animate-pulse">
                ● LIVE MARKET
              </div>

              <img
                src="/hero-blue-candles.jpeg"
                alt="Dark trading workstation"
                className="h-[290px] w-full rounded-[26px] object-cover"
              />

              <div className="absolute inset-5 rounded-[26px] bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />

              <div className="pointer-events-none absolute right-10 top-10 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                +5.2% signal edge
              </div>

              <div className="pointer-events-none absolute inset-x-9 bottom-9 rounded-[28px] border border-white/10 bg-slate-950/82 p-5 backdrop-blur-md">
                <div className="text-[11px] uppercase tracking-[0.28em] text-teal-300">
                  Why this converts better
                </div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  A homepage that sells the product before the product pages do
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Lead with confidence, desk proof, and signal quality so visitors understand the value fast and
                  move toward plans naturally.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] hover:border-teal-300/30">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-teal-300" />
                  Sales structure
                </div>
                <div className="mt-3 text-2xl font-semibold text-white">
                  Closer to a $10k SaaS presentation
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  The page rhythm now moves through promise, desk proof, AI system, trust points, plan ladder,
                  and conversion actions instead of repeating generic blocks.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {trustPoints.map((point) => (
                    <span
                      key={point}
                      className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-xs text-slate-300"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] hover:border-amber-300/30">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-slate-400">Monetization</div>
                    <div className="mt-2 text-2xl font-semibold text-white">Clearer plan ladder</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3 text-slate-300">
                    <Crown className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                    Starter access for first-time users
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                    Daily signal habit in the core desk
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                    Pro AI modules and deeper rationale for upsell
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] hover:border-teal-300/30">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <CandlestickChart className="h-4 w-4 text-teal-300" />
            TradingView-style signal framing
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SignalPreviewCard
              label="EUR/USD"
              action="BUY"
              confidence="82%"
              bias="+6"
              summary="Momentum holds above intraday support while RSI stays constructive."
              tone="emerald"
            />
            <SignalPreviewCard
              label="XAU/USD"
              action="SELL"
              confidence="76%"
              bias="-4"
              summary="Gold fades below resistance with weaker follow-through and softer breadth."
              tone="rose"
            />
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] hover:border-teal-300/30">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Bot className="h-4 w-4 text-teal-300" />
            AI Signal Engine v2.4
          </div>
          <div className="mt-4 space-y-3">
            {aiModules.map((module) => (
              <div
                key={module.name}
                className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-white">{module.name}</div>
                  <div
                    className={`rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs ${module.tone}`}
                  >
                    {module.stat}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{module.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {researchCards.slice(0, 4).map((card) => (
          <div
            key={card.title}
            className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] hover:border-teal-300/30"
          >
            <div className="text-sm text-slate-400">{card.stat}</div>
            <div className="mt-3 text-lg font-semibold text-white">{card.title}</div>
            <p className="mt-2 text-sm leading-6 text-slate-300">{card.text}</p>
          </div>
        ))}
      </section>

      <InteractiveTradingShowcase />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pageCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06] hover:border-teal-300/30 hover:shadow-[0_0_24px_rgba(45,212,191,0.12)]"
          >
            <div className="text-lg font-semibold text-white">{card.title}</div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{card.text}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-teal-300">
              Open page
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-[32px] border p-6 transition-all duration-300 ${
              tier.featured
                ? "scale-[1.02] border-amber-300/40 bg-gradient-to-br from-amber-400/10 to-yellow-300/5 shadow-[0_0_40px_rgba(251,191,36,0.25)]"
                : "border-white/10 bg-white/[0.04] shadow-[0_0_30px_rgba(0,0,0,0.15)]"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm uppercase tracking-[0.22em] text-slate-400">
                {tier.audience}
              </div>
              {tier.featured ? (
                <span className="rounded-full bg-amber-300/15 px-3 py-1 text-xs font-semibold text-amber-200">
                  Most popular
                </span>
              ) : null}
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
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] hover:border-teal-300/30">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Radar className="h-4 w-4 text-teal-300" />
            Better retention
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Signals, alerts, and desk modules give users a reason to come back daily instead of bouncing after one page view.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] hover:border-teal-300/30">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <BrainCircuit className="h-4 w-4 text-teal-300" />
            Higher perceived value
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            A stronger narrative and a more active-looking product make the platform feel closer to a premium fintech company than a template.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] hover:border-teal-300/30">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Activity className="h-4 w-4 text-teal-300" />
            Cleaner conversion path
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Visitors move from promise to product proof to plans in a more natural order that supports paid conversion.
          </p>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-gradient-to-r from-teal-500/10 to-emerald-400/10 p-8 text-center shadow-[0_0_40px_rgba(16,185,129,0.12)]">
        <h2 className="text-3xl font-semibold text-white">Stop trading blind.</h2>
        <p className="mt-3 text-slate-300">
          Join traders using Pulse Terminal X to move from noise to structured decisions.
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-flex items-center rounded-full bg-teal-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-200"
        >
          Start now
        </Link>
      </section>
    </div>
  );
}

function SignalPreviewCard({
  label,
  action,
  confidence,
  bias,
  summary,
  tone,
}: {
  label: string;
  action: string;
  confidence: string;
  bias: string;
  summary: string;
  tone: "emerald" | "rose";
}) {
  const chip =
    tone === "emerald" ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300";
  const biasTone = tone === "emerald" ? "text-emerald-300" : "text-rose-300";

  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4 transition-all duration-300 hover:scale-[1.01] hover:border-teal-300/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{label}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
            Signal summary
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${chip}`}>{action}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Confidence</div>
          <div className="mt-1 text-sm font-semibold text-white">{confidence}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Bias</div>
          <div className={`mt-1 text-sm font-semibold ${biasTone}`}>{bias}</div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{summary}</p>
    </div>
  );
}