import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { ProductGrid } from "@/components/product-grid";
import { searchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Search",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = searchProducts(q);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <PageIntro eyebrow="Search" title={q ? `Results for “${q}”` : "Search"}>
        {results.length} {results.length === 1 ? "piece" : "pieces"}
      </PageIntro>
      <ProductGrid products={results} />
    </div>
  );
}
