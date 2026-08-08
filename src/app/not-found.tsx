import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 py-32">
      <div className="aubergine-gradient absolute inset-0" />
      <div
        className="grape-pattern absolute inset-0 opacity-40"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-xl text-center text-ivory">
        <p className="font-label text-[0.7rem] tracking-[0.24em] text-lavender">
          Page not found
        </p>
        <h1 className="font-serif mt-5 text-5xl md:text-6xl">
          This path is not on the map
        </h1>
        <p className="mt-6 text-base leading-relaxed text-ivory/75">
          The page you requested may have moved, or the link may be incomplete.
          Return home or book a complimentary consultation.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/" variant="magnetic">
            Return home
          </Button>
          <Button href="/contact" variant="ghost">
            Contact
          </Button>
        </div>
        <p className="mt-10 text-sm text-ivory/55">
          Looking for services?{" "}
          <Link
            href="/services"
            className="text-lavender underline-offset-4 hover:underline"
          >
            Explore buyer services
          </Link>
        </p>
      </div>
    </section>
  );
}
