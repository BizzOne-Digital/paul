"use client";

import { useCallback, useRef, type PointerEvent } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type MagneticOptions = {
  strength?: number;
  disabled?: boolean;
};

export function useMagnetic<T extends HTMLElement = HTMLElement>(
  options: MagneticOptions = {},
) {
  const { strength = 0.35, disabled = false } = options;
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();

  const onPointerMove = useCallback(
    (event: PointerEvent<T>) => {
      const el = ref.current;
      if (!el || disabled || reduced) return;

      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    },
    [disabled, reduced, strength],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0, 0, 0)";
  }, []);

  return {
    ref,
    handlers: {
      onPointerMove,
      onPointerLeave,
    },
  };
}
