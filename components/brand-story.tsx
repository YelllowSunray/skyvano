import Image from "next/image";
import { Button } from "@/components/button";

export function BrandStory() {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="relative min-h-[480px]">
        <Image
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80"
          alt="Skyvano atelier"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-col justify-center bg-ivory px-8 py-16 md:px-16">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
          The house
        </p>
        <h2 className="mt-3 max-w-md font-serif text-5xl leading-tight">
          Designed for those who stand out.
        </h2>
        <p className="mt-6 max-w-md text-base leading-8 text-muted">
          Discover carefully selected pieces that combine contemporary fashion
          with premium style. Skyvano brings together designer clothing for
          women, men and accessories — edited, not overstocked.
        </p>
        <div className="mt-8">
          <Button href="/about" variant="outline">
            Discover Skyvano
          </Button>
        </div>
      </div>
    </section>
  );
}
