import Link from "next/link";
import { getBrands } from "@/lib/catalog";

/** The store carries 30+ brands; the homepage shows the best-stocked ones. */
export async function ShopByBrand({ limit = 12 }: { limit?: number }) {
  const brands = (await getBrands())
    .slice()
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);

  if (brands.length === 0) return null;

  return (
    <section className="border-y border-line bg-ivory px-4 py-12 sm:py-16 md:px-8">
      <div className="mx-auto mb-8 flex max-w-7xl items-end justify-between gap-4 sm:mb-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
            The houses
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl">
            Shop by brand
          </h2>
        </div>
        <Link
          href="/brands"
          className="shrink-0 text-[11px] uppercase tracking-[0.18em] underline decoration-gold underline-offset-8"
        >
          View all
        </Link>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-6">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/brands/${brand.slug}`}
            className="font-serif text-2xl leading-tight text-ink transition-colors hover:text-gold sm:text-3xl md:text-4xl"
          >
            {brand.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
