import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const isLight = tone === "light";

  return (
    <div
      className={cn(
        "max-w-3xl",
        isCenter && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "font-label mb-3 text-[0.62rem] tracking-[0.18em] sm:mb-4 sm:text-[0.7rem] sm:tracking-[0.22em]",
            isLight ? "text-lavender" : "text-burgundy",
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <Tag
        className={cn(
          "font-serif text-[1.85rem] leading-[1.12] tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-[3.35rem]",
          isLight ? "text-ivory" : "text-aubergine",
        )}
      >
        {title}
      </Tag>

      <div
        className={cn(
          "gold-rule mt-6 w-24",
          isCenter ? "mx-auto" : "origin-left",
        )}
        aria-hidden="true"
      />

      {description ? (
        <p
          className={cn(
            "mt-6 max-w-2xl text-base leading-relaxed md:text-lg",
            isLight ? "text-ivory/80" : "text-charcoal/75",
            isCenter && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
