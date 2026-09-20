import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro, Prose } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story of Skyvano, a curated luxury designer boutique.",
};

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="The house" title="About Skyvano">
        A boutique for people who want designer clothing without the noise.
      </PageIntro>
      <div className="relative mx-auto mb-12 h-[420px] max-w-5xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
          alt="Skyvano boutique"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <Prose>
        <p>
          Skyvano was built for a simple idea: luxury should feel considered,
          not crowded. We edit designer clothing and accessories for women and
          men — Gucci, Prada, Burberry, Michael Kors, Rick Owens and a small
          circle of houses that share the same standard of cut and material.
        </p>
        <p className="mt-6">
          We are an independent retailer. That means we do not try to be
          everything. New arrivals are chosen for how they wear, how they last,
          and how they sit next to the rest of the edit. If a piece does not
          earn its place, it does not make the site.
        </p>
        <p className="mt-6">
          Behind the storefront is a European client team that handles sizing
          questions, authentication checks and aftercare. The goal is not a
          louder brand. It is a quieter kind of confidence: elevated style,
          every day.
        </p>
      </Prose>
    </>
  );
}
