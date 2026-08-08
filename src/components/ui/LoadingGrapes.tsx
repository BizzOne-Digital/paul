"use client";

import { cn } from "@/lib/utils";

type LoadingGrapesProps = {
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
};

const GRAPES = [
  { cx: 42, cy: 38, fill: "#32173D" },
  { cx: 78, cy: 38, fill: "#741F45" },
  { cx: 28, cy: 68, fill: "#211328" },
  { cx: 92, cy: 68, fill: "#B42A61" },
  { cx: 42, cy: 90, fill: "#32173D" },
  { cx: 78, cy: 90, fill: "#741F45" },
  { cx: 60, cy: 112, fill: "#4A102D" },
] as const;

const sizeMap = {
  sm: "h-10 w-9",
  md: "h-16 w-14",
  lg: "h-24 w-20",
};

export function LoadingGrapes({
  className,
  label = "Loading",
  size = "md",
}: LoadingGrapesProps) {
  return (
    <div
      className={cn("inline-flex flex-col items-center gap-3", className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <svg
        viewBox="0 0 120 140"
        className={cn(sizeMap[size])}
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M48 28 C40 18 34 12 28 10 C38 8 52 14 58 24"
          stroke="#B5965A"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {GRAPES.map((grape, index) => (
          <circle
            key={`${grape.cx}-${grape.cy}`}
            className="grape-pulse"
            cx={grape.cx}
            cy={grape.cy}
            r="14"
            fill={grape.fill}
            style={{ animationDelay: `${index * 0.12}s` }}
          />
        ))}
        <path
          d="M48 78 L60 66 L72 78 V90 H48 Z"
          fill="#B9A7D8"
          opacity="0.85"
        />
      </svg>
      <span className="font-label text-[0.65rem] tracking-[0.22em] text-aubergine/60">
        {label}
      </span>
    </div>
  );
}
