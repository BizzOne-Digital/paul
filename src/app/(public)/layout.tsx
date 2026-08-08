import { SiteShell } from "@/components/layout/SiteShell";
import { getNavServices } from "@/lib/data";
import { getSettings } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, services] = await Promise.all([
    getSettings(),
    getNavServices().catch(() => []),
  ]);

  return (
    <SiteShell settings={settings} services={services}>
      {children}
    </SiteShell>
  );
}
