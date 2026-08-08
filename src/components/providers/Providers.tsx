"use client";

import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { ToastProvider } from "@/components/ui/Toast";
import { IntroGateProvider } from "@/components/motion/IntroGate";

const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <MotionConfig reducedMotion="user">
      <IntroGateProvider>
        <ToastProvider>
          <SmoothScroll />
          {children}
        </ToastProvider>
      </IntroGateProvider>
    </MotionConfig>
  );
}
