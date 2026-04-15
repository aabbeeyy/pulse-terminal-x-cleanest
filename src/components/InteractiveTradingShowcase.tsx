"use client";

import Link from "next/link";
import { ArrowUpRight, CandlestickChart, Newspaper, Radar, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

type CardItem = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  stat: string;
  tag: string;
  accent: string;
};

const cards: CardItem[] = [
  {
    title: "Precision chart replay",
    subtitle: "A sharper chart-first visual with darker contrast, cleaner framing, and a stronger premium research mood.",
    href: "/charts",
    image: "https://images.pexels.com/photos/7567558/pexels-photo-7567558.jpeg?auto=compress&cs=tinysrgb&w=1600",
    stat: "12 synced layouts",
    tag: "Charts",
    accent: "text-cyan-200",
  },
  {
    title: "Catalyst and macro coverage",
    subtitle: "Headline context, event-driven storytelling, and terminal-style visuals that feel built into the product.",
    href: "/news",
    image: "https://images.pexels.com/photos/6770775/pexels-photo-6770775.jpeg?auto=compress&cs=tinysrgb&w=1600",
    stat: "31 live catalysts",
    tag: "News",
    accent: "text-amber-200",
  },
  {
    title: "Trader performance desk",
    subtitle: "An aspirational workspace presentation with premium spacing, richer hierarchy, and more valuable visual energy.",
    href: "/dashboard",
    image: "https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=1600",
    stat: "94/100 desk score",
    tag: "Dashboard",
    accent: "text-emerald-200",
  },
];

function tiltStyle(x: number, y: number) {
  const rotateX = ((0.5 - y) * 5.5).toFixed(2);
  const rotateY = ((x - 0.5) * 7.5).toFixed(2);
  return {
    transform: `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01,1.01,1.01)`,
  };
}

export function InteractiveTradingShowcase({ compact = false }: { compact?: boolean }) {
  const [hovered, setHovered] = useState<number | null>(0);
  const [cursor, setCursor] = useState<Record<number, { x: number; y: number }>>({});

  const activeCard = useMemo(() => cards[hovered ?? 0], [hovered]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-amber-200">
            <Sparkles className="h-3.5 w-3.5" /> Product visuals
          </div>
          <div className="mt-3 text-2xl font-semibold text-white">Fresh web images that feel like product proof instead of filler.</div>
        </div>
        <Link href={activeCard.href} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
          Open {activeCard.tag.toLowerCase()} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className={`grid gap-4 ${compact ? "lg:grid-cols-3" : "xl:grid-cols-[1.08fr_0.96fr_0.96fr]"}`}>
        {cards.map((card, index) => {
          const point = cursor[index] ?? { x: 0.5, y: 0.5 };
          const isActive = hovered === index;
          return (
            <Link
              key={card.title}
              href={card.href}
              onMouseEnter={() => setHovered(index)}
              onFocus={() => setHovered(index)}
              onMouseMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width;
                const y = (event.clientY - bounds.top) / bounds.height;
                setCursor((prev) => ({ ...prev, [index]: { x, y } }));
              }}
              className={`group relative overflow-hidden rounded-[30px] border p-4 transition duration-300 ${
                isActive ? "border-teal-300/30 bg-white/[0.06]" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.055]"
              }`}
              style={tiltStyle(point.x, point.y)}
            >
              <div className="relative min-h-[320px] overflow-hidden rounded-[24px] md:min-h-[350px]">
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.14),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.16)_0%,rgba(2,6,23,0.56)_44%,rgba(2,6,23,0.96)_100%)]" />
                <div
                  className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-teal-300/20 blur-3xl transition duration-300"
                  style={{ transform: `translate(${(point.x - 0.5) * 24}px, ${(point.y - 0.5) * 20}px)` }}
                />

                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span className="rounded-full border border-white/15 bg-slate-950/60 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-slate-200">{card.tag}</span>
                  <span className={`rounded-full bg-slate-950/65 px-3 py-1 text-xs font-medium ${card.accent}`}>{card.stat}</span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 md:pr-36">
                  <div className="max-w-sm text-2xl font-semibold text-white">{card.title}</div>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-200">{card.subtitle}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-xs text-slate-200">Hover motion</span>
                    <span className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-xs text-slate-200">Premium contrast</span>
                    <span className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-xs text-slate-200">Visual proof</span>
                  </div>
                </div>

                <div className="absolute right-4 top-4 hidden w-[120px] rounded-[22px] border border-white/10 bg-slate-950/72 p-3 backdrop-blur-sm md:block">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CandlestickChart className="h-3.5 w-3.5 text-teal-300" /> Signal pulse
                  </div>
                  <div className="mt-2 h-16 rounded-2xl bg-gradient-to-br from-white/10 via-teal-300/10 to-emerald-300/5 p-2">
                    <div className="flex h-full items-end gap-1">
                      {[26, 38, 32, 58, 40, 66, 48, 74].map((height, barIndex) => (
                        <span
                          key={barIndex}
                          className="w-full rounded-t-full bg-white/80 transition duration-300 group-hover:-translate-y-1"
                          style={{ height: `${height}%`, transitionDelay: `${barIndex * 30}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
          <div className="flex items-center gap-2 text-white"><Radar className="h-4 w-4 text-teal-300" /> Better hierarchy</div>
          <p className="mt-2 leading-6">The signal widget stays high and compact so the headline copy remains fully readable.</p>
        </div>
        <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
          <div className="flex items-center gap-2 text-white"><Newspaper className="h-4 w-4 text-amber-300" /> Stronger storytelling</div>
          <p className="mt-2 leading-6">Each image is tied to a page purpose, so the visuals help sell the platform instead of just decorating it.</p>
        </div>
        <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
          <div className="flex items-center gap-2 text-white"><Sparkles className="h-4 w-4 text-fuchsia-300" /> More premium feel</div>
          <p className="mt-2 leading-6">Fresh internet-served visuals make the terminal feel more expensive while staying distinct from your uploaded images.</p>
        </div>
      </div>
    </div>
  );
}
