import { getAlphaVantageNews, getAlphaVantageQuote } from "@/lib/providers/alphavantage";
import { getCoinGeckoQuote } from "@/lib/providers/coingecko";
import { getTwelveDataQuote } from "@/lib/providers/twelvedata";
import type { AssetClass, Timeframe } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = (searchParams.get("symbol") || "AAPL").toUpperCase();
  const assetClass = (searchParams.get("assetClass") || "stock") as AssetClass;
  const timeframe = (searchParams.get("timeframe") || "1h") as Timeframe;

  try {
    const quote = assetClass === "crypto"
      ? await getCoinGeckoQuote(symbol, timeframe)
      : (assetClass === "forex" || assetClass === "metal")
        ? (await getTwelveDataQuote(symbol, assetClass, timeframe)) ?? await getAlphaVantageQuote(symbol, assetClass, timeframe)
        : await getAlphaVantageQuote(symbol, assetClass, timeframe);

    const tickers = assetClass === "forex" || assetClass === "metal"
      ? []
      : [symbol.replace("/", "")];
    const news = await getAlphaVantageNews(tickers.length ? tickers : ["IBM"]);

    return NextResponse.json({ quote, news });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
