"use client";

import { premiumFeatureGrid } from "../../lib/plans";
import { pricingTiers } from "../../lib/demo-data";
import { Check, Crown, Loader2, Lock, Rocket, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type SessionUser = {
  userId: string;
  name: string;
  email: string;
  plan: string;
  subscriptionStatus?: string;
  stripeCustomerId?: string | null;
};

export default function SubscribePage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [message, setMessage] = useState("");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  async function refreshUser() {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    const json = await res.json();
    setUser(json.user || null);
  }

  useEffect(() => {
    void refreshUser();
  }, []);

  async function choosePlan(name: string) {
    setMessage("");
    setLoadingPlan(name);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: name }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unable to start checkout.");
      if (json.url) {
        window.location.href = json.url;
        return;
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to start checkout.");
    } finally {
      setLoadingPlan(null);
    }
  }

  async function openPortal() {
    setPortalLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unable to open billing portal.");
      window.location.href = json.url;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to open billing portal.");
    } finally {
      setPortalLoading(false);
    }
  }

  const bestVersion = [
    "Premium widgets unlock right after Pro payment",
    "Regime board, strategy notes, and sentiment matrix",
    "Advanced AI signal rationale and TradingView desk mode",
    "Faster product unlocks and premium workspace feel",
  ];

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-amber-300"><Crown className="h-4 w-4" />Premium access</div>
          <h1 className="mt-5 text-4xl font-semibold text-white md:text-5xl">Real Stripe-ready pricing for your $9.99 Basic and $29.99 Pro desk.</h1>
          <p className="mx-auto mt-4 max-w-3xl text-slate-300">Plans are tied to the signed-in account, and the Stripe webhook updates the database so access follows the user instead of the browser.</p>

          <div className="mx-auto mt-6 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm text-slate-400">Account status</div>
                <div className="mt-1 text-xl font-semibold text-white">{user ? `${user.name} • ${user.plan}` : "Login required before checkout"}</div>
                <div className="mt-1 text-sm text-slate-300">{user ? `${user.email} • ${user.subscriptionStatus || "inactive"}` : "Use the secure login page so Stripe can connect to your account."}</div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/login" className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5">Login</Link>
                {user?.stripeCustomerId ? (
                  <button onClick={() => void openPortal()} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                    {portalLoading ? "Opening..." : "Billing portal"}
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {message ? <div className="mx-auto mt-4 max-w-2xl rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{message}</div> : null}
        </section>



        <section className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[30px] border border-amber-300/15 bg-gradient-to-br from-amber-400/8 via-slate-950/75 to-slate-950 p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-300"><Sparkles className="h-3.5 w-3.5" />Premium visual upgrade</div>
            <h2 className="mt-4 text-3xl font-semibold text-white">Make the subscription page feel premium before a user even clicks checkout.</h2>
            <p className="mt-3 max-w-2xl text-slate-300">These richer chart and gold visuals help the pricing page feel more polished and more valuable, especially around the Pro plan and premium-desk messaging.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="relative overflow-hidden rounded-[26px] border border-white/10">
                <img src="/hero-gold-world.jpeg" alt="Premium market visuals" className="h-[240px] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-lg font-semibold text-white">Pro desk atmosphere</div>
                  <div className="text-sm text-slate-200">Use this near the featured plan and upgrade banners.</div>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="relative overflow-hidden rounded-[26px] border border-white/10">
                  <img src="/hero-gold-bars-dark.jpeg" alt="Gold premium chart bars" className="h-[112px] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent" />
                </div>
                <div className="relative overflow-hidden rounded-[26px] border border-white/10">
                  <img src="/hero-trader-touch.jpeg" alt="Trader touching chart" className="h-[112px] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Why this helps</div>
            <div className="mt-4 grid gap-3">
              {[
                "Hero-style visuals make the page feel more like a premium trading product.",
                "Gold and chart imagery work especially well around Pro pricing and advanced desk messaging.",
                "Breaking up text-heavy pricing sections with image panels keeps the page more engaging.",
                "A stronger first impression supports retention and makes upgrade prompts feel more polished.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-6 text-slate-200">{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          {pricingTiers.map((tier) => {
            const active = user?.plan === tier.name && user.subscriptionStatus === "active";
            return (
              <div key={tier.name} className={`rounded-[30px] border p-6 ${tier.featured ? "border-teal-300/30 bg-teal-400/10" : "border-white/10 bg-white/[0.04]"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-2xl font-semibold text-white">{tier.name}</div>
                    <div className="mt-1 text-sm text-slate-300">{tier.audience}</div>
                  </div>
                  {active ? <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-950">Active</span> : null}
                </div>
                <div className="mt-5 text-5xl font-semibold text-white">{tier.price}<span className="text-base text-slate-400">/mo</span></div>
                <div className="mt-5 space-y-3 text-sm text-slate-200">
                  {tier.features.map((feature) => <div key={feature} className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-300" />{feature}</div>)}
                </div>
                <button onClick={() => void choosePlan(tier.name)} disabled={!user || loadingPlan === tier.name} className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold disabled:opacity-60 ${active ? "bg-white text-slate-950" : "border border-white/10 bg-black/20 text-white hover:bg-white/5"}`}>
                  {loadingPlan === tier.name ? <Loader2 className="h-4 w-4 animate-spin" /> : tier.featured ? <Sparkles className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  {!user ? "Login to subscribe" : active ? "Current plan" : `Subscribe to ${tier.name}`}
                </button>
              </div>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-teal-300"><Rocket className="h-3.5 w-3.5" />What paying unlocks</div>
            <h2 className="mt-4 text-2xl font-semibold text-white">The best version is the paid desk experience.</h2>
            <div className="mt-5 grid gap-3">
              {bestVersion.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-slate-200">{item}</div>
              ))}
            </div>
          </div>
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-300"><Star className="h-3.5 w-3.5" />Plan grid</div>
            <div className="mt-5 space-y-4 text-sm text-slate-200">
              <div>
                <div className="font-semibold text-white">Basic</div>
                {premiumFeatureGrid.Basic.map((item) => <div key={item} className="mt-2">• {item}</div>)}
              </div>
              <div>
                <div className="font-semibold text-white">Pro</div>
                {premiumFeatureGrid.Pro.map((item) => <div key={item} className="mt-2">• {item}</div>)}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
