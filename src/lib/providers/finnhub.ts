import type { HolidayItem } from "@/lib/types";

const API_KEY = process.env.FINNHUB_API_KEY;

export async function getMarketHolidays(exchange = "US"): Promise<HolidayItem[]> {
  if (!API_KEY) {
    return [
      { exchange: "NYSE", date: "2026-05-25", holiday: "Memorial Day", status: "Closed" },
      { exchange: "NASDAQ", date: "2026-07-03", holiday: "Independence Day (Observed)", status: "Closed" },
      { exchange: "NYSE", date: "2026-09-07", holiday: "Labor Day", status: "Closed" }
    ];
  }

  try {
    const year = new Date().getFullYear();
    const res = await fetch(`https://finnhub.io/api/v1/stock/market-holiday?exchange=${exchange}&token=${API_KEY}`, { cache: "no-store" });
    const json = await res.json();
    return (json.data || [])
      .filter((item: { atDate: string }) => item.atDate.startsWith(String(year)))
      .slice(0, 8)
      .map((item: { exchange: string; atDate: string; eventName: string; tradingHour: string }) => ({
        exchange: item.exchange,
        date: item.atDate,
        holiday: item.eventName,
        status: item.tradingHour || "Closed"
      }));
  } catch {
    return [];
  }
}
