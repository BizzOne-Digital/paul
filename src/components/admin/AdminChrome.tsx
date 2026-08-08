"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminChrome({
  websiteName,
  children,
}: {
  websiteName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login" || pathname.startsWith("/admin/login/");

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-ivory">
      <AdminSidebar websiteName={websiteName} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
