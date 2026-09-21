import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product-card";
import { ProductDetail } from "@/components/product-detail";
import { getAllProducts, getProduct, getRelatedProducts } from "@/lib/catalog";
import { brandToSlug, type Product } from "@/lib/products";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product" };

  return {
    title: `${product.name} — ${product.brand}`,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} — ${product.brand}`,
      description: product.description,
      url: `${SITE_URL}/products/${product.slug}`,
      images: product.images.slice(0, 1).map((url) => ({ url })),
    },
  };
}

/**
 * Product schema is what lets Google show price and availability in results.
 * Offers are listed per variant so a partly sold-out product still advertises
 * the sizes that can be bought.
 */
function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.name}`,
    description: product.description,
    image: product.images,
    sku: product.slug,
    brand: { "@type": "Brand", name: product.brand },
    offers: product.variants.map((variant) => ({
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: "EUR",
      price: variant.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: variant.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    })),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Breadcrumbs
          baseUrl={SITE_URL}
          trail={[
            { label: "Home", href: "/" },
            {
              label: product.gender === "women" ? "Women" : "Men",
              href: `/collections/${product.gender}`,
            },
            { label: product.brand, href: `/brands/${brandToSlug(product.brand)}` },
            { label: product.name },
          ]}
        />
      </div>
      <ProductDetail product={product} />
      {related.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-28 md:px-8 md:pb-20">
          <h2 className="mb-6 font-serif text-3xl sm:mb-8 sm:text-4xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-5 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema(product)) }}
      />
    </>
  );
}
