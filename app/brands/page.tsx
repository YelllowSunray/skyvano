import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { getBrands } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Brands",
  description: "Shop the designer houses in the Skyvano edit.",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 md:px-8 md:pb-20">
      <PageIntro eyebrow="The edit" title="Brands">
        {brands.length} designer houses, selected and authenticated for Skyvano.
      </PageIntro>
      <ul className="divide-y divide-line border-y border-line">
        {brands.map((brand) => (
          <li key={brand.slug}>
            <Link
              href={`/brands/${brand.slug}`}
              className="flex items-baseline justify-between gap-4 py-6 transition-colors hover:text-gold sm:py-8"
            >
              <span className="font-serif text-2xl sm:text-4xl">{brand.name}</span>
              <span className="shrink-0 text-[11px] uppercase tracking-[0.2em] text-muted">
                {brand.count} {brand.count === 1 ? "piece" : "pieces"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
