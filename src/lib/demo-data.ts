import type { AssetClass } from "@/lib/types";

export const heroFeed = [
  {
    title: "Macro pulse engine",
    text: "Blend live quotes, sentiment, calendar risk, and technical structure in one research flow."
  },
  {
    title: "Action bias matrix",
    text: "Rank forex, metals, crypto, and equities by momentum, RSI, and intraday trend alignment."
  },
  {
    title: "Analyst-style layout",
    text: "Inspired by professional market intelligence products with a cleaner SaaS-grade interface."
  }
];

export const moversConfig: Array<{ symbol: string; assetClass: AssetClass; label: string; category: string }> = [
  { symbol: "EUR/USD", assetClass: "forex", label: "EUR/USD", category: "Forex" },
  { symbol: "USD/JPY", assetClass: "forex", label: "USD/JPY", category: "Forex" },
  { symbol: "XAU/USD", assetClass: "metal", label: "Gold", category: "Metal" },
  { symbol: "XAG/USD", assetClass: "metal", label: "Silver", category: "Metal" },
  { symbol: "BTC", assetClass: "crypto", label: "Bitcoin", category: "Crypto" },
  { symbol: "ETH", assetClass: "crypto", label: "Ethereum", category: "Crypto" },
  { symbol: "AAPL", assetClass: "stock", label: "Apple", category: "Equity" },
  { symbol: "MSFT", assetClass: "stock", label: "Microsoft", category: "Equity" }
];

export const researchCards = [
  {
    title: "Technical overview",
    text: "Turn raw price movement into structured direction, confidence, support/resistance, and trade rationale.",
    stat: "AI signal"
  },
  {
    title: "News intelligence",
    text: "Keep headline risk beside the chart so the dashboard feels more like a desk terminal than a toy app.",
    stat: "Live feed"
  },
  {
    title: "Calendar risk",
    text: "Pair signals with exchange closures and liquidity context before acting on a setup.",
    stat: "Holiday aware"
  },
  {
    title: "User workspace",
    text: "Login, save watchlists, and simulate premium subscription flows for a fuller product experience.",
    stat: "Account ready"
  }
];

export const pricingTiers = [
  {
    name: "Basic",
    price: "$9.99",
    audience: "For everyday traders and research",
    features: ["Live dashboard access", "Stocks, forex, crypto, and metals", "TradingView charts", "Core AI signals"]
  },
  {
    name: "Pro",
    price: "$29.99",
    audience: "For active market researchers",
    features: ["Advanced AI signals", "TradingView desk mode", "Premium widgets unlock after payment", "Economic calendar and faster refresh"],
    featured: true
  }
];
