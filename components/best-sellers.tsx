"use client";

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
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
              Most requested
            </p>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl">Best sellers</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="h-10 w-10 border border-ink"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="h-10 w-10 border border-ink"
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>
        <div
          ref={scroller}
          className="no-scrollbar flex snap-x gap-5 overflow-x-auto"
        >
          {items.map((product) => (
            <div key={product.id} className="w-[260px] shrink-0 snap-start md:w-[300px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
