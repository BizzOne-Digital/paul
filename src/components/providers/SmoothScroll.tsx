"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

let lenisSingleton: Lenis | null = null;

export function getLenis() {
  return lenisSingleton;
}

export function refreshSmoothScroll() {
  lenisSingleton?.resize();
  ScrollTrigger.refresh();
}

export default function SmoothScroll() {
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduced) {
      document.documentElement.classList.add("reduced-motion");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      lenisSingleton?.destroy();
      lenisSingleton = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
      return;
    }

    document.documentElement.classList.remove("reduced-motion");

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.1,
      autoRaf: false,
    });
    lenisSingleton = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    const refreshTimer = window.setTimeout(onResize, 200);
    const refreshTimer2 = window.setTimeout(onResize, 800);

    return () => {
      window.clearTimeout(refreshTimer);
      window.clearTimeout(refreshTimer2);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      if (lenisSingleton === lenis) lenisSingleton = null;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [reduced]);

  // Recalculate scrollable height on every route change
  useEffect(() => {
    if (reduced) return;

    // Kill leftover pins from previous page (e.g. homepage horizontal services)
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.pin || trigger.vars?.pin) {
        trigger.kill(true);
      }
    });

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.documentElement.style.height = "";
    document.body.style.height = "";

    const run = () => {
      lenisSingleton?.resize();
      ScrollTrigger.refresh();
    };

    run();
    const t1 = window.setTimeout(run, 50);
    const t2 = window.setTimeout(run, 300);
    const t3 = window.setTimeout(run, 900);

    // Images loading can grow the page after first paint
    const onLoad = () => run();
    window.addEventListener("load", onLoad);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            lenisSingleton?.resize();
          })
        : null;
    ro?.observe(document.body);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener("load", onLoad);
      ro?.disconnect();
    };
  }, [pathname, reduced]);

  return null;
}
