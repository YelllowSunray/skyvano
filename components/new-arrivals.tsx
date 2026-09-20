import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export function NewArrivals() {
  const items = products.filter((product) => product.tags.includes("new")).slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
            Just in
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl">
            New arrivals
          </h2>
        </div>
        <Link
          href="/collections/new-arrivals"
          className="shrink-0 text-[11px] uppercase tracking-[0.18em] underline decoration-gold underline-offset-8"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 md:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
