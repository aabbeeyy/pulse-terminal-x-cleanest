"use client";

import { LockKeyhole, Mail, User2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type SessionUser = {
  userId: string;
  name: string;
  email: string;
  plan: string;
  subscriptionStatus?: string;
  stripeCustomerId?: string | null;
};

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<SessionUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => setSession(json.user || null))
      .catch(() => setSession(null));
  }, []);

  async function handleSubmit() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "login" ? { email, password } : { name, email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Authentication failed.");
      setSession(json.user);
      setIsError(false);
      setMessage(mode === "login" ? "Login successful." : "Account created successfully.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    setMessage("Logged out.");
    setIsError(false);
  }

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
          <div className="inline-flex rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-teal-300">Secure account access</div>
          <h1 className="mt-5 text-4xl font-semibold text-white">Real login with database-backed users and server sessions.</h1>
          <p className="mt-4 max-w-xl text-slate-300">This version stores users in MongoDB, hashes passwords, and keeps the session in a secure cookie instead of browser storage.</p>
          <div className="mt-8 space-y-4">
            {[
              "Password hashing with bcrypt",
              "MongoDB-backed user records",
              "Plan and Stripe status tied to the account",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-slate-200">{item}</div>
            ))}
          </div>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300">
            Current status: <span className="font-semibold text-white">{session ? `Signed in as ${session.name} • ${session.plan}` : "No active session"}</span>
          </div>
          <div className="mt-6 flex gap-3">
            <Link href="/" className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5">Back home</Link>
            <Link href="/subscribe" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">Subscription</Link>
            {session ? (
              <button onClick={() => void handleLogout()} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5">Log out</button>
            ) : null}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <div className="flex rounded-full border border-white/10 bg-black/20 p-1">
            <button onClick={() => setMode("login")} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${mode === "login" ? "bg-white text-slate-950" : "text-slate-300"}`}>Login</button>
            <button onClick={() => setMode("signup")} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${mode === "signup" ? "bg-white text-slate-950" : "text-slate-300"}`}>Sign up</button>
          </div>

          <div className="mt-6 space-y-4">
            {mode === "signup" ? (
              <label className="block">
                <div className="mb-2 text-sm text-slate-300">Name</div>
                <div className="flex items-center rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <User2 className="mr-3 h-4 w-4 text-slate-400" />
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent text-white outline-none" placeholder="Your name" />
                </div>
              </label>
            ) : null}
            <label className="block">
              <div className="mb-2 text-sm text-slate-300">Email</div>
              <div className="flex items-center rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <Mail className="mr-3 h-4 w-4 text-slate-400" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent text-white outline-none" placeholder="name@example.com" />
              </div>
            </label>
            <label className="block">
              <div className="mb-2 text-sm text-slate-300">Password</div>
              <div className="flex items-center rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <LockKeyhole className="mr-3 h-4 w-4 text-slate-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent text-white outline-none" placeholder="Enter password" />
              </div>
            </label>
          </div>

          <button onClick={() => void handleSubmit()} disabled={loading} className="mt-6 w-full rounded-2xl bg-teal-400 px-4 py-3 font-semibold text-slate-950 hover:bg-teal-300 disabled:opacity-70">
            {loading ? "Working..." : mode === "login" ? "Login" : "Create account"}
          </button>

          {message ? (
            <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${isError ? "border-rose-400/30 bg-rose-400/10 text-rose-200" : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"}`}>
              {message}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
