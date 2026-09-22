import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageIntro } from "@/components/page-intro";
import { ProductGrid } from "@/components/product-grid";
import { getBrandBySlug, getBrands, getProductsByBrand } from "@/lib/catalog";
import { sortProducts } from "@/lib/collection-view";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

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
  if (!brand) {
    return { title: "Brand", robots: { index: false, follow: false } };
  }

  return pageMetadata({
    title: brand.name,
    description: `Shop ${brand.name} at Skyvano.`,
    path: `/brands/${brand.slug}`,
    images: brand.image ? [brand.image] : undefined,
  });
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
      <Breadcrumbs
        baseUrl={SITE_URL}
        trail={[
          { label: "Home", href: "/" },
          { label: "Brands", href: "/brands" },
          { label: brand.name },
        ]}
      />
      <PageIntro eyebrow="Brand" title={brand.name}>
        {items.length} {items.length === 1 ? "piece" : "pieces"} in the Skyvano
        edit.
      </PageIntro>
      <ProductGrid products={sortProducts(items, "featured")} />
    </div>
  );
}
