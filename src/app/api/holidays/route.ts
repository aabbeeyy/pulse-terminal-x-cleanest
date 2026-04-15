import { getMarketHolidays } from "@/lib/providers/finnhub";
import { NextResponse } from "next/server";

export async function GET() {
  const holidays = await getMarketHolidays();
  return NextResponse.json({ holidays });
}
