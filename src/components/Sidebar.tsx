import { BarChart3, Bell, CandlestickChart, Globe, LayoutDashboard, Newspaper } from "lucide-react";

const items = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Signals", icon: CandlestickChart },
  { label: "Charts", icon: BarChart3 },
  { label: "News", icon: Newspaper },
  { label: "Holidays", icon: Bell },
  { label: "Markets", icon: Globe }
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-72 flex-col rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
      <img src="/logo.svg" alt="Market Pulse Pro" className="mb-10 h-10 w-auto" />
      <nav className="space-y-2">
        {items.map(({ label, icon: Icon }, index) => (
          <button
            key={label}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
              index === 0 ? "bg-teal-400/15 text-white" : "text-slate-300 hover:bg-white/5"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl bg-gradient-to-br from-teal-400/20 to-amber-400/10 p-4 text-sm text-slate-200">
        <div className="font-semibold text-white">Realtime intelligence</div>
        <p className="mt-2 text-slate-300">Search assets, monitor news, and get disciplined buy/sell/hold guidance from one dashboard.</p>
      </div>
    </aside>
  );
}
