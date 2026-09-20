import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { ProductGrid } from "@/components/product-grid";
import {
  collections,
  getCollection,
  getProductsByCollection,
} from "@/lib/products";

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
  const collection = getCollection(slug);
  if (!collection) notFound();
  const items = getProductsByCollection(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <PageIntro eyebrow="Collection" title={collection.title}>
        {collection.description}
      </PageIntro>
      <ProductGrid products={items} />
    </div>
  );
}
