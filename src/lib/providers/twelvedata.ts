import { baseFor, fallbackCandles, formatLabelFromDate, inferCurrency } from "@/lib/chart-utils";
import { buildSignal } from "@/lib/indicators";
import type { AssetClass, ChartPoint, QuotePayload, Timeframe } from "@/lib/types";

const API_KEY = process.env.TWELVE_DATA_API_KEY;
const BASE = "https://api.twelvedata.com";

function makeFallback(symbol: string, assetClass: AssetClass, timeframe: Timeframe, currency = "USD"): QuotePayload {
  const chart = fallbackCandles(baseFor(assetClass, symbol), timeframe);
  const values = chart.map((item) => item.close);
  return {
    symbol,
    assetClass,
    name: symbol,
    price: values.at(-1) ?? baseFor(assetClass, symbol),
    changePercent: Number((((values.at(-1) ?? 0) - (values.at(-2) ?? 0)) / ((values.at(-2) ?? 1) || 1) * 100).toFixed(2)),
    high: Math.max(...chart.map((p) => p.high)),
    low: Math.min(...chart.map((p) => p.low)),
    volume: assetClass === "stock" ? 32500000 : undefined,
    currency,
    timeframe,
    chart,
    signal: buildSignal(values, timeframe),
    headline: `Demo intelligence for ${symbol} • ${timeframe.toUpperCase()}`,
    updatedAt: new Date().toISOString()
  };
}

function normalizeSymbol(symbol: string) {
  return symbol.replace(/\s+/g, "").toUpperCase();
}

function mapTimeframe(timeframe: Timeframe) {
  if (timeframe === "15m") return { interval: "15min", outputsize: 48 };
  if (timeframe === "1h") return { interval: "1h", outputsize: 48 };
  if (timeframe === "4h") return { interval: "4h", outputsize: 42 };
  if (timeframe === "1d") return { interval: "1day", outputsize: 40 };
  if (timeframe === "1w") return { interval: "1week", outputsize: 26 };
  return { interval: "1month", outputsize: 18 };
}

function formatTime(value: string, timeframe: Timeframe) {
  const parsed = new Date(value.replace(" ", "T"));
  if (!Number.isNaN(parsed.valueOf())) {
    return formatLabelFromDate(parsed, timeframe);
  }
  return value;
}

export async function getTwelveDataQuote(symbol: string, assetClass: AssetClass, timeframe: Timeframe = "1h"): Promise<QuotePayload | null> {
  if (!API_KEY || !["forex", "metal"].includes(assetClass)) return null;

  const normalized = normalizeSymbol(symbol);
  const { interval, outputsize } = mapTimeframe(timeframe);
  const chartSeed = baseFor(assetClass, normalized);

  try {
    const [quoteRes, chartRes] = await Promise.all([
      fetch(`${BASE}/quote?symbol=${encodeURIComponent(normalized)}&apikey=${API_KEY}`, { cache: "no-store" }),
      fetch(`${BASE}/time_series?symbol=${encodeURIComponent(normalized)}&interval=${interval}&outputsize=${outputsize}&timezone=UTC&apikey=${API_KEY}`, { cache: "no-store" }),
    ]);

    const quoteJson = await quoteRes.json();
    const chartJson = await chartRes.json();

    if (quoteJson?.status === "error" || chartJson?.status === "error") {
      return null;
    }

    const values = Array.isArray(chartJson?.values) ? [...chartJson.values].reverse() : [];
    const chart = values
      .map((item: Record<string, string>) => ({
        time: formatTime(String(item.datetime || ""), timeframe),
        value: Number(item.close ?? item.open ?? 0),
        open: Number(item.open ?? item.close ?? 0),
        high: Number(item.high ?? item.close ?? 0),
        low: Number(item.low ?? item.close ?? 0),
        close: Number(item.close ?? item.open ?? 0),
      }))
      .filter((item: ChartPoint) => Number.isFinite(item.close) && item.close > 0);

    const series = chart.length ? chart : fallbackCandles(chartSeed, timeframe);
    const closes = series.map((item) => item.close);
    const price = Number(quoteJson?.close ?? quoteJson?.price ?? closes.at(-1) ?? 0);

    if (!Number.isFinite(price) || price <= 0) {
      return null;
    }

    return {
      symbol: normalized,
      assetClass,
      name: assetClass === "metal" ? (normalized.startsWith("XAU") ? "Gold" : normalized.startsWith("XAG") ? "Silver" : normalized) : normalized,
      price,
      changePercent: Number(quoteJson?.percent_change ?? (((closes.at(-1) ?? price) - (closes.at(-2) ?? price)) / ((closes.at(-2) ?? price) || price) * 100).toFixed(2)),
      high: Number(quoteJson?.high ?? Math.max(...series.map((p) => p.high))),
      low: Number(quoteJson?.low ?? Math.min(...series.map((p) => p.low))),
      volume: quoteJson?.volume ? Number(quoteJson.volume) : undefined,
      currency: inferCurrency(normalized),
      timeframe,
      chart: series,
      signal: buildSignal(closes, timeframe),
      headline: `${normalized} live overview • ${timeframe.toUpperCase()}`,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return makeFallback(normalized, assetClass, timeframe, inferCurrency(normalized));
  }
}
