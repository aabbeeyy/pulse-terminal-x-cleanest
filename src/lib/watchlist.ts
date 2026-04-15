import type { SearchPreset } from "@/lib/types";

export const presets: SearchPreset[] = [
  { label: "Apple", symbol: "AAPL", assetClass: "stock" },
  { label: "Microsoft", symbol: "MSFT", assetClass: "stock" },
  { label: "EUR/USD", symbol: "EUR/USD", assetClass: "forex" },
  { label: "USD/JPY", symbol: "USD/JPY", assetClass: "forex" },
  { label: "Gold", symbol: "XAU/USD", assetClass: "metal" },
  { label: "Silver", symbol: "XAG/USD", assetClass: "metal" },
  { label: "Bitcoin", symbol: "BTC", assetClass: "crypto" },
  { label: "Ethereum", symbol: "ETH", assetClass: "crypto" }
];
