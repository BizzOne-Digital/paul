"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SiteBrandMark } from "@/components/layout/SiteBrandMark";
import { STOCK } from "@/lib/images";
import { cn, formatPhoneDisplay } from "@/lib/utils";

export type NavItem = {
  label: string;
  href: string;
};

export type ServiceNavItem = {
  name: string;
  slug: string;
};

export type HeaderProps = {
  websiteName: string;
  phone: string;
  phoneTel?: string;
  email?: string;
  headerCtaLabel: string;
  headerCtaHref: string;
  navItems: NavItem[];
  services?: ServiceNavItem[];
};

export function Header(props: HeaderProps) {
  const pathname = usePathname();
  return <HeaderInner key={pathname} {...props} />;
}

function HeaderInner({
  websiteName,
  phone,
  phoneTel,
  email,
  headerCtaLabel,
  headerCtaHref,
  navItems,
  services = [],
}: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const solid = scrolled || mobileOpen || !isHome;
  const menuId = useId();
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const panel = mobilePanelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  const phoneHref = `tel:${(phoneTel || phone).replace(/[^\d+]/g, "")}`;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300",
        solid
          ? "border-b border-champagne/35 bg-aubergine/90 backdrop-blur-xl"
          : "border-b border-champagne/40 bg-gradient-to-b from-aubergine/75 via-aubergine/35 to-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.25rem] w-full max-w-[90rem] items-center justify-between gap-3 px-4 sm:h-[4.85rem] sm:gap-4 sm:px-5 md:px-8 lg:px-10">
        <SiteBrandMark websiteName={websiteName} variant="header" />

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 xl:flex"
          aria-label="Primary"
        >
          {navItems.map((item) => {
            if (item.href === "/services") {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link
                    href="/services"
                    className={cn(
                      "font-label relative inline-flex items-center gap-1 px-3.5 py-2 text-[0.68rem] tracking-[0.2em] text-ivory/85 uppercase transition hover:text-champagne",
                      isActive("/services") && "text-champagne",
                    )}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                    {isActive("/services") ? (
                      <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-champagne" />
                    ) : null}
                  </Link>

                  <AnimatePresence>
                    {servicesOpen && services.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.22 }}
                        className="absolute top-full left-1/2 mt-2 w-72 -translate-x-1/2 border border-champagne/25 bg-aubergine/95 p-3 shadow-2xl backdrop-blur-xl"
                      >
                        <ul className="space-y-1">
                          {services.map((service) => (
                            <li key={service.slug}>
                              <Link
                                href={`/services/${service.slug}`}
                                className="block px-3 py-2.5 text-sm text-ivory/85 transition hover:bg-white/5 hover:text-champagne"
                              >
                                {service.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-label relative px-3.5 py-2 text-[0.68rem] tracking-[0.2em] text-ivory/85 uppercase transition hover:text-champagne",
                  isActive(item.href) && "text-champagne",
                )}
              >
                {item.label}
                {isActive(item.href) ? (
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-champagne" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 flex items-center gap-3">
          <a
            href={phoneHref}
            className="font-label hidden items-center gap-2 text-[0.65rem] tracking-[0.16em] text-ivory/75 uppercase transition hover:text-champagne 2xl:inline-flex"
          >
            <Phone className="h-3.5 w-3.5 text-champagne" />
            {formatPhoneDisplay(phone)}
          </a>

          <Button
            href={headerCtaHref}
            variant="outline-light"
            size="sm"
            className="hidden rounded-none md:inline-flex"
          >
            {headerCtaLabel}
          </Button>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-ivory/30 text-ivory transition hover:border-champagne hover:text-champagne xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id={menuId}
            ref={mobilePanelRef}
            className="fixed inset-0 z-40 flex flex-col bg-aubergine xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0">
              <Image
                src={STOCK.heroVineyard}
                alt=""
                fill
                className="object-cover opacity-35"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-aubergine via-aubergine/90 to-aubergine" />
            </div>

            <div className="relative z-10 flex items-center justify-between gap-3 px-5 pt-5">
              <SiteBrandMark
                websiteName={websiteName}
                variant="header"
                className="min-w-0 flex-initial"
              />
              <button
                ref={closeBtnRef}
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center border border-ivory/25 text-ivory"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav
              className="relative z-10 flex flex-1 flex-col justify-center gap-2 px-6"
              aria-label="Mobile"
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "font-serif block py-1.5 text-[2rem] text-ivory transition hover:text-champagne sm:py-2 sm:text-4xl",
                      isActive(item.href) && "text-champagne",
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {services.length > 0 ? (
                <div className="mt-4 space-y-2 border-t border-ivory/15 pt-5">
                  <p className="font-label text-[0.65rem] tracking-[0.2em] text-champagne uppercase">
                    Services
                  </p>
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="block py-1.5 text-lg text-ivory/80 transition hover:text-champagne"
                      onClick={() => setMobileOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </nav>

            <div className="relative z-10 space-y-4 px-6 pb-10">
              <Button
                href={headerCtaHref}
                variant="outline-light"
                className="w-full rounded-none"
              >
                {headerCtaLabel}
              </Button>
              <div className="flex flex-col gap-2 text-sm text-ivory/75">
                <a href={phoneHref} className="hover:text-champagne">
                  {formatPhoneDisplay(phone)}
                </a>
                {email ? (
                  <a href={`mailto:${email}`} className="hover:text-champagne">
                    {email}
                  </a>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
