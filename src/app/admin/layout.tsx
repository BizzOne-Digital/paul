import { ToastProvider } from "@/components/admin/ToastProvider";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { getSettings } from "@/lib/settings";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <ToastProvider>
      <AdminChrome websiteName={settings.websiteName}>{children}</AdminChrome>
    </ToastProvider>
  );
}
