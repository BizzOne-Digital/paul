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
  ready: boolean;
  showIntro: boolean;
  revealSite: boolean;
  completeIntro: () => void;
};

const IntroGateContext = createContext<IntroGateContextValue | null>(null);

const ADMIN_BYPASS: IntroGateContextValue = {
  ready: true,
  showIntro: false,
  revealSite: true,
  completeIntro: () => {},
};

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

function PublicIntroGateProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [revealSite, setRevealSite] = useState(false);

  useEffect(() => {
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

  /* Client-only intro gate — reads sessionStorage on first paint */
  /* eslint-disable react-hooks/set-state-in-effect -- intentional hydration */
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
  /* eslint-enable react-hooks/set-state-in-effect */

    return () => clearIntroLock();
  }, []);

  const completeIntro = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    clearIntroLock();
    setShowIntro(false);
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

export function IntroGateProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return (
      <IntroGateContext.Provider value={ADMIN_BYPASS}>
        {children}
      </IntroGateContext.Provider>
    );
  }

  return <PublicIntroGateProvider>{children}</PublicIntroGateProvider>;
}
