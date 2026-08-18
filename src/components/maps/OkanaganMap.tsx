import { cn } from "@/lib/utils";

type OkanaganMapProps = {
  className?: string;
  /** Compact layout for FAQ sidebar */
  variant?: "default" | "compact";
};

/**
 * Stylised locator map: western Canada with the Okanagan Valley highlighted
 * for international buyers unfamiliar with BC geography.
 */
export function OkanaganMap({
  className,
  variant = "default",
}: OkanaganMapProps) {
  const compact = variant === "compact";

  return (
    <figure
      className={cn(
        "relative overflow-hidden border border-aubergine/15 bg-[#f3efe6]",
        className,
      )}
      aria-labelledby="okanagan-map-title"
    >
      <svg
        viewBox="0 0 520 360"
        className="h-auto w-full"
        role="img"
        aria-labelledby="okanagan-map-title okanagan-map-desc"
      >
        <title id="okanagan-map-title">
          Okanagan Valley location in British Columbia, western Canada
        </title>
        <desc id="okanagan-map-desc">
          A simplified map showing Canada with British Columbia on the west
          coast. The Okanagan Valley runs north to south in the southern
          interior of BC, between Kelowna and Osoyoos near the United States
          border.
        </desc>

        {/* Pacific / background */}
        <rect width="520" height="360" fill="#e8e2d6" />
        <path
          d="M0 0 L95 0 L88 360 L0 360 Z"
          fill="#c5d4e8"
          opacity="0.55"
        />
        <text
          x="28"
          y="190"
          className="fill-aubergine/40"
          fontSize="9"
          fontFamily="var(--font-manrope), system-ui, sans-serif"
          letterSpacing="0.18em"
          transform="rotate(-90 28 190)"
        >
          PACIFIC OCEAN
        </text>

        {/* Canada outline (simplified western portion) */}
        <path
          d="M95 28 L480 22 L495 95 L470 175 L455 250 L420 310 L350 340 L240 348 L140 338 L95 300 Z"
          fill="#ddd3ea"
          stroke="#211328"
          strokeWidth="1.2"
          opacity="0.85"
        />
        <text
          x="300"
          y="52"
          textAnchor="middle"
          fill="#211328"
          fontSize={compact ? "10" : "11"}
          fontFamily="var(--font-manrope), system-ui, sans-serif"
          letterSpacing="0.14em"
          fontWeight="600"
        >
          CANADA
        </text>

        {/* British Columbia */}
        <path
          d="M95 55 L175 48 L210 72 L235 110 L250 155 L248 205 L235 255 L210 300 L175 325 L120 318 L95 280 Z"
          fill="#b9a7d8"
          stroke="#211328"
          strokeWidth="1"
          opacity="0.9"
        />
        <text
          x="158"
          y="115"
          fill="#211328"
          fontSize={compact ? "9" : "10"}
          fontFamily="var(--font-manrope), system-ui, sans-serif"
          letterSpacing="0.1em"
          fontWeight="600"
        >
          BRITISH
        </text>
        <text
          x="158"
          y="128"
          fill="#211328"
          fontSize={compact ? "9" : "10"}
          fontFamily="var(--font-manrope), system-ui, sans-serif"
          letterSpacing="0.1em"
          fontWeight="600"
        >
          COLUMBIA
        </text>

        {/* Okanagan Valley ribbon */}
        <path
          d="M198 118 C205 145 208 175 210 205 C212 235 215 265 218 290"
          fill="none"
          stroke="#741f45"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M198 118 C205 145 208 175 210 205 C212 235 215 265 218 290"
          fill="none"
          stroke="#b5965a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="4 5"
        />

        {/* US border hint */}
        <line
          x1="95"
          y1="305"
          x2="420"
          y2="305"
          stroke="#211328"
          strokeWidth="0.8"
          strokeDasharray="6 4"
          opacity="0.35"
        />
        <text
          x="310"
          y="322"
          fill="#211328"
          fontSize="8"
          fontFamily="var(--font-manrope), system-ui, sans-serif"
          letterSpacing="0.12em"
          opacity="0.55"
        >
          UNITED STATES
        </text>

        {/* City markers along the valley */}
        {[
          { label: "Vernon", y: 128 },
          { label: "Kelowna", y: 168 },
          { label: "Penticton", y: 218 },
          { label: "Naramata", y: 238 },
          { label: "Oliver", y: 262 },
          { label: "Osoyoos", y: 288 },
        ].map((city) => (
          <g key={city.label}>
            <circle cx="228" cy={city.y} r="3.5" fill="#b5965a" />
            <text
              x="242"
              y={city.y + 3}
              fill="#211328"
              fontSize={compact ? "7.5" : "8.5"}
              fontFamily="var(--font-manrope), system-ui, sans-serif"
            >
              {city.label}
            </text>
          </g>
        ))}

        {/* Keremeos — Similkameen branch */}
        <circle cx="248" cy="278" r="3" fill="#b5965a" opacity="0.8" />
        <text
          x="258"
          y="281"
          fill="#211328"
          fontSize="7.5"
          fontFamily="var(--font-manrope), system-ui, sans-serif"
          opacity="0.85"
        >
          Keremeos
        </text>

        {/* Vancouver reference */}
        <circle cx="118" cy="248" r="3" fill="#211328" opacity="0.4" />
        <text
          x="128"
          y="251"
          fill="#211328"
          fontSize="7.5"
          fontFamily="var(--font-manrope), system-ui, sans-serif"
          opacity="0.55"
        >
          Vancouver
        </text>

        {/* Okanagan label callout */}
        <rect
          x="318"
          y="148"
          width="168"
          height="52"
          fill="#211328"
          opacity="0.92"
        />
        <text
          x="402"
          y="168"
          textAnchor="middle"
          fill="#f7f3ec"
          fontSize="9"
          fontFamily="var(--font-manrope), system-ui, sans-serif"
          letterSpacing="0.16em"
        >
          OKANAGAN VALLEY
        </text>
        <text
          x="402"
          y="184"
          textAnchor="middle"
          fill="#b9a7d8"
          fontSize="7.5"
          fontFamily="var(--font-manrope), system-ui, sans-serif"
          letterSpacing="0.08em"
        >
          ~250 km · South-Central BC
        </text>
        <line
          x1="280"
          y1="175"
          x2="318"
          y2="175"
          stroke="#b5965a"
          strokeWidth="1"
        />
      </svg>

      <figcaption className="font-label border-t border-aubergine/10 bg-white/60 px-4 py-3 text-[0.58rem] tracking-[0.14em] text-aubergine/65 uppercase">
        Illustrative locator map — not to scale
      </figcaption>
    </figure>
  );
}
