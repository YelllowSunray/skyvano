import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CollectionToolbar } from "@/components/collection-toolbar";
import { GenderLanding } from "@/components/gender-landing";
import { PageIntro, TextLink } from "@/components/page-intro";
import { ProductGrid } from "@/components/product-grid";
import {
  DEPARTMENT_LABEL,
  getGenderNavigation,
  getScopedCollectionProducts,
  type GenderNav,
} from "@/lib/catalog";
import {
  buildFacets,
  filterProducts,
  isSortKey,
  sortProducts,
  type Filters,
} from "@/lib/collection-view";
import {
  collections,
  getCollection,
  isCollectionSlug,
  type Department,
} from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) {
    return { title: "Collection", robots: { index: false, follow: false } };
  }

  const query = await searchParams;
  const nav = await getGenderNavigation();
  const heading = categoryHeading(
    slug,
    query.category,
    query.department,
    nav,
  );

  return pageMetadata({
    title: heading ?? collection.title,
    description: heading
      ? `${heading} at Skyvano.`
      : collection.description,
    path: `/collections/${collection.slug}`,
  });
}

type SearchParams = {
  sort?: string;
  brand?: string | string[];
  size?: string | string[];
  colour?: string | string[];
  available?: string;
  category?: string;
  department?: string;
  all?: string;
};

const DEPARTMENTS = new Set<Department>(["clothing", "shoes", "accessories"]);

function isDepartment(value: string | undefined): value is Department {
  return Boolean(value && DEPARTMENTS.has(value as Department));
}

function categoryHeading(
  slug: string,
  category: string | undefined,
  department: string | undefined,
  nav: GenderNav[],
) {
  if (slug !== "women" && slug !== "men") return undefined;
  const gender = slug === "women" ? "Women" : "Men";
  const item = nav?.find((entry) => entry.gender === slug);
  if (category) {
    const name = item?.departments
      .flatMap((entry) => entry.categories)
      .find((entry) => entry.slug === category)?.name;
    const label =
      name ??
      category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    return `${gender}’s ${label}`;
  }
  if (isDepartment(department)) {
    return `${gender}’s ${DEPARTMENT_LABEL[department]}`;
  }
  return undefined;
}

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

  const department = isDepartment(query.department)
    ? query.department
    : undefined;
  const category = query.category?.trim() || undefined;
  const nav = await getGenderNavigation();
  const heading = categoryHeading(slug, category, department, nav);
  const genderItem = nav.find((entry) => entry.gender === slug);
  const showLanding =
    Boolean(genderItem?.departments.length) &&
    !department &&
    !category &&
    query.all !== "1";

  if (showLanding && genderItem) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
        <Breadcrumbs
          baseUrl={SITE_URL}
          trail={[{ label: "Home", href: "/" }, { label: collection.title }]}
        />
        <PageIntro eyebrow="Collection" title={collection.title}>
          {collection.description} Choose a world below, or{" "}
          <TextLink href={`${genderItem.href}?all=1`}>
            shop all {collection.title.toLowerCase()}
          </TextLink>
          .
        </PageIntro>
        <GenderLanding item={genderItem} />
      </div>
    );
  }

  const scoped = await getScopedCollectionProducts({
    slug,
    category,
    department,
    nav,
  });
  // Facets describe the scoped collection, so counts match what you see.
  const facets = buildFacets(scoped);
  const items = sortProducts(filterProducts(scoped, filters), sort);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
      <Breadcrumbs
        baseUrl={SITE_URL}
        trail={[
          { label: "Home", href: "/" },
          {
            label: collection.title,
            href: heading ? `/collections/${slug}` : undefined,
          },
          ...(heading ? [{ label: heading }] : []),
        ]}
      />
      <PageIntro eyebrow="Collection" title={heading ?? collection.title}>
        {heading
          ? `${items.length} ${items.length === 1 ? "piece" : "pieces"} in the Skyvano edit.`
          : collection.description}
      </PageIntro>
      <Suspense>
        <CollectionToolbar
          total={scoped.length}
          shown={items.length}
          sort={sort}
          filters={filters}
          facets={facets}
        />
      </Suspense>
      <ProductGrid products={items} pageSize={25} />
    </div>
  );
}
