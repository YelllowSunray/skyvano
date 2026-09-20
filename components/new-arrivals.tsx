import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export function NewArrivals() {
  const items = products.filter((product) => product.tags.includes("new")).slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
            Just in
          </p>
          <h2 className="mt-2 font-serif text-4xl md:text-5xl">New arrivals</h2>
        </div>
        <Link
          href="/collections/new-arrivals"
          className="hidden text-[11px] uppercase tracking-[0.22em] underline decoration-gold underline-offset-8 md:block"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
