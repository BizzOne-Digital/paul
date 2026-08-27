import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { BROKERAGE_COMPLIANCE } from "@/lib/constants";
import { cn, formatPhoneDisplay } from "@/lib/utils";
import type { NavItem, ServiceNavItem } from "@/components/layout/Header";

export type FooterProps = {
  websiteName: string;
  companyDescription: string;
  email: string;
  phone: string;
  phoneTel?: string;
  serviceArea?: string;
  socialHandle?: string | null;
  socialPlatform?: string | null;
  socialUrl?: string | null;
  footerCtaLabel: string;
  footerCtaHref: string;
  legalDisclaimer: string;
  copyright: string;
  navItems: NavItem[];
  services?: ServiceNavItem[];
  className?: string;
};

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <p className="font-label text-[0.7rem] tracking-[0.22em] text-champagne uppercase">
        {children}
      </p>
      <div className="mt-3 h-px w-10 bg-champagne/80" aria-hidden="true" />
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 py-1.5 text-[0.95rem] text-ivory/80 transition hover:text-champagne"
    >
      <span>{children}</span>
      <ArrowRight
        className="h-3.5 w-3.5 shrink-0 text-champagne/80 transition group-hover:translate-x-0.5 group-hover:text-champagne"
        aria-hidden
      />
    </Link>
  );
}

export function Footer({
  websiteName,
  companyDescription,
  email,
  phone,
  phoneTel,
  serviceArea = "British Columbia",
  legalDisclaimer,
  copyright,
  navItems,
  services = [],
  className,
}: FooterProps) {
  const phoneHref = `tel:${(phoneTel || phone).replace(/[^\d+]/g, "")}`;
  const year = String(new Date().getFullYear());
  const copyrightText = copyright.includes("{year}")
    ? copyright.replace("{year}", year)
    : copyright || `© ${year} ${websiteName}`;

  const exploreItems = navItems.map((item) => ({
    ...item,
    label: item.label === "Insights" ? "Buyer Insights" : item.label,
  }));

  const serviceItems = services.slice(0, 4);

  return (
    <footer
      className={cn(
        "relative overflow-hidden bg-[#140d1a] text-ivory",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] vineyard-lines"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40 grape-pattern"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[90rem] px-4 sm:px-5 md:px-8 lg:px-10">
        <div className="grid gap-10 py-12 sm:py-14 md:grid-cols-2 md:py-16 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-champagne/30">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1 lg:pr-8">
            <Link href="/" className="inline-flex flex-col gap-3 sm:gap-4">
              <Image
                src="/brand/logo-symbol-light.svg"
                alt=""
                width={56}
                height={64}
                className="h-12 w-auto sm:h-14"
              />
              <span className="font-serif text-lg tracking-[0.04em] text-ivory uppercase sm:text-xl md:text-[1.35rem]">
                {websiteName}
              </span>
            </Link>
            <div className="mt-4 h-px w-14 bg-champagne/80" aria-hidden="true" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/65">
              {companyDescription ||
                "Buyer-focused information and professional consulting support for winery and vineyard acquisitions across British Columbia."}
            </p>
          </div>

          {/* Explore */}
          <div className="lg:px-8">
            <FooterHeading>Explore</FooterHeading>
            <ul className="mt-5 space-y-1 sm:mt-6">
              {exploreItems.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Buyer Services */}
          <div className="lg:px-8">
            <FooterHeading>Buyer Services</FooterHeading>
            <ul className="mt-5 space-y-1 sm:mt-6">
              {serviceItems.length > 0 ? (
                serviceItems.map((service) => (
                  <li key={service.slug}>
                    <FooterLink href={`/services/${service.slug}`}>
                      {service.name}
                    </FooterLink>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <FooterLink href="/services">
                      Acquisition Planning
                    </FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/services">Opportunity Review</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/services">
                      Due Diligence Coordination
                    </FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/services">Transaction Support</FooterLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="md:col-span-2 lg:col-span-1 lg:pl-8">
            <FooterHeading>Get in Touch</FooterHeading>
            <ul className="mt-5 space-y-4 sm:mt-6">
              <li>
                <a
                  href={phoneHref}
                  className="group flex min-w-0 items-center gap-3 text-sm text-ivory/80 transition hover:text-champagne md:text-[0.95rem]"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-champagne/70 text-champagne transition group-hover:border-champagne group-hover:bg-champagne/10">
                    <Phone className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 break-words">
                    {formatPhoneDisplay(phone)}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="group flex min-w-0 items-center gap-3 text-sm text-ivory/80 transition hover:text-champagne md:text-[0.95rem]"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-champagne/70 text-champagne transition group-hover:border-champagne group-hover:bg-champagne/10">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 break-all">{email}</span>
                </a>
              </li>
              <li className="flex min-w-0 items-center gap-3 text-sm text-ivory/80 md:text-[0.95rem]">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-champagne/70 text-champagne">
                  <MapPin className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0">{serviceArea || "British Columbia"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-champagne/35">
          <div className="flex flex-col items-center px-2 py-6 text-center sm:py-7">
            <Image
              src={BROKERAGE_COMPLIANCE.logoSrc}
              alt={BROKERAGE_COMPLIANCE.logoAlt}
              width={360}
              height={52}
              className="h-7 w-auto max-w-[min(100%,16rem)] object-contain sm:h-8 sm:max-w-[18rem]"
            />
            <p className="mt-2.5 max-w-xl text-[0.68rem] leading-relaxed text-ivory/70 sm:text-xs">
              {BROKERAGE_COMPLIANCE.licenseeLine}
            </p>
          </div>
        </div>

        <div className="border-t border-champagne/35">
          <div className="grid gap-3 py-5 text-[0.68rem] text-ivory/55 sm:gap-4 sm:text-[0.72rem] md:grid-cols-[1fr_auto_1.2fr] md:items-center md:gap-0 md:divide-x md:divide-champagne/30 md:py-6">
            <p className="font-label tracking-[0.08em] md:pr-6">
              {copyrightText}
            </p>
            <Link
              href="/faq"
              className="font-label inline-flex items-center gap-2 tracking-[0.12em] text-ivory/65 uppercase transition hover:text-champagne md:px-6"
            >
              Privacy Policy
              <ArrowRight className="h-3 w-3 text-champagne" aria-hidden />
            </Link>
            <p
              id="footer-disclaimer"
              className="leading-relaxed text-ivory/50 md:pl-6"
              title={legalDisclaimer}
            >
              Information provided for general informational purposes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
