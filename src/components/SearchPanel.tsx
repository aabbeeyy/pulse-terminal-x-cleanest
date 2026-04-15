"use client";

import { presets } from "@/lib/watchlist";
import type { AssetClass } from "@/lib/types";
import { Search } from "lucide-react";

type Props = {
  symbol: string;
  assetClass: AssetClass;
  setSymbol: (value: string) => void;
  setAssetClass: (value: AssetClass) => void;
  onSearch: () => void;
  loading: boolean;
};

export function SearchPanel({ symbol, assetClass, setSymbol, setAssetClass, onSearch, loading }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-sm text-slate-300">Asset symbol</label>
          <div className="flex items-center rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
            <Search className="mr-3 h-4 w-4 text-slate-400" />
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="AAPL, EUR/USD, XAU/USD, BTC"
              className="w-full bg-transparent text-white outline-none"
            />
          </div>
        </div>
        <div className="xl:w-48">
          <label className="mb-2 block text-sm text-slate-300">Asset class</label>
          <select
            value={assetClass}
            onChange={(e) => setAssetClass(e.target.value as AssetClass)}
            className="w-full rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 text-white outline-none"
          >
            <option value="stock">Stock</option>
            <option value="forex">Forex</option>
            <option value="metal">Metal</option>
            <option value="crypto">Crypto</option>
          </select>
        </div>
        <button
          onClick={onSearch}
          className="rounded-2xl bg-teal-400 px-6 py-3 font-semibold text-ink transition hover:bg-teal-300"
        >
          {loading ? "Loading..." : "Run Analysis"}
        </button>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={`${preset.assetClass}-${preset.symbol}`}
            onClick={() => {
              setSymbol(preset.symbol);
              setAssetClass(preset.assetClass);
            }}
            className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
