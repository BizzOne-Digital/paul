"use client";

import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/ToastProvider";

export function AdminHeader({
  title,
  email,
}: {
  title: string;
  email?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  async function logout() {
    const res = await fetch("/api/admin/logout", { method: "POST" });
    if (!res.ok) {
      toast({ title: "Logout failed", tone: "error" });
      return;
    }
    toast({ title: "Signed out", tone: "success" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal/10 bg-ivory/90 px-6 py-4 backdrop-blur">
      <div>
        <h1 className="font-serif text-2xl text-aubergine">{title}</h1>
        {email ? (
          <p className="mt-0.5 text-xs text-charcoal/60">{email}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-3 py-2 text-xs font-label uppercase tracking-[0.14em] text-aubergine transition hover:border-lavender"
        >
          Preview site
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full bg-aubergine px-3 py-2 text-xs font-label uppercase tracking-[0.14em] text-ivory transition hover:bg-plum"
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </button>
      </div>
    </header>
  );
}
