import "server-only";

import { cache } from "react";
import {
  brandToSlug,
  getCollection,
  type CollectionSlug,
  type Department,
  type Gender,
  type Product,
} from "@/lib/products";
import { isShopifyReady, shopifyMissingKeys } from "@/lib/shopify/config";
import {
  mapShopifyProduct,
  resolveDepartment,
  resolveGender,
  resolveSubcategory,
  type ShopifyNavNode,
  type ShopifyProductNode,
} from "@/lib/shopify/map-product";
import {
  BEST_SELLING_QUERY,
  NAV_PRODUCTS_QUERY,
  NEWEST_PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  SEARCHED_PRODUCTS_QUERY,
} from "@/lib/shopify/queries";
import { shopifyStorefrontGraphql } from "@/lib/shopify/storefront";
import { preferAvailable } from "@/lib/collection-view";

/** Listing fetches (category grids, shelves, PDPs). Next requires a literal at the call site. */
export const CATALOG_REVALIDATE_SECONDS = 300;
/** Header mega menu and brand list — a small payload, refreshed less often. */
export const NAV_REVALIDATE_SECONDS = 900;
export const CATALOG_TAG = "shopify-catalog-stock";
export const NAV_TAG = "shopify-nav";

const NEWEST_COUNT = 12;
const BEST_SELLING_COUNT = 24;
const SHELF_POOL = 48;
const NEW_ARRIVALS_COLLECTION_LIMIT = 96;

export type Brand = {
  name: string;
  slug: string;
  count: number;
  image?: string;
};

export const DEPARTMENT_LABEL: Record<Department, string> = {
  clothing: "Clothing",
  shoes: "Shoes",
  accessories: "Accessories",
};

export type NavCategory = {
  slug: string;
  name: string;
  count: number;
};

export type NavDepartment = {
  slug: Department;
  name: string;
  count: number;
  image?: string;
  categories: NavCategory[];
};

export type GenderNav = {
  gender: Gender;
  href: string;
  label: string;
  departments: NavDepartment[];
};

type NavCatalog = {
  brands: Brand[];
  genderNav: GenderNav[];
  handles: string[];
};

type PaginatedProducts = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: ShopifyProductNode[];
  };
};

type NavProductsResponse = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: ShopifyNavNode[];
  };
};

type NewestResponse = {
  products: { nodes: ShopifyProductNode[] };
};

type ProductByHandleResponse = {
  product: ShopifyProductNode | null;
};

const listingFetch = {
  revalidate: CATALOG_REVALIDATE_SECONDS,
  tags: [CATALOG_TAG],
};

const navFetch = {
  revalidate: NAV_REVALIDATE_SECONDS,
  tags: [NAV_TAG],
};

function tagNew(product: Product): Product {
  return product.tags.includes("new")
    ? product
    : { ...product, tags: [...product.tags, "new"] };
}

function tagBestseller(product: Product): Product {
  return product.tags.includes("bestseller")
    ? product
    : { ...product, tags: [...product.tags, "bestseller"] };
}

function mapRenderable(nodes: ShopifyProductNode[]) {
  return nodes
    .map(mapShopifyProduct)
    .filter((product) => product.images.length > 0 && product.variants.length > 0);
}

function mapAvailableNodes(nodes: ShopifyProductNode[]) {
  return mapRenderable(nodes).filter((product) => product.available);
}

function tagTerm(tag: string) {
  return `tag:'${tag.replace(/'/g, "\\'")}'`;
}

function vendorTerm(name: string) {
  return `vendor:'${name.replace(/'/g, "\\'")}'`;
}

function sanitizeSearch(query: string) {
  return query.replace(/[\\'":()]/g, " ").replace(/\s+/g, " ").trim();
}

function collectionSearchQuery({
  gender,
  categoryName,
  categorySlug,
  categoryNames,
}: {
  gender: Gender;
  categoryName?: string;
  categorySlug?: string;
  categoryNames?: string[];
}) {
  const genderClause = `(${tagTerm(`Gender_${gender}`)} OR ${tagTerm(`Gender_${gender === "women" ? "Women" : "Men"}`)})`;

  if (categoryName || categorySlug) {
    const names = [...new Set([categoryName, categorySlug].filter(Boolean))];
    const tags = names.map((name) => tagTerm(`Subcategory_${name}`)).join(" OR ");
    return names.length === 1
      ? `${genderClause} AND ${tags}`
      : `${genderClause} AND (${tags})`;
  }

  if (categoryNames && categoryNames.length > 0) {
    const tags = categoryNames
      .map((name) => tagTerm(`Subcategory_${name}`))
      .join(" OR ");
    return `${genderClause} AND (${tags})`;
  }

  return genderClause;
}

async function fetchProductsByQuery(
  query: string,
  options?: { maxPages?: number },
) {
  const nodes: ShopifyProductNode[] = [];
  let cursor: string | null = null;
  let pages = 0;
  const maxPages = options?.maxPages ?? Number.POSITIVE_INFINITY;

  do {
    const data: PaginatedProducts =
      await shopifyStorefrontGraphql<PaginatedProducts>(
        SEARCHED_PRODUCTS_QUERY,
        { cursor, query },
        listingFetch,
      );
    nodes.push(...data.products.nodes);
    pages += 1;
    cursor =
      pages < maxPages && data.products.pageInfo.hasNextPage
        ? data.products.pageInfo.endCursor
        : null;
  } while (cursor);

  return nodes;
}

async function fetchNewestNodes(first: number) {
  const data = await shopifyStorefrontGraphql<NewestResponse>(
    NEWEST_PRODUCTS_QUERY,
    { first },
    listingFetch,
  );
  return data.products.nodes;
}

async function fetchNewestMapped(first: number) {
  if (!isShopifyReady()) return [];
  try {
    return mapAvailableNodes(await fetchNewestNodes(first));
  } catch (error) {
    console.error("Shopify newest products unavailable", error);
    return [];
  }
}

const newestShelf = cache(async () => fetchNewestMapped(SHELF_POOL));

async function fetchScopedGenderProducts({
  gender,
  categoryName,
  categorySlug,
  categoryNames,
  maxPages,
}: {
  gender: Gender;
  categoryName?: string;
  categorySlug?: string;
  categoryNames?: string[];
  maxPages?: number;
}) {
  if (!isShopifyReady()) return [];

  try {
    const nodes = await fetchProductsByQuery(
      collectionSearchQuery({
        gender,
        categoryName,
        categorySlug,
        categoryNames,
      }),
      { maxPages },
    );
    return mapAvailableNodes(nodes);
  } catch (error) {
    console.error("Shopify scoped catalogue unavailable", error);
    return [];
  }
}

/**
 * Women/Men grids ask Shopify for that gender (and subcategory) only.
 * Results are still checked locally so men's trousers never appear on women.
 */
export async function getScopedCollectionProducts({
  slug,
  category,
  department,
  nav,
}: {
  slug: CollectionSlug;
  category?: string;
  department?: Department;
  nav: GenderNav[];
}): Promise<Product[]> {
  if (slug !== "women" && slug !== "men") {
    return getProductsByCollection(slug);
  }

  const gender = slug;
  const item = nav.find((entry) => entry.gender === gender);
  const categories = item?.departments.flatMap((entry) => entry.categories) ?? [];
  const categoryName = category
    ? categories.find((entry) => entry.slug === category)?.name
    : undefined;
  const departmentNames =
    department && item
      ? item.departments
          .find((entry) => entry.slug === department)
          ?.categories.map((entry) => entry.name)
      : undefined;

  const products = (
    await fetchScopedGenderProducts({
      gender,
      categoryName,
      categorySlug: category,
      categoryNames: !category && department ? departmentNames : undefined,
      // Shop-all / department dumps stay one Shopify page; a subcategory is smaller.
      maxPages: category ? undefined : 1,
    })
  ).filter((product) => {
    if (product.gender !== gender) return false;
    if (department && product.department !== department) return false;
    if (category && brandToSlug(product.subcategory) !== category) return false;
    return true;
  });

  if (products.length === 0) {
    console.warn("Shopify scoped catalogue empty", { slug, category, department });
  }

  return products;
}

function looksLikeNewest(ranked: Product[], newest: Product[]) {
  const count = Math.min(8, ranked.length, newest.length);
  return (
    count === 0 ||
    ranked.slice(0, count).every((product, index) => product.id === newest[index]?.id)
  );
}

/** Older pieces, one brand first — used until Shopify has a real sales rank. */
function pickEstablished(products: Product[], limit: number, excludeIds?: Set<string>) {
  const rest = products.filter((product) => !excludeIds?.has(product.id));
  const established = products.filter(
    (product, index) => index >= NEWEST_COUNT && !excludeIds?.has(product.id),
  );
  const pool = established.length >= limit ? established : rest;
  const picked: Product[] = [];
  const brands = new Set<string>();

  for (const product of pool) {
    if (picked.length >= limit) return picked;
    if (brands.has(product.brand)) continue;
    brands.add(product.brand);
    picked.push(product);
  }
  for (const product of pool) {
    if (picked.length >= limit) return picked;
    if (picked.some((item) => item.id === product.id)) continue;
    picked.push(product);
  }
  return picked;
}

export async function getNewArrivals(limit = 8) {
  const pool =
    limit <= SHELF_POOL
      ? await newestShelf()
      : await fetchNewestMapped(Math.min(250, limit));
  return pool.slice(0, limit).map(tagNew);
}

export async function getBestSellers(
  limit = BEST_SELLING_COUNT,
  options?: { excludeIds?: Iterable<string> },
) {
  const excludeIds = options?.excludeIds
    ? new Set(options.excludeIds)
    : undefined;

  if (!isShopifyReady()) return [];

  let ranked: Product[] = [];
  try {
    const data = await shopifyStorefrontGraphql<NewestResponse>(
      BEST_SELLING_QUERY,
      { first: BEST_SELLING_COUNT },
      listingFetch,
    );
    ranked = mapAvailableNodes(data.products.nodes);
  } catch (error) {
    console.error("Shopify best sellers unavailable", error);
  }

  const newest = await newestShelf();

  // No orders yet: Shopify's BEST_SELLING list is just "newest", so the two
  // homepage rows would be identical. Pull a different edit instead.
  const picked = looksLikeNewest(ranked, newest)
    ? pickEstablished(newest, limit, excludeIds)
    : ranked.filter((product) => !excludeIds?.has(product.id)).slice(0, limit);

  return picked.map(tagBestseller);
}

export async function getOnSale(
  limit = 8,
  options?: { excludeIds?: Iterable<string> },
) {
  const excludeIds = options?.excludeIds
    ? new Set(options.excludeIds)
    : undefined;

  if (!isShopifyReady()) return [];

  try {
    const nodes = await fetchProductsByQuery("compare_at_price:>0", {
      maxPages: 1,
    });
    return mapAvailableNodes(nodes)
      .filter(
        (product) =>
          product.compareAtPrice !== undefined && !excludeIds?.has(product.id),
      )
      .slice(0, limit);
  } catch (error) {
    console.error("Shopify sale products unavailable", error);
    return [];
  }
}

export const getProduct = cache(async (slug: string) => {
  if (!isShopifyReady() || !slug) return undefined;

  try {
    const data = await shopifyStorefrontGraphql<ProductByHandleResponse>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle: slug },
      listingFetch,
    );
    if (!data.product) return undefined;
    const product = mapShopifyProduct(data.product);
    if (product.images.length === 0 || product.variants.length === 0) {
      return undefined;
    }
    return product;
  } catch (error) {
    console.error("Shopify product unavailable", slug, error);
    return undefined;
  }
});

/** Gender collections lead with clothing so they don't read as accessory pages. */
const DEPARTMENT_ORDER: Record<Department, number> = {
  clothing: 0,
  shoes: 1,
  accessories: 2,
};

async function fetchAvailableByQuery(
  query: string,
  options?: { maxPages?: number },
) {
  if (!isShopifyReady()) return [];
  try {
    return mapAvailableNodes(await fetchProductsByQuery(query, options));
  } catch (error) {
    console.error("Shopify collection unavailable", error);
    return [];
  }
}

export async function getProductsByCollection(slug: CollectionSlug) {
  switch (slug) {
    case "new-arrivals":
      return (await fetchNewestMapped(NEW_ARRIVALS_COLLECTION_LIMIT)).map(
        (product, index) => (index < NEWEST_COUNT ? tagNew(product) : product),
      );
    case "women":
    case "men":
      return (await fetchScopedGenderProducts({ gender: slug })).sort(
        (a, b) =>
          DEPARTMENT_ORDER[a.department] - DEPARTMENT_ORDER[b.department],
      );
    case "accessories":
      return (
        await fetchAvailableByQuery(
          `(${tagTerm("Category_Accessories")} OR ${tagTerm("Category_accessories")})`,
          { maxPages: 1 },
        )
      ).filter((product) => product.department === "accessories");
    case "best-sellers":
      return getBestSellers();
    case "sale":
      return (
        await fetchAvailableByQuery("compare_at_price:>0", { maxPages: 1 })
      ).filter((product) => product.compareAtPrice !== undefined);
  }
}

function buildBrands(items: Array<{ brand: string; image?: string }>): Brand[] {
  const brands = new Map<string, Brand>();
  for (const item of items) {
    if (!item.brand) continue;
    const existing = brands.get(item.brand);
    if (existing) {
      existing.count += 1;
      continue;
    }
    brands.set(item.brand, {
      name: item.brand,
      slug: brandToSlug(item.brand),
      count: 1,
      image: item.image,
    });
  }
  return [...brands.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function buildGenderNav(
  items: Array<{
    gender: Gender;
    department: Department;
    subcategory: string;
    image?: string;
  }>,
): GenderNav[] {
  return (["women", "men"] as const).map((gender) => {
    const genderItems = items.filter((item) => item.gender === gender);
    const byDept = new Map<Department, Map<string, number>>();

    for (const item of genderItems) {
      const name = item.subcategory.trim();
      if (!name) continue;
      const counts = byDept.get(item.department) ?? new Map<string, number>();
      counts.set(name, (counts.get(name) ?? 0) + 1);
      byDept.set(item.department, counts);
    }

    const departments: NavDepartment[] = [];
    const usedImages = new Set<string>();
    for (const slug of ["clothing", "shoes", "accessories"] as Department[]) {
      const counts = byDept.get(slug);
      if (!counts || counts.size === 0) continue;
      const deptItems = genderItems.filter((item) => item.department === slug);
      const image = deptItems
        .map((item) => item.image)
        .find((candidate): candidate is string => Boolean(candidate && !usedImages.has(candidate)));
      if (image) usedImages.add(image);
      departments.push({
        slug,
        name: DEPARTMENT_LABEL[slug],
        count: deptItems.length,
        image,
        categories: [...counts]
          .map(([name, count]) => ({
            slug: brandToSlug(name),
            name,
            count,
          }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      });
    }

    return {
      gender,
      href: `/collections/${gender}`,
      label: gender === "women" ? "Women" : "Men",
      departments,
    };
  });
}

function emptyNav(): NavCatalog {
  return { brands: [], genderNav: [], handles: [] };
}

const loadNav = cache(async (): Promise<NavCatalog> => {
  if (!isShopifyReady()) {
    console.error(
      `Shopify is not configured. Missing: ${shopifyMissingKeys().join(", ")}`,
    );
    return emptyNav();
  }

  try {
    const nodes: ShopifyNavNode[] = [];
    let cursor: string | null = null;

    do {
      const data: NavProductsResponse =
        await shopifyStorefrontGraphql<NavProductsResponse>(
          NAV_PRODUCTS_QUERY,
          { cursor },
          navFetch,
        );
      nodes.push(...data.products.nodes);
      cursor = data.products.pageInfo.hasNextPage
        ? data.products.pageInfo.endCursor
        : null;
    } while (cursor);

    const listed = nodes
      .filter((node) => node.availableForSale)
      .map((node) => ({
        gender: resolveGender(node),
        department: resolveDepartment(node),
        subcategory: resolveSubcategory(node),
        brand: node.vendor.trim(),
        image: node.images.nodes[0]?.url,
      }));

    return {
      brands: buildBrands(listed),
      genderNav: buildGenderNav(listed),
      handles: nodes.map((node) => node.handle).filter(Boolean),
    };
  } catch (error) {
    console.error("Shopify navigation unavailable", error);
    return emptyNav();
  }
});

export async function getGenderNavigation(): Promise<GenderNav[]> {
  return (await loadNav()).genderNav;
}

export async function getBrands() {
  return (await loadNav()).brands;
}

export async function getBrandBySlug(slug: string) {
  return (await loadNav()).brands.find((brand) => brand.slug === slug);
}

/** Published handles for the sitemap — not full product payloads. */
export async function getProductHandles() {
  return (await loadNav()).handles;
}

export async function getProductsByBrand(name: string) {
  if (!isShopifyReady() || !name) return [];

  try {
    return mapAvailableNodes(await fetchProductsByQuery(vendorTerm(name)));
  } catch (error) {
    console.error("Shopify brand products unavailable", name, error);
    return [];
  }
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const sameSub = (
    await fetchScopedGenderProducts({
      gender: product.gender,
      categoryName: product.subcategory,
      categorySlug: brandToSlug(product.subcategory),
      maxPages: 1,
    })
  ).filter((item) => item.id !== product.id);

  const related = preferAvailable(sameSub).slice(0, limit);
  if (related.length >= limit) return related;

  const nav = await getGenderNavigation();
  const categoryNames = nav
    .find((entry) => entry.gender === product.gender)
    ?.departments.find((entry) => entry.slug === product.department)
    ?.categories.map((entry) => entry.name);

  const sameDept = (
    await fetchScopedGenderProducts({
      gender: product.gender,
      categoryNames,
      maxPages: 1,
    })
  ).filter(
    (item) =>
      item.id !== product.id && !related.some((existing) => existing.id === item.id),
  );

  return [...related, ...preferAvailable(sameDept)].slice(0, limit);
}

/** Ranked by Shopify. An empty query returns nothing, not the whole store. */
export async function searchProducts(query: string) {
  const q = sanitizeSearch(query);
  if (!q || !isShopifyReady()) return [];

  try {
    return mapAvailableNodes(await fetchProductsByQuery(q, { maxPages: 1 }));
  } catch (error) {
    console.error("Shopify search unavailable", error);
    return [];
  }
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
  const nav = await getGenderNavigation();
  const previews: CollectionPreview[] = [];
  const used = new Set<string>();

  for (const slug of slugs) {
    const collection = getCollection(slug);
    if (!collection) continue;

    if (slug === "women" || slug === "men") {
      const item = nav.find((entry) => entry.gender === slug);
      const count =
        item?.departments.reduce((total, department) => total + department.count, 0) ??
        0;
      const image = item?.departments
        .map((department) => department.image)
        .find((candidate): candidate is string =>
          Boolean(candidate && !used.has(candidate)),
        );
      if (image) used.add(image);
      previews.push({
        slug,
        title: collection.title,
        description: collection.description,
        count,
        image,
      });
      continue;
    }

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
