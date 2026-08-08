"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PlainService } from "@/lib/data";
import { imageAlt, imageSrc, STOCK } from "@/lib/images";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type ServicesHorizontalProps = {
  services: PlainService[];
};

export function ServicesHorizontal({ services }: ServicesHorizontalProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !sectionRef.current || !trackRef.current) return;
    if (services.length < 2) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const section = sectionRef.current!;
        const track = trackRef.current!;

        const getScrollDistance = () =>
          Math.max(track.scrollWidth - window.innerWidth + 48, 1);

        const tween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        });

        const images = Array.from(track.querySelectorAll("img"));
        let pending = images.length;
        const refresh = () => ScrollTrigger.refresh();

        if (pending === 0) {
          requestAnimationFrame(refresh);
        } else {
          images.forEach((img) => {
            if (img.complete) {
              pending -= 1;
              if (pending <= 0) refresh();
            } else {
              img.addEventListener(
                "load",
                () => {
                  pending -= 1;
                  if (pending <= 0) refresh();
                },
                { once: true },
              );
            }
          });
        }

        requestAnimationFrame(refresh);

        return () => {
          tween.scrollTrigger?.kill(true);
          tween.kill();
        };
      });

      return () => mm.revert();
    }, sectionRef);

    return () => {
      ctx.revert();
      // Ensure pin spacers / body locks never survive route changes
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === sectionRef.current) st.kill(true);
      });
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [reduced, services]);

  if (services.length === 0) return null;

  if (reduced) {
    return (
      <div className="flex w-full min-w-0 flex-col gap-5 px-5 sm:gap-6 sm:px-6 md:px-10">
        {services.map((service, index) => (
          <ServiceCard key={service._id} service={service} index={index} />
        ))}
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative w-full min-w-0">
      <div className="hidden lg:block">
        <div className="flex h-screen items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-max gap-8 px-10 will-change-transform"
          >
            {services.map((service, index) => (
              <ServiceCard
                key={service._id}
                service={service}
                index={index}
                horizontal
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-5 px-5 sm:gap-6 sm:px-6 md:px-10 lg:hidden">
        {services.map((service, index) => (
          <ServiceCard key={service._id} service={service} index={index} />
        ))}
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  index,
  horizontal = false,
}: {
  service: PlainService;
  index: number;
  horizontal?: boolean;
}) {
  return (
    <article
      className={
        horizontal
          ? "group relative flex h-[min(70vh,640px)] w-[min(82vw,900px)] shrink-0 flex-row overflow-hidden border border-aubergine/10 bg-white/55 shadow-[0_20px_60px_-40px_rgba(33,19,40,0.45)]"
          : "group relative flex w-full flex-col overflow-hidden border border-aubergine/10 bg-white/55"
      }
    >
      <div
        className={
          horizontal
            ? "relative h-full w-[46%] shrink-0 overflow-hidden"
            : "relative aspect-[16/10] overflow-hidden"
        }
      >
        <Image
          src={imageSrc(service.listingImage, STOCK.vineyardRows)}
          alt={
            service.listingImageAlt ||
            imageAlt(service.listingImage, service.name)
          }
          fill
          className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]"
          sizes={horizontal ? "40vw" : "100vw"}
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-7 md:p-10">
        <div>
          <p className="font-label text-[0.65rem] tracking-[0.22em] text-champagne">
            Service {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="font-serif mt-3 text-2xl leading-tight text-aubergine sm:mt-4 sm:text-3xl md:text-4xl">
            {service.name}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal/75 sm:mt-4 sm:text-base">
            {service.shortDescription}
          </p>
        </div>
        <Link
          href={`/services/${service.slug}`}
          className="font-label mt-8 inline-flex text-[0.7rem] tracking-[0.2em] text-burgundy transition hover:text-aubergine"
        >
          Learn More →
        </Link>
      </div>
    </article>
  );
}
