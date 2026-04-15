import { Bell, BookOpen, CandlestickChart, LayoutDashboard, LineChart, Newspaper, Orbit, ShieldCheck, Sparkles } from "lucide-react";

export const primaryNav = [
  { href: "/", label: "Overview", icon: Sparkles },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/signals", label: "Signals", icon: CandlestickChart },
  { href: "/markets", label: "Markets", icon: Orbit },
  { href: "/charts", label: "Charts", icon: LineChart },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/academy", label: "Academy", icon: BookOpen },
  { href: "/pricing", label: "Pricing", icon: ShieldCheck },
] as const;
