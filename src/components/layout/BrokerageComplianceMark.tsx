import Image from "next/image";
import { BROKERAGE_COMPLIANCE } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BrokerageComplianceMarkProps = {
  variant?: "header" | "footer";
  className?: string;
};

export function BrokerageComplianceMark({
  variant = "footer",
  className,
}: BrokerageComplianceMarkProps) {
  const isHeader = variant === "header";

  return (
    <div
      className={cn(
        "flex flex-col",
        isHeader ? "min-w-0 items-start gap-1 py-0.5" : "items-center gap-2.5 px-2 text-center",
        className,
      )}
    >
      <Image
        src={BROKERAGE_COMPLIANCE.logoSrc}
        alt={BROKERAGE_COMPLIANCE.logoAlt}
        width={isHeader ? 280 : 360}
        height={isHeader ? 40 : 52}
        className={
          isHeader
            ? "h-6 w-auto max-w-[10.5rem] object-contain sm:h-7 sm:max-w-[12.5rem] md:h-8 md:max-w-[14rem]"
            : "h-7 w-auto max-w-[min(100%,16rem)] object-contain sm:h-8 sm:max-w-[18rem]"
        }
        priority={isHeader}
      />
      <p
        className={
          isHeader
            ? "max-w-[14rem] text-[0.58rem] leading-snug text-ivory/75 sm:text-[0.62rem] md:max-w-[16rem]"
            : "max-w-xl text-[0.68rem] leading-relaxed text-ivory/70 sm:text-xs"
        }
      >
        {BROKERAGE_COMPLIANCE.licenseeLine}
      </p>
    </div>
  );
}
