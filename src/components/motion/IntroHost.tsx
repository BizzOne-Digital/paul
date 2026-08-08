"use client";

import dynamic from "next/dynamic";

const IntroAnimation = dynamic(
  () =>
    import("@/components/motion/IntroAnimation").then((mod) => mod.IntroAnimation),
  {
    ssr: false,
    loading: () => (
      <div
        className="fixed inset-0 z-[100] bg-aubergine"
        aria-hidden="true"
      />
    ),
  },
);

type IntroHostProps = {
  websiteName: string;
  tagline?: string;
};

export function IntroHost({ websiteName, tagline }: IntroHostProps) {
  return <IntroAnimation websiteName={websiteName} tagline={tagline} />;
}
