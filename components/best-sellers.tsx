"use client";

import { useRef } from "react";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export function BestSellers() {
  const scroller = useRef<HTMLDivElement>(null);
  const items = products.filter((product) => product.tags.includes("bestseller"));

  const scroll = (direction: number) => {
    scroller.current?.scrollBy({ left: direction * 280, behavior: "smooth" });
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
          <div className="flex gap-2">
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
        <div
          ref={scroller}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 touch-pan-x md:mx-0 md:px-0"
        >
          {items.map((product) => (
            <div
              key={product.id}
              className="w-[72vw] max-w-[280px] shrink-0 snap-start sm:w-[260px] md:w-[300px] md:max-w-none"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
