import type { HolidayItem } from "@/lib/types";

export function HolidayPanel({ items }: { items: HolidayItem[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
      <div className="mb-4 text-lg font-semibold text-white">Market holidays</div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={`${item.exchange}-${item.date}`} className="rounded-2xl bg-ink/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium text-white">{item.holiday}</div>
                <div className="mt-1 text-sm text-slate-300">{item.exchange} • {item.date}</div>
              </div>
              <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-300">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
