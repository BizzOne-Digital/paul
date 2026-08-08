"use client";

import { Footer } from "@/components/layout/Footer";
import { Header, type ServiceNavItem } from "@/components/layout/Header";
import { IntroHost } from "@/components/motion/IntroHost";
import { useIntroGate } from "@/components/motion/IntroGate";
import { PageTransition } from "@/components/motion/PageTransition";
import { NAV_ITEMS } from "@/lib/constants";
import type { SiteSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

type SiteShellProps = {
  children: React.ReactNode;
  settings: SiteSettings;
  services?: ServiceNavItem[];
};

function SiteChrome({
  children,
  settings,
  services = [],
}: SiteShellProps) {
  const { ready, revealSite } = useIntroGate();
  const siteVisible = ready && revealSite;
  const navItems = NAV_ITEMS.map((item) => ({
    label: item.label,
    href: item.href,
  }));

  return (
    <div
      className={cn(
        "site-shell w-full min-w-0 transition-opacity duration-500",
        siteVisible
          ? "opacity-100"
          : "pointer-events-none invisible opacity-0",
      )}
      aria-hidden={!siteVisible}
    >
      <Header
        websiteName={settings.websiteName}
        phone={settings.phone}
        phoneTel={settings.phoneTel}
        email={settings.email}
        headerCtaLabel={settings.headerCtaLabel}
        headerCtaHref={settings.headerCtaHref}
        navItems={navItems}
        services={services}
      />
      <PageTransition>
        <main id="main-content" className="min-h-screen min-w-0 overflow-x-clip">
          {children}
        </main>
      </PageTransition>
      <Footer
        websiteName={settings.websiteName}
        companyDescription={settings.companyDescription}
        email={settings.email}
        phone={settings.phone}
        phoneTel={settings.phoneTel}
        serviceArea={settings.serviceArea}
        socialHandle={settings.socialHandle}
        socialPlatform={settings.socialPlatform}
        socialUrl={settings.socialUrl}
        footerCtaLabel={settings.footerCtaLabel}
        footerCtaHref={settings.footerCtaHref}
        legalDisclaimer={settings.legalDisclaimer}
        copyright={settings.copyright}
        navItems={navItems}
        services={services}
      />
    </div>
  );
}

export function SiteShell({
  children,
  settings,
  services = [],
}: SiteShellProps) {
  return (
    <>
      <IntroHost
        websiteName={settings.websiteName}
        tagline={settings.tagline}
      />
      <SiteChrome settings={settings} services={services}>
        {children}
      </SiteChrome>
    </>
  );
}
