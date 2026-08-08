"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "magnetic"
  | "outline-light";
type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  magnetic?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-xs tracking-[0.16em]",
  md: "px-7 py-3.5 text-xs tracking-[0.18em]",
  lg: "px-9 py-4 text-sm tracking-[0.18em]",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-aubergine text-ivory border border-aubergine hover:bg-plum hover:border-plum",
  secondary:
    "bg-transparent text-aubergine border border-champagne/70 hover:border-lavender hover:text-plum",
  ghost:
    "bg-transparent text-ivory border border-ivory/30 hover:border-lavender hover:text-lavender",
  magnetic:
    "bg-lavender text-aubergine border border-lavender hover:bg-lavender-soft shadow-[0_12px_40px_-18px_rgba(185,167,216,0.85)]",
  "outline-light":
    "bg-transparent text-ivory border border-ivory/80 hover:border-champagne hover:bg-white/5 hover:text-champagne",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    magnetic,
    ...rest
  } = props;

  const isMagnetic = magnetic || variant === "magnetic";
  const { ref, handlers } = useMagnetic<HTMLElement>({
    strength: 0.28,
    disabled: !isMagnetic,
  });

  const classes = cn(
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full font-label uppercase transition-[color,background-color,border-color,box-shadow] duration-300 will-change-transform",
    sizeClasses[size],
    variantClasses[variant],
    isMagnetic && "transition-transform duration-300 ease-out",
    className,
  );

  if ("href" in props && props.href) {
    const { href, target, rel, onClick } = props;
    return (
      <Link
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={classes}
        {...handlers}
      >
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={classes}
      {...buttonProps}
      {...handlers}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
