"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  MessageSquareText,
  Newspaper,
  Settings,
  BriefcaseBusiness,
  HelpCircle,
} from "lucide-react";
import { BUYER_INSIGHTS_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/services", label: "Services", icon: BriefcaseBusiness },
  { href: "/admin/blog", label: BUYER_INSIGHTS_LABEL, icon: Newspaper },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/leads", label: "Leads", icon: MessageSquareText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ websiteName }: { websiteName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-aubergine text-ivory">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="font-label text-[10px] tracking-[0.22em] text-lavender">
          Admin CMS
        </p>
        <p className="mt-2 font-serif text-xl leading-tight">{websiteName}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-white/10 text-lavender"
                  : "text-ivory/75 hover:bg-white/5 hover:text-ivory",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-5 py-4 text-xs text-ivory/50">
        Protected workspace
      </div>
    </aside>
  );
}
