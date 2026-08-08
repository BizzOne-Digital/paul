import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  published: "bg-champagne/20 text-aubergine border-champagne/40",
  draft: "bg-lavender-soft/60 text-plum border-lavender/40",
  featured: "bg-burgundy/15 text-burgundy border-burgundy/30",
  New: "bg-berry/15 text-berry border-berry/30",
  Contacted: "bg-lavender/25 text-plum border-lavender/40",
  "Consultation Scheduled": "bg-champagne/25 text-aubergine border-champagne/50",
  Qualified: "bg-aubergine/10 text-aubergine border-aubergine/20",
  "Follow-Up": "bg-plum/10 text-plum border-plum/25",
  Closed: "bg-charcoal/10 text-charcoal border-charcoal/20",
  "Not a Fit": "bg-cabernet/10 text-cabernet border-cabernet/25",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-label tracking-[0.14em] uppercase",
        toneMap[status] ?? "bg-ivory text-charcoal border-charcoal/15",
        className,
      )}
    >
      {status}
    </span>
  );
}
