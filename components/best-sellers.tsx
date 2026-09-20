"use client";

import Link from "next/link";
import { useRef } from "react";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export function BestSellers() {
  const scroller = useRef<HTMLDivElement>(null);
  const items = products.filter((product) => product.tags.includes("bestseller"));

  const scroll = (direction: number) => {
    scroller.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
              Most requested
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl">
              Best sellers
            </h2>
          </div>
          <Link
            href="/collections/best-sellers"
            className="shrink-0 text-[11px] uppercase tracking-[0.18em] underline decoration-gold underline-offset-8 md:hidden"
          >
            View all
          </Link>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="flex h-11 w-11 items-center justify-center border border-ink"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="flex h-11 w-11 items-center justify-center border border-ink"
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:hidden">
          {items.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div
          ref={scroller}
          className="no-scrollbar hidden snap-x gap-5 overflow-x-auto md:flex"
        >
          {items.map((product) => (
            <div key={product.id} className="w-[300px] shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
