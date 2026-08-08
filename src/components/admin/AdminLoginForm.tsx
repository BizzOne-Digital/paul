"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/admin/ToastProvider";
import {
  fieldClass,
  labelClass,
  btnPrimaryClass,
} from "@/components/admin/admin-styles";

export function AdminLoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      toast({ title: "Welcome back", tone: "success" });
      const next = search.get("next") || "/admin";
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (error) {
      toast({
        title: "Sign-in failed",
        description: error instanceof Error ? error.message : undefined,
        tone: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-aubergine via-plum to-cabernet" />
      <div className="vineyard-lines absolute inset-0 opacity-40" />
      <div className="relative w-full max-w-md rounded-3xl border border-lavender/25 bg-ivory/95 p-8 shadow-2xl backdrop-blur">
        <p className="font-label text-[10px] tracking-[0.22em] text-plum/70">
          BC Winery Buyer Advisory
        </p>
        <h1 className="mt-3 font-serif text-3xl text-aubergine">Admin sign in</h1>
        <p className="mt-2 text-sm text-charcoal/65">
          Secure access to content, inquiries, and site settings.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
            />
          </div>
          <button type="submit" disabled={loading} className={`${btnPrimaryClass} w-full`}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
