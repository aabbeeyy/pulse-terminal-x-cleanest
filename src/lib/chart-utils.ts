import type { AssetClass, ChartPoint, Timeframe } from "@/lib/types";

export const timeframeOptions: Array<{ value: Timeframe; label: string }> = [
  { value: "15m", label: "15M" },
  { value: "1h", label: "1H" },
  { value: "4h", label: "4H" },
  { value: "1d", label: "1D" },
  { value: "1w", label: "1W" },
  { value: "1m", label: "1M" }
];

export function baseFor(assetClass: AssetClass, symbol: string) {
  if (assetClass === "forex") return symbol.startsWith("USD/JPY") ? 151.4 : 1.0875;
  if (assetClass === "metal") return symbol.startsWith("XAU") ? 2342.5 : 31.2;
  if (assetClass === "stock") return symbol === "MSFT" ? 414.2 : 214.35;
  return symbol === "ETH" ? 3250 : 65000;
}

function growthFactor(timeframe: Timeframe) {
  if (timeframe === "15m") return 0.0005;
  if (timeframe === "1h") return 0.0009;
  if (timeframe === "4h") return 0.0016;
  if (timeframe === "1d") return 0.0035;
  if (timeframe === "1w") return 0.008;
  return 0.014;
}

function pointCount(timeframe: Timeframe) {
  if (timeframe === "15m") return 48;
  if (timeframe === "1h") return 48;
  if (timeframe === "4h") return 42;
  if (timeframe === "1d") return 40;
  if (timeframe === "1w") return 26;
  return 18;
}

export function formatLabelFromDate(date: Date, timeframe: Timeframe) {
  if (timeframe === "15m" || timeframe === "1h" || timeframe === "4h") {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (timeframe === "1d") {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
  if (timeframe === "1w") {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString([], { month: "short", year: "2-digit" });
}

export function shiftDate(base: Date, timeframe: Timeframe, step: number) {
  const date = new Date(base);
  if (timeframe === "15m") date.setMinutes(date.getMinutes() + step * 15);
  else if (timeframe === "1h") date.setHours(date.getHours() + step);
  else if (timeframe === "4h") date.setHours(date.getHours() + step * 4);
  else if (timeframe === "1d") date.setDate(date.getDate() + step);
  else if (timeframe === "1w") date.setDate(date.getDate() + step * 7);
  else date.setMonth(date.getMonth() + step);
  return date;
}

export function fallbackCandles(start: number, timeframe: Timeframe): ChartPoint[] {
  const count = pointCount(timeframe);
  const drift = growthFactor(timeframe);
  const begin = shiftDate(new Date(), timeframe, -(count - 1));
  let previousClose = start;
  return Array.from({ length: count }, (_, i) => {
    const wave = Math.sin(i / 2.7) * start * drift * 3.8;
    const regime = (i % 5 - 2) * start * drift * 0.8;
    const open = previousClose;
    const close = Number((start + i * start * drift + wave + regime).toFixed(start < 10 ? 5 : 2));
    const high = Number((Math.max(open, close) + Math.abs(start * drift * (0.9 + (i % 4) * 0.2))).toFixed(start < 10 ? 5 : 2));
    const low = Number((Math.min(open, close) - Math.abs(start * drift * (0.8 + (i % 3) * 0.22))).toFixed(start < 10 ? 5 : 2));
    previousClose = close;
    const date = shiftDate(begin, timeframe, i);
    return {
      time: formatLabelFromDate(date, timeframe),
      value: close,
      open: Number(open.toFixed(start < 10 ? 5 : 2)),
      high,
      low,
      close,
    };
  });
}

export function candlesFromCloses(values: Array<{ time: string; value: number }>): ChartPoint[] {
  return values.map((item, index) => {
    const previous = values[index - 1]?.value ?? item.value;
    const open = previous;
    const close = item.value;
    const spread = Math.abs(close - open) || Math.max(close * 0.0025, close < 10 ? 0.0008 : 0.25);
    return {
      time: item.time,
      value: close,
      open,
      close,
      high: Math.max(open, close) + spread * 0.45,
      low: Math.min(open, close) - spread * 0.45
    };
  });
}

export function inferCurrency(symbol: string) {
  return symbol.split("/")[1] || "USD";
}
