"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Newspaper, Sparkles } from "lucide-react";

type NewsArticle = {
  id: number | string;
  title: string;
  source: string;
  summary: string;
  image?: string;
  url: string;
  publishedAt: string;
  related?: string;
  category?: string;
};

export default function NewsPanel({
  symbol,
  isPro,
}: {
  symbol: string;
  isPro?: boolean;
}) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadNews() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/news?symbol=${encodeURIComponent(symbol)}`, {
          cache: "no-store",
        });

        const json = await res.json();

        if (!active) return;

        if (!res.ok) {
          setError(json.error || "Unable to load news.");
          setArticles([]);
          return;
        }

        setArticles(json.articles || []);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load news.");
        setArticles([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadNews();

    return () => {
      active = false;
    };
  }, [symbol]);

  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300">
            <Newspaper className="h-3.5 w-3.5 text-teal-300" />
            News desk
          </div>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            Market headlines for {symbol}
          </h3>
        </div>

        {isPro ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            Pro context
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
            >
              <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-3 w-full animate-pulse rounded bg-white/5" />
              <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-white/5" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-5 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-300">
          No news found for this asset right now.
        </div>
      ) : (
        <div className="mt-5 grid gap-4">
          {articles.map((article) => (
            <article
              key={article.id}
              className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/40"
            >
              <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                <div className="h-full min-h-[140px] bg-slate-900">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                      <Newspaper className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{article.publishedAt}</span>
                    {article.category ? (
                      <>
                        <span>•</span>
                        <span className="uppercase">{article.category}</span>
                      </>
                    ) : null}
                  </div>

                  <h4 className="mt-2 text-lg font-semibold text-white">
                    {article.title}
                  </h4>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {article.summary || "No summary available."}
                  </p>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-teal-300 hover:text-teal-200"
                  >
                    Open article
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}