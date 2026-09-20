import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { brandToSlug, getProductsByBrand, houses } from "@/lib/products";

export const metadata: Metadata = {
  title: "Brands",
  description: "Shop the designer houses in the Skyvano edit.",
};

export default function BrandsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 md:px-8 md:pb-20">
      <PageIntro eyebrow="The edit" title="Brands">
        Designer houses, selected and authenticated for Skyvano.
      </PageIntro>
      <ul className="divide-y divide-line border-y border-line">
        {houses.map((house) => {
          const count = getProductsByBrand(house).length;
          return (
            <li key={house}>
              <Link
                href={`/brands/${brandToSlug(house)}`}
                className="flex items-baseline justify-between gap-4 py-6 transition-colors hover:text-gold sm:py-8"
              >
                <span className="font-serif text-3xl sm:text-5xl">{house}</span>
                <span className="shrink-0 text-[11px] uppercase tracking-[0.2em] text-muted">
                  {count} {count === 1 ? "piece" : "pieces"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
