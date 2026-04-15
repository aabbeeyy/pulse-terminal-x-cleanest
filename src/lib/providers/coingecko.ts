import { candlesFromCloses, fallbackCandles, baseFor } from "@/lib/chart-utils";
import { buildSignal } from "@/lib/indicators";
import type { QuotePayload, Timeframe } from "@/lib/types";

const API_KEY = process.env.COINGECKO_API_KEY;
const BASE = "https://api.coingecko.com/api/v3";

const SYMBOL_TO_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano"
};

function configFor(timeframe: Timeframe) {
  if (timeframe === "15m") return { days: 1, points: 48 };
  if (timeframe === "1h") return { days: 1, points: 24 };
  if (timeframe === "4h") return { days: 7, points: 42 };
  if (timeframe === "1d") return { days: 30, points: 40 };
  if (timeframe === "1w") return { days: 180, points: 26 };
  return { days: 365, points: 18 };
}

function formatLabel(ts: number, timeframe: Timeframe) {
  const date = new Date(ts);
  if (timeframe === "15m" || timeframe === "1h" || timeframe === "4h") {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (timeframe === "1m") {
    return date.toLocaleDateString([], { month: "short", year: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function makeFallback(symbol: string, timeframe: Timeframe): QuotePayload {
  const chart = fallbackCandles(baseFor("crypto", symbol), timeframe);
  const values = chart.map((item) => item.close);
  return {
    symbol,
    assetClass: "crypto",
    name: symbol.toUpperCase(),
    price: chart.at(-1)?.close ?? 0,
    changePercent: Number((((values.at(-1) ?? 0) - (values.at(-2) ?? 0)) / ((values.at(-2) ?? 1) || 1) * 100).toFixed(2)),
    high: Math.max(...chart.map((c) => c.high)),
    low: Math.min(...chart.map((c) => c.low)),
    currency: "USD",
    timeframe,
    chart,
    signal: buildSignal(values, timeframe),
    headline: `${symbol.toUpperCase()} crypto pulse • ${timeframe.toUpperCase()}`,
    updatedAt: new Date().toISOString()
  };
}

export async function getCoinGeckoQuote(symbol: string, timeframe: Timeframe = "1h"): Promise<QuotePayload> {
  const ticker = symbol.toUpperCase();
  const id = SYMBOL_TO_ID[ticker] || "bitcoin";
  const { days, points } = configFor(timeframe);

  try {
    const headers = API_KEY ? { "x-cg-demo-api-key": API_KEY } : undefined;
    const [priceRes, chartRes] = await Promise.all([
      fetch(`${BASE}/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`, { headers, cache: "no-store" }),
      fetch(`${BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`, { headers, cache: "no-store" })
    ]);

    const priceJson = await priceRes.json();
    const chartJson = await chartRes.json();
    const raw = ((chartJson.prices || []) as Array<[number, number]>);
    const step = Math.max(1, Math.floor(raw.length / points));
    const sampled = raw.filter((_, index) => index % step === 0).slice(-points);
    const closes = sampled.map((point) => ({
      time: formatLabel(point[0], timeframe),
      value: Number(point[1].toFixed(2))
    }));
    const chart = closes.length ? candlesFromCloses(closes) : fallbackCandles(baseFor("crypto", symbol), timeframe);
    const values = chart.map((item) => item.close);

    return {
      symbol: ticker,
      assetClass: "crypto",
      name: id.replace(/-/g, " "),
      price: Number(priceJson[id]?.usd ?? values.at(-1) ?? 0),
      changePercent: Number(priceJson[id]?.usd_24h_change?.toFixed?.(2) ?? ((((values.at(-1) ?? 0) - (values.at(-2) ?? 0)) / ((values.at(-2) ?? 1) || 1)) * 100).toFixed(2)),
      high: Math.max(...chart.map((p) => p.high)),
      low: Math.min(...chart.map((p) => p.low)),
      currency: "USD",
      timeframe,
      chart,
      signal: buildSignal(values.length ? values : [0], timeframe),
      headline: `${ticker} crypto pulse • ${timeframe.toUpperCase()}`,
      updatedAt: new Date((priceJson[id]?.last_updated_at ?? Date.now() / 1000) * 1000).toISOString()
    };
  } catch {
    return makeFallback(ticker, timeframe);
  }
}
