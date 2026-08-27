import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HEADER_LOGO_SRC = "/brand/logo-symbol-header.png";

function brandTitleLines(name: string): [string, string?] {
  const words = name.trim().split(/\s+/);
  if (words.length <= 2) return [name.toUpperCase()];
  const last = words.pop()!;
  return [words.join(" ").toUpperCase(), last.toUpperCase()];
}

type SiteBrandMarkProps = {
  websiteName: string;
  companyDescription?: string;
  variant?: "header" | "footer";
  className?: string;
};

export function SiteBrandMark({
  websiteName,
  companyDescription,
  variant = "header",
  className,
}: SiteBrandMarkProps) {
  const [lineOne, lineTwo] = brandTitleLines(websiteName);

  if (variant === "footer") {
    return (
      <Link
        href="/"
        className={cn("inline-flex max-w-sm flex-col items-start gap-4", className)}
      >
        <div>
          <p className="font-serif text-lg leading-tight tracking-[0.06em] text-ivory uppercase sm:text-xl md:text-[1.35rem]">
            {lineOne}
            {lineTwo ? (
              <>
                <br />
                {lineTwo}
              </>
            ) : null}
          </p>
          <div className="mt-3 h-px w-14 bg-champagne/80" aria-hidden="true" />
        </div>
        {companyDescription ? (
          <p className="text-sm leading-relaxed text-ivory/65">
            {companyDescription}
          </p>
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn(
        "relative z-10 flex min-w-0 flex-1 items-center gap-2.5 text-ivory sm:gap-3 sm:flex-initial",
        className,
      )}
    >
      <Image
        src={HEADER_LOGO_SRC}
        alt=""
        width={48}
        height={48}
        className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
        priority
      />
      <span className="font-serif truncate text-[0.92rem] leading-tight tracking-[0.01em] sm:text-[1.05rem] md:text-[1.2rem]">
        {websiteName}
      </span>
    </Link>
  );
}
