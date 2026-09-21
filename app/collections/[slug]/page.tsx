import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CollectionToolbar } from "@/components/collection-toolbar";
import { PageIntro } from "@/components/page-intro";
import { ProductGrid } from "@/components/product-grid";
import { getProductsByCollection } from "@/lib/catalog";
import {
  buildFacets,
  filterProducts,
  isSortKey,
  sortProducts,
  type Filters,
} from "@/lib/collection-view";
import { collections, getCollection, isCollectionSlug } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

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
    alternates: { canonical: `/collections/${slug}` },
  };
}

type SearchParams = {
  sort?: string;
  brand?: string | string[];
  size?: string | string[];
  colour?: string | string[];
  available?: string;
};

function toArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  if (!isCollectionSlug(slug)) notFound();

  const collection = getCollection(slug);
  if (!collection) notFound();

  const query = await searchParams;
  const sort = isSortKey(query.sort) ? query.sort : "featured";
  const filters: Filters = {
    brands: toArray(query.brand),
    sizes: toArray(query.size),
    colours: toArray(query.colour),
    inStockOnly: query.available === "1",
  };

  const all = await getProductsByCollection(slug);
  // Facets describe the whole collection, so counts do not shift as you filter.
  const facets = buildFacets(all);
  const items = sortProducts(filterProducts(all, filters), sort);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
      <Breadcrumbs
        baseUrl={SITE_URL}
        trail={[
          { label: "Home", href: "/" },
          { label: collection.title },
        ]}
      />
      <PageIntro eyebrow="Collection" title={collection.title}>
        {collection.description}
      </PageIntro>
      <CollectionToolbar
        total={all.length}
        shown={items.length}
        sort={sort}
        filters={filters}
        facets={facets}
      />
      <ProductGrid products={items} />
    </div>
  );
}
