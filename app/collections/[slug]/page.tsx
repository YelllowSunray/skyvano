import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { ProductGrid } from "@/components/product-grid";
import { getProductsByCollection } from "@/lib/catalog";
import { collections, getCollection, isCollectionSlug } from "@/lib/products";

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  return {
    title: collection?.title ?? "Collection",
    description: collection?.description,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isCollectionSlug(slug)) notFound();

  const collection = getCollection(slug);
  if (!collection) notFound();
  const items = await getProductsByCollection(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
      <PageIntro eyebrow="Collection" title={collection.title}>
        {collection.description}
      </PageIntro>
      <ProductGrid products={items} />
    </div>
  );
}
