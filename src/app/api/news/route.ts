
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "EUR/USD";

  try {
    let articles = await getAlphaNews();

    // 🔥 fallback if empty
    if (!articles.length) {
      articles = getFallbackNews(symbol);
    }

    return NextResponse.json({ articles });
  } catch {
    return NextResponse.json({
      articles: getFallbackNews(symbol),
    });
  }
}

/* =========================
   ALPHA NEWS
========================= */
async function getAlphaNews() {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${apiKey}`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  return (
    data.feed?.slice(0, 6).map((item: any) => ({
      id: item.title,
      title: item.title,
      source: item.source,
      summary: item.summary,
      image: item.banner_image,
      url: item.url,
      publishedAt: item.time_published,
    })) || []
  );
}

/* =========================
   FALLBACK (ALWAYS WORKS)
========================= */
function getFallbackNews(symbol: string) {
  return [
    {
      id: 1,
      title: `${symbol} shows increased volatility amid macro uncertainty`,
      source: "Pulse AI",
      summary:
        "Market participants are reacting to global macro developments, leading to increased volatility across major assets.",
      image: "",
      url: "#",
      publishedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Dollar strength impacts forex majors",
      source: "Market Desk",
      summary:
        "The US dollar remains a key driver across FX markets, influencing short-term trend direction.",
      image: "",
      url: "#",
      publishedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Traders focus on momentum and RSI signals",
      source: "AI Signals",
      summary:
        "Momentum indicators and RSI levels continue to guide intraday decision making.",
      image: "",
      url: "#",
      publishedAt: new Date().toISOString(),
    },
  ];
 
}