"use client";

import { primaryNav } from "@/components/site-config";
import { Crown, Menu, Radar, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen px-4 py-5 lg:px-6">
      <div className="mx-auto max-w-[1560px]">
        <header className="mb-6 rounded-[32px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400/15 text-teal-300">
                <Radar className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.32em] text-slate-400">Multi-page terminal</div>
                <div className="text-2xl font-semibold text-white">Pulse Terminal X</div>
              </div>
            </Link>
            <button
              onClick={() => setOpen((value) => !value)}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 p-3 text-slate-200 lg:hidden"
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="hidden items-center gap-3 lg:flex">
              <Link href="/login" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5">Login</Link>
              <Link href="/subscribe" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"><Crown className="h-4 w-4" />Go Premium</Link>
            </div>
          </div>
          <nav className={`${open ? "mt-4 grid" : "hidden"} gap-2 lg:mt-4 lg:grid lg:grid-cols-9`}>
            {primaryNav.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm transition ${active ? "border-teal-400/30 bg-teal-400/15 text-white" : "border-white/10 text-slate-300 hover:bg-white/5"}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
