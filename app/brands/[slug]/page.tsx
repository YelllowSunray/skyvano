import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { ProductGrid } from "@/components/product-grid";
import {
  brandToSlug,
  getBrand,
  getProductsByBrand,
  houses,
} from "@/lib/products";

export function generateStaticParams() {
  return houses.map((house) => ({ slug: brandToSlug(house) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  return {
    title: brand ?? "Brand",
    description: brand
      ? `Shop ${brand} at Skyvano.`
      : "Designer pieces at Skyvano.",
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();
  const items = getProductsByBrand(brand);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
      <PageIntro eyebrow="Brand" title={brand}>
        {items.length} {items.length === 1 ? "piece" : "pieces"} in the Skyvano
        edit.
      </PageIntro>
      <ProductGrid products={items} />
    </div>
  );
}
