import { fallbackCandles, inferCurrency, baseFor } from "@/lib/chart-utils";
import { buildSignal } from "@/lib/indicators";
import type { AssetClass, ChartPoint, NewsItem, QuotePayload, Timeframe } from "@/lib/types";

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE = "https://www.alphavantage.co/query";

function makeFallback(symbol: string, assetClass: AssetClass, timeframe: Timeframe, currency = "USD"): QuotePayload {
  const chart = fallbackCandles(baseFor(assetClass, symbol), timeframe);
  const values = chart.map((item) => item.close);
  const signal = buildSignal(values, timeframe);

  return {
    symbol,
    assetClass,
    name: symbol,
    price: values.at(-1) ?? baseFor(assetClass, symbol),
    changePercent: Number((((values.at(-1) ?? 0) - (values.at(-2) ?? 0)) / ((values.at(-2) ?? 1) || 1) * 100).toFixed(2)),
    high: Math.max(...values),
    low: Math.min(...values),
    volume: assetClass === "stock" ? 32500000 : undefined,
    currency,
    timeframe,
    chart,
    signal,
    headline: `Demo intelligence for ${symbol} • ${timeframe.toUpperCase()}`,
    updatedAt: new Date().toISOString()
  };
}

function mapAlphaTimeframe(timeframe: Timeframe) {
  if (timeframe === "15m") return { seriesFn: "TIME_SERIES_INTRADAY", interval: "15min", key: "Time Series (15min)" };
  if (timeframe === "1h") return { seriesFn: "TIME_SERIES_INTRADAY", interval: "60min", key: "Time Series (60min)" };
  if (timeframe === "4h") return { seriesFn: "TIME_SERIES_INTRADAY", interval: "60min", key: "Time Series (60min)", aggregate: 4 };
  if (timeframe === "1d") return { seriesFn: "TIME_SERIES_DAILY", key: "Time Series (Daily)" };
  if (timeframe === "1w") return { seriesFn: "TIME_SERIES_WEEKLY", key: "Weekly Time Series" };
  return { seriesFn: "TIME_SERIES_MONTHLY", key: "Monthly Time Series" };
}

function mapAlphaFxTimeframe(timeframe: Timeframe) {
  if (timeframe === "15m") return { fxFn: "FX_INTRADAY", interval: "15min", key: "Time Series FX (15min)" };
  if (timeframe === "1h") return { fxFn: "FX_INTRADAY", interval: "60min", key: "Time Series FX (60min)" };
  if (timeframe === "4h") return { fxFn: "FX_INTRADAY", interval: "60min", key: "Time Series FX (60min)", aggregate: 4 };
  if (timeframe === "1d") return { fxFn: "FX_DAILY", key: "Time Series FX (Daily)" };
  if (timeframe === "1w") return { fxFn: "FX_WEEKLY", key: "Time Series FX (Weekly)" };
  return { fxFn: "FX_MONTHLY", key: "Time Series FX (Monthly)" };
}

function parseOhlcSeries(data: Record<string, Record<string, string>>): ChartPoint[] {
  return Object.entries(data)
    .reverse()
    .map(([time, values]) => ({
      time,
      value: Number(values["4. close"] ?? values["1. open"] ?? 0),
      open: Number(values["1. open"] ?? values["4. close"] ?? 0),
      high: Number(values["2. high"] ?? values["4. close"] ?? 0),
      low: Number(values["3. low"] ?? values["4. close"] ?? 0),
      close: Number(values["4. close"] ?? values["1. open"] ?? 0),
    }))
    .filter((entry) => Number.isFinite(entry.close) && entry.close > 0);
}

function formatTime(value: string, timeframe: Timeframe) {
  const parsed = new Date(value.replace(" ", "T"));
  if (!Number.isNaN(parsed.valueOf())) {
    if (timeframe === "15m" || timeframe === "1h" || timeframe === "4h") {
      return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (timeframe === "1m") {
      return parsed.toLocaleDateString([], { month: "short", year: "2-digit" });
    }
    return parsed.toLocaleDateString([], { month: "short", day: "numeric" });
  }
  return value;
}

function takeWindow(series: ChartPoint[], timeframe: Timeframe) {
  const size = timeframe === "15m" || timeframe === "1h" ? 48 : timeframe === "4h" ? 42 : timeframe === "1d" ? 40 : timeframe === "1w" ? 26 : 18;
  return series.slice(-size);
}

function aggregateSeries(series: ChartPoint[], size: number, timeframe: Timeframe) {
  if (size <= 1) return series;
  const grouped: ChartPoint[] = [];
  for (let i = 0; i < series.length; i += size) {
    const group = series.slice(i, i + size);
    if (!group.length) continue;
    grouped.push({
      time: formatTime(group.at(-1)?.time || group[0].time, timeframe),
      value: group.at(-1)?.close ?? group[0].close,
      open: group[0].open,
      close: group.at(-1)?.close ?? group[0].close,
      high: Math.max(...group.map((item) => item.high)),
      low: Math.min(...group.map((item) => item.low)),
    });
  }
  return grouped;
}

export async function getAlphaVantageQuote(symbol: string, assetClass: AssetClass, timeframe: Timeframe = "1h"): Promise<QuotePayload> {
  if (!API_KEY) return makeFallback(symbol, assetClass, timeframe, inferCurrency(symbol));

  try {
    if (assetClass === "stock") {
      const spec = mapAlphaTimeframe(timeframe);
      const seriesUrl = spec.seriesFn === "TIME_SERIES_INTRADAY"
        ? `${BASE}?function=${spec.seriesFn}&symbol=${encodeURIComponent(symbol)}&interval=${spec.interval}&outputsize=full&apikey=${API_KEY}`
        : `${BASE}?function=${spec.seriesFn}&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;

      const [quoteRes, chartRes] = await Promise.all([
        fetch(`${BASE}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`, { cache: "no-store" }),
        fetch(seriesUrl, { cache: "no-store" })
      ]);
      const quoteJson = await quoteRes.json();
      const chartJson = await chartRes.json();
      const q = quoteJson["Global Quote"];
      let series = parseOhlcSeries(chartJson[spec.key] || {});
      if ("aggregate" in spec && spec.aggregate) series = aggregateSeries(series, spec.aggregate, timeframe);
      series = takeWindow(series, timeframe).map((item) => ({ ...item, time: formatTime(item.time, timeframe) }));

      if (!q && !series.length) return makeFallback(symbol, assetClass, timeframe);
      const fallback = fallbackCandles(baseFor(assetClass, symbol), timeframe);
      const safeSeries = series.length ? series : fallback;
      const values = safeSeries.map((i) => i.close);
      return {
        symbol,
        assetClass,
        name: symbol,
        price: Number(q?.["05. price"] ?? values.at(-1) ?? baseFor(assetClass, symbol)),
        changePercent: Number(q?.["10. change percent"]?.replace("%", "") ?? ((((values.at(-1) ?? 0) - (values.at(-2) ?? 0)) / ((values.at(-2) ?? 1) || 1)) * 100).toFixed(2)),
        high: Number(q?.["03. high"] ?? Math.max(...safeSeries.map((p) => p.high))),
        low: Number(q?.["04. low"] ?? Math.min(...safeSeries.map((p) => p.low))),
        volume: Number(q?.["06. volume"] ?? 0),
        currency: "USD",
        timeframe,
        chart: safeSeries,
        signal: buildSignal(values, timeframe),
        headline: `${symbol} live overview • ${timeframe.toUpperCase()}`,
        updatedAt: new Date().toISOString()
      };
    }

    if (assetClass === "forex" || assetClass === "metal") {
      const [from, toRaw] = symbol.split("/");
      const to = toRaw || "USD";
      const spec = mapAlphaFxTimeframe(timeframe);
      const chartUrl = spec.fxFn === "FX_INTRADAY"
        ? `${BASE}?function=${spec.fxFn}&from_symbol=${from}&to_symbol=${to}&interval=${spec.interval}&outputsize=full&apikey=${API_KEY}`
        : `${BASE}?function=${spec.fxFn}&from_symbol=${from}&to_symbol=${to}&apikey=${API_KEY}`;

      const chartRes = await fetch(chartUrl, { cache: "no-store" });
      const chartJson = await chartRes.json();
      let series = parseOhlcSeries(chartJson[spec.key] || {});
      if ("aggregate" in spec && spec.aggregate) series = aggregateSeries(series, spec.aggregate, timeframe);
      series = takeWindow(series, timeframe).map((item) => ({ ...item, time: formatTime(item.time, timeframe) }));
      if (!series.length) return makeFallback(symbol, assetClass, timeframe, to);
      const values = series.map((item) => item.close);
      return {
        symbol,
        assetClass,
        name: assetClass === "metal" ? (symbol === "XAU/USD" ? "Gold" : symbol === "XAG/USD" ? "Silver" : symbol) : `${from}/${to}`,
        price: values.at(-1) ?? baseFor(assetClass, symbol),
        changePercent: Number((((values.at(-1) ?? 0) - (values.at(-2) ?? 0)) / ((values.at(-2) ?? 1) || 1) * 100).toFixed(2)),
        high: Math.max(...series.map((p) => p.high)),
        low: Math.min(...series.map((p) => p.low)),
        currency: to,
        timeframe,
        chart: series,
        signal: buildSignal(values, timeframe),
        headline: `${symbol} trend map • ${timeframe.toUpperCase()}`,
        updatedAt: new Date().toISOString()
      };
    }

    return makeFallback(symbol, assetClass, timeframe);
  } catch {
    return makeFallback(symbol, assetClass, timeframe, inferCurrency(symbol));
  }
}

export async function getAlphaVantageNews(tickers: string[]): Promise<NewsItem[]> {
  if (!API_KEY) {
    return [
      {
        title: "Demo market headline: central bank expectations keep traders cautious",
        source: "Market Pulse Demo",
        url: "#",
        summary: "Add your Alpha Vantage API key to unlock live news and sentiment.",
        sentiment: "Neutral",
        timePublished: new Date().toISOString()
      }
    ];
  }

  try {
    const res = await fetch(`${BASE}?function=NEWS_SENTIMENT&tickers=${encodeURIComponent(tickers.join(","))}&limit=6&apikey=${API_KEY}`, { cache: "no-store" });
    const json = await res.json();
    return (json.feed || []).slice(0, 6).map((item: Record<string, string>) => ({
      title: item.title,
      source: item.source,
      url: item.url,
      summary: item.summary,
      sentiment: item.overall_sentiment_label,
      timePublished: item.time_published
    }));
  } catch {
    return [];
  }
}
