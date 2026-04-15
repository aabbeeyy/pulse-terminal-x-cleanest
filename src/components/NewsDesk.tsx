
"use client";

import { useEffect, useState } from "react";

type Article = {
  id: string;
  title: string;
  source: string;
  summary: string;
  url: string;
  image?: string;
  publishedAt: string;
};

export function NewsDesk({ symbol = "EUR/USD" }) {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch(`/api/news?symbol=${symbol}`)
      .then((res) => res.json())
      .then((data) => setArticles(data.articles || []));
  }, [symbol]);

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#0f172a] to-[#020617] p-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          📰 Market headlines
        </h2>
        <span className="text-xs text-emerald-400">Live</span>
      </div>

      {/* NEWS LIST */}
      <div className="space-y-4">
        {articles.map((a) => (
          <a
            key={a.id}
            href={a.url}
            target="_blank"
            className="block rounded-xl border border-white/10 p-4 hover:bg-white/5 transition"
          >
            <div className="text-sm text-slate-400 mb-1">
              {a.source}
            </div>

            <div className="text-white font-medium">
              {a.title}
            </div>

            <div className="text-sm text-slate-400 mt-1 line-clamp-2">
              {a.summary}
            </div>
          </a>
        ))}
      </div>
    </div>
  );

}