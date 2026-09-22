import "server-only";

import { cache } from "react";
import {
  brandToSlug,
  getCollection,
  type CollectionSlug,
  type Department,
  type Product,
} from "@/lib/products";
import { isShopifyReady, shopifyMissingKeys } from "@/lib/shopify/config";
import {
  mapShopifyProduct,
  type MappedProduct,
  type ShopifyProductNode,
} from "@/lib/shopify/map-product";
import { ALL_PRODUCTS_QUERY, BEST_SELLING_QUERY } from "@/lib/shopify/queries";
import { shopifyStorefrontGraphql } from "@/lib/shopify/storefront";
import { preferAvailable } from "@/lib/collection-view";
import {
  applyInventoryQuantities,
  fetchAdminVariantQuantities,
} from "@/lib/shopify/inventory";
import { buildSearchIndex, searchIndex, type SearchIndex } from "@/lib/search";

/** Pages are prerendered and refreshed on this interval. */
export const CATALOG_REVALIDATE_SECONDS = 60;
export const CATALOG_TAG = "shopify-catalog-stock";

const NEWEST_COUNT = 12;
const BEST_SELLING_COUNT = 24;

export type Brand = {
  name: string;
  slug: string;
  count: number;
  image?: string;
};

type Catalog = {
  /** Newest first, as returned by Shopify. */
  products: Product[];
  bySlug: Map<string, Product>;
  bestSellers: Product[];
  brands: Brand[];
  search: SearchIndex;
};

type AllProductsResponse = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: ShopifyProductNode[];
  };
};

type BestSellingResponse = {
  products: { nodes: Array<{ handle: string }> };
};

const fetchOptions = {
  revalidate: CATALOG_REVALIDATE_SECONDS,
  tags: [CATALOG_TAG],
};

async function fetchAllProducts() {
  const nodes: ShopifyProductNode[] = [];
  let cursor: string | null = null;

  do {
    const data: AllProductsResponse =
      await shopifyStorefrontGraphql<AllProductsResponse>(
        ALL_PRODUCTS_QUERY,
        { cursor },
        fetchOptions,
      );
    nodes.push(...data.products.nodes);
    cursor = data.products.pageInfo.hasNextPage
      ? data.products.pageInfo.endCursor
      : null;
  } while (cursor);

  return nodes;
}

async function fetchBestSellingHandles() {
  try {
    const data = await shopifyStorefrontGraphql<BestSellingResponse>(
      BEST_SELLING_QUERY,
      { first: BEST_SELLING_COUNT },
      fetchOptions,
    );
    return data.products.nodes.map((node) => node.handle);
  } catch {
    // Ranking is a nice-to-have; never fail a page over it.
    return [];
  }
}

function buildBrands(products: Product[]): Brand[] {
  const brands = new Map<string, Brand>();
  for (const product of products) {
    const existing = brands.get(product.brand);
    if (existing) {
      existing.count += 1;
      continue;
    }
    brands.set(product.brand, {
      name: product.brand,
      slug: brandToSlug(product.brand),
      count: 1,
      image: product.images[0],
    });
  }
  return [...brands.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function emptyCatalog(): Catalog {
  return {
    products: [],
    bySlug: new Map(),
    bestSellers: [],
    brands: [],
    search: buildSearchIndex([]),
  };
}

const loadCatalog = cache(async (): Promise<Catalog> => {
  if (!isShopifyReady()) {
    console.error(
      `Shopify is not configured. Missing: ${shopifyMissingKeys().join(", ")}`,
    );
    return emptyCatalog();
  }

  let nodes: ShopifyProductNode[];
  let bestSellingHandles: string[];
  let adminQuantities: Map<string, number> | null;

  try {
    [nodes, bestSellingHandles, adminQuantities] = await Promise.all([
      fetchAllProducts(),
      fetchBestSellingHandles(),
      fetchAdminVariantQuantities(),
    ]);
  } catch (error) {
    // Frozen/unpaid shops 404 the Storefront API. Keep the site up.
    console.error("Shopify catalog unavailable", error);
    return emptyCatalog();
  }

  const mapped: MappedProduct[] = applyInventoryQuantities(
    nodes
      .map(mapShopifyProduct)
      .filter((product) => product.images.length > 0 && product.variants.length > 0),
    adminQuantities,
  );

  const bestSellingRank = new Map(
    bestSellingHandles.map((handle, index) => [handle, index]),
  );

  // Shopify already returned newest first, so position stands in for recency.
  const products: Product[] = mapped.map((product, index) => {
    const tags = [...product.tags];
    if (index < NEWEST_COUNT) tags.push("new");
    if (bestSellingRank.has(product.slug)) tags.push("bestseller");
    return { ...product, tags };
  });

  const bySlug = new Map(products.map((product) => [product.slug, product]));

  const bestSellers = [...bestSellingRank.keys()]
    .map((handle) => bySlug.get(handle))
    .filter((product): product is Product => Boolean(product));

  return {
    products,
    bySlug,
    bestSellers,
    brands: buildBrands(products),
    search: buildSearchIndex(products),
  };
});

export async function getAllProducts() {
  return (await loadCatalog()).products;
}

export async function getProduct(slug: string) {
  return (await loadCatalog()).bySlug.get(slug);
}

export async function getNewArrivals(limit = 8) {
  return (await loadCatalog()).products
    .filter((product) => product.available)
    .slice(0, limit);
}

export async function getBestSellers(
  limit = BEST_SELLING_COUNT,
  options?: { inStockOnly?: boolean },
) {
  const { bestSellers, products } = await loadCatalog();
  // A store with no order history yet returns no ranking.
  const ranked = bestSellers.length > 0 ? bestSellers : products;
  const source = options?.inStockOnly
    ? ranked.filter((product) => product.available)
    : ranked;
  return source.slice(0, limit);
}

/** Gender collections lead with clothing so they don't read as accessory pages. */
const DEPARTMENT_ORDER: Record<Department, number> = {
  clothing: 0,
  shoes: 1,
  accessories: 2,
};

export async function getProductsByCollection(slug: CollectionSlug) {
  const { products } = await loadCatalog();

  switch (slug) {
    case "new-arrivals":
      return products;
    case "women":
    case "men":
      return products
        .filter((product) => product.gender === slug)
        .sort(
          (a, b) =>
            DEPARTMENT_ORDER[a.department] - DEPARTMENT_ORDER[b.department],
        );
    case "accessories":
      return products.filter((product) => product.department === "accessories");
    case "best-sellers":
      return getBestSellers();
    case "sale":
      return products.filter((product) => product.compareAtPrice !== undefined);
  }
}

export async function getBrands() {
  return (await loadCatalog()).brands;
}

export async function getBrandBySlug(slug: string) {
  return (await loadCatalog()).brands.find((brand) => brand.slug === slug);
}

export async function getProductsByBrand(name: string) {
  const { products } = await loadCatalog();
  return products.filter((product) => product.brand === name);
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const { products } = await loadCatalog();
  const candidates = products.filter((item) => item.id !== product.id);

  const ranked = [
    candidates.filter(
      (item) =>
        item.subcategory === product.subcategory && item.gender === product.gender,
    ),
    candidates.filter(
      (item) =>
        item.department === product.department && item.gender === product.gender,
    ),
    candidates,
  ];

  const related: Product[] = [];
  for (const group of ranked) {
    for (const item of preferAvailable(group)) {
      if (related.length >= limit) return related;
      if (!related.some((existing) => existing.id === item.id)) related.push(item);
    }
  }
  return related;
}

/** Ranked by relevance. An empty query returns nothing, not the whole store. */
export async function searchProducts(query: string) {
  const { search } = await loadCatalog();
  return searchIndex(search, query);
}

export type CollectionPreview = {
  slug: CollectionSlug;
  title: string;
  description: string;
  count: number;
  image?: string;
};

/**
 * Collections need artwork, so each borrows a product shot. Clothing is
 * preferred because those photos feature models, and images are not reused
 * across tiles.
 */
export async function getCollectionPreviews(slugs: CollectionSlug[]) {
  const previews: CollectionPreview[] = [];
  const used = new Set<string>();

  for (const slug of slugs) {
    const collection = getCollection(slug);
    if (!collection) continue;

    const items = await getProductsByCollection(slug);
    const preferred = [
      ...items.filter((item) => item.available && item.department === "clothing"),
      ...items.filter((item) => item.available),
      ...items.filter((item) => item.department === "clothing"),
      ...items,
    ];
    const image = preferred
      .flatMap((item) => item.images)
      .find((candidate) => !used.has(candidate));
    if (image) used.add(image);

    previews.push({
      slug,
      title: collection.title,
      description: collection.description,
      count: items.length,
      image,
    });
  }
  return previews;
}

