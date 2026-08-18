import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const THEMES = [
  {
    title: "Canada's Vacation Playground",
    body: "Often called the Napa Valley of the North, the Okanagan is famous for stunning lakes, rolling vineyards, and orchards. Western Canadians flock here in summer for sun and wine-country living. The southern valley features a semi-arid desert climate — cacti, sagebrush, summer temperatures above 30°C, and among the lowest rainfall in Canada.",
  },
  {
    title: "Geography & Landscape",
    body: "A long ribbon of deep blue-green lakes runs through the valley, anchored by Okanagan Lake. The region stretches roughly 250 kilometres: greener pine forests and rolling hills in the north (around Vernon), transitioning to arroyo-style shrub-steppe desert in the south (around Osoyoos) on the US border.",
  },
  {
    title: "Economy & Culture",
    body: "Over 200 wineries produce world-class Pinot Noir, Chardonnay, and Icewine. Before wine, the valley was Canada's fruit bowl — cherries, peaches, apples, and apricots still fill roadside stands each summer. The valley is the traditional homeland of the Syilx (Okanagan) Nation, whose culture is deeply tied to the land and salmon-rich waters.",
  },
  {
    title: "Lifestyle & Tourism",
    body: "Summer brings boating, paddleboarding, and beach-hopping on the lakes. Winter empties the beaches but activates ski resorts like Big White and SilverStar. The region also attracts retirees seeking golf, slow-paced winery tours, and relentless sunshine.",
  },
] as const;

type OkanaganGuideProps = {
  heading?: string;
  intro?: string;
};

export function OkanaganGuide({
  heading = "The Okanagan Valley",
  intro = "Think of the Okanagan Valley as Canada's unexpected Mediterranean — a desert oasis in south-central British Columbia that shatters the stereotype of perpetual snow and freezing tundra.",
}: OkanaganGuideProps) {
  return (
    <section
      id="okanagan-guide"
      className="scroll-mt-28 py-16 sm:py-20 md:py-24"
    >
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-6 md:px-10">
        <Reveal>
          <SectionHeading title={heading} description={intro} />
        </Reveal>

        <div className="mt-10 space-y-6 sm:mt-12">
          {THEMES.map((theme, index) => (
            <Reveal key={theme.title} delay={index * 0.05}>
              <article className="border border-aubergine/10 bg-white/60 p-5 sm:p-6">
                <h3 className="font-serif text-xl text-aubergine sm:text-2xl">
                  {index + 1}. {theme.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/75 sm:text-base">
                  {theme.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
