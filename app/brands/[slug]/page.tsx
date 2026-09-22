import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { ProductGrid } from "@/components/product-grid";
import { getBrandBySlug, getBrands, getProductsByBrand } from "@/lib/catalog";
import { sortProducts } from "@/lib/collection-view";

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  return {
    title: brand?.name ?? "Brand",
    description: brand
      ? `Shop ${brand.name} at Skyvano.`
      : "Designer pieces at Skyvano.",
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();
  const items = await getProductsByBrand(brand.name);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
      <PageIntro eyebrow="Brand" title={brand.name}>
        {items.length} {items.length === 1 ? "piece" : "pieces"} in the Skyvano
        edit.
      </PageIntro>
      <ProductGrid products={sortProducts(items, "featured")} />
    </div>
  );
}
