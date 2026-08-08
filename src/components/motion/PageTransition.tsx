"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [curtainKey, setCurtainKey] = useState(pathname);
  const [showCurtain, setShowCurtain] = useState(false);
  const isFirstPath = useRef(true);

  useEffect(() => {
    if (reduced) return;
    if (isFirstPath.current) {
      isFirstPath.current = false;
      return;
    }
    setCurtainKey(pathname);
    setShowCurtain(true);
    const timer = window.setTimeout(() => setShowCurtain(false), 1000);
    return () => window.clearTimeout(timer);
  }, [pathname, reduced]);

  return (
    <div className="relative">
      {children}
      <AnimatePresence>
        {showCurtain && !reduced ? (
          <motion.div
            key={`curtain-${curtainKey}`}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[70] bg-lavender"
            initial={{ scaleX: 0, transformOrigin: "0% 50%" }}
            animate={{
              scaleX: [0, 1, 1, 0],
              transformOrigin: ["0% 50%", "0% 50%", "100% 50%", "100% 50%"],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.95,
              times: [0, 0.4, 0.55, 1],
              ease: [0.65, 0, 0.35, 1],
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
