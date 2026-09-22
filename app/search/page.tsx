import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { ProductGrid } from "@/components/product-grid";
import { searchProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: false },
  alternates: { canonical: "/search" },
};

const SUGGESTIONS = ["Barbour", "Blazer", "Boots", "Black", "Bags", "Sale"];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query ? await searchProducts(query) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <PageIntro
        eyebrow="Search"
        title={query ? `Results for “${query}”` : "Search"}
      >
        {query
          ? `${results.length} ${results.length === 1 ? "piece" : "pieces"}`
          : "Search by brand, piece, colour or season."}
      </PageIntro>

      {query ? (
        results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <div className="py-12 text-center">
            <p className="font-serif text-2xl sm:text-3xl">
              Nothing matches “{query}”.
            </p>
            <p className="mt-3 text-sm text-muted">Try one of these instead.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <Link
                  key={suggestion}
                  href={`/search?q=${encodeURIComponent(suggestion)}`}
                  className="border border-line px-3 py-2 text-[11px] uppercase tracking-[0.16em] hover:border-ink"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-wrap justify-center gap-2 py-6">
          {SUGGESTIONS.map((suggestion) => (
            <Link
              key={suggestion}
              href={`/search?q=${encodeURIComponent(suggestion)}`}
              className="border border-line px-3 py-2 text-[11px] uppercase tracking-[0.16em] hover:border-ink"
            >
              {suggestion}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
