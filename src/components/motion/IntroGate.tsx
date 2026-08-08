"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "bcwba-intro-seen";

type IntroGateContextValue = {
  /** True once we know whether to show intro / site (client hydrated). */
  ready: boolean;
  /** Intro overlay should be visible. */
  showIntro: boolean;
  /** Site chrome/content may be revealed. */
  revealSite: boolean;
  completeIntro: () => void;
};

const IntroGateContext = createContext<IntroGateContextValue | null>(null);

export function useIntroGate() {
  const ctx = useContext(IntroGateContext);
  if (!ctx) {
    throw new Error("useIntroGate must be used within IntroGateProvider");
  }
  return ctx;
}

function clearIntroLock() {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.documentElement.style.backgroundColor = "";
  document.body.style.backgroundColor = "";
}

export function IntroGateProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [revealSite, setRevealSite] = useState(false);

  useEffect(() => {
    // Admin (and any non-public shell) must never be blocked by the intro gate
    if (pathname?.startsWith("/admin")) {
      setShowIntro(false);
      setRevealSite(true);
      clearIntroLock();
      setReady(true);
      return;
    }

    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reduced = false;
    }

    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      seen = false;
    }

    if (seen || reduced) {
      setShowIntro(false);
      setRevealSite(true);
      clearIntroLock();
    } else {
      setShowIntro(true);
      setRevealSite(false);
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.documentElement.style.backgroundColor = "#211328";
      document.body.style.backgroundColor = "#211328";
    }
    setReady(true);
  }, [pathname]);

  const completeIntro = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    clearIntroLock();
    setShowIntro(false);
    // Small delay so exit animation can start before content pops in
    window.setTimeout(() => setRevealSite(true), 120);
  }, []);

  const value = useMemo(
    () => ({ ready, showIntro, revealSite, completeIntro }),
    [ready, showIntro, revealSite, completeIntro],
  );

  return (
    <IntroGateContext.Provider value={value}>{children}</IntroGateContext.Provider>
  );
}
