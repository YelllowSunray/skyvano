import type { Product } from "@/lib/products";

/** Sorting and faceting shared by the collection pages and their toolbar. */

export type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "name", label: "Alphabetical" },
];

export function isSortKey(value: string | undefined): value is SortKey {
  return SORT_OPTIONS.some((option) => option.key === value);
}

export type Filters = {
  brands: string[];
  sizes: string[];
  colours: string[];
  inStockOnly: boolean;
};

export const EMPTY_FILTERS: Filters = {
  brands: [],
  sizes: [],
  colours: [],
  inStockOnly: false,
};

/** A facet value plus how many products carry it, as themes show in the sidebar. */
export type Facet = {
  value: string;
  count: number;
};

export function countFilters(filters: Filters) {
  return (
    filters.brands.length +
    filters.sizes.length +
    filters.colours.length +
    (filters.inStockOnly ? 1 : 0)
  );
}

/** Sizes run XS→XXL, not alphabetically, and shoe sizes are numeric. */
const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

function sizeRank(size: string) {
  const index = SIZE_ORDER.indexOf(size.toUpperCase());
  if (index >= 0) return index;
  const numeric = Number.parseFloat(size);
  // Numeric sizes sort after lettered ones, in numeric order.
  return Number.isNaN(numeric) ? 900 : 1000 + numeric;
}

export function buildFacets(products: Product[]) {
  const brands = new Map<string, number>();
  const sizes = new Map<string, number>();
  const colours = new Map<string, number>();

  for (const product of products) {
    brands.set(product.brand, (brands.get(product.brand) ?? 0) + 1);
    for (const size of new Set(product.sizes)) {
      sizes.set(size, (sizes.get(size) ?? 0) + 1);
    }
    for (const colour of new Set(product.colors.map((item) => item.name))) {
      colours.set(colour, (colours.get(colour) ?? 0) + 1);
    }
  }

  const toFacets = (
    source: Map<string, number>,
    compare: (a: Facet, b: Facet) => number,
  ): Facet[] =>
    [...source]
      .map(([value, count]) => ({ value, count }))
      .sort(compare);

  return {
    brands: toFacets(brands, (a, b) =>
      b.count - a.count || a.value.localeCompare(b.value),
    ),
    sizes: toFacets(sizes, (a, b) => sizeRank(a.value) - sizeRank(b.value)),
    colours: toFacets(colours, (a, b) =>
      b.count - a.count || a.value.localeCompare(b.value),
    ),
  };
}

/** In-stock pieces first, original order otherwise — what Dawn does on a grid. */
export function preferAvailable(products: Product[]) {
  return sortProducts(products, "featured");
}

export function filterProducts(products: Product[], filters: Filters) {
  return products.filter((product) => {
    if (filters.inStockOnly && !product.available) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }
    if (filters.sizes.length > 0) {
      const hasSize = filters.inStockOnly
        ? product.variants.some(
            (variant) =>
              variant.available && filters.sizes.includes(variant.size),
          )
        : product.sizes.some((size) => filters.sizes.includes(size));
      if (!hasSize) return false;
    }
    if (
      filters.colours.length > 0 &&
      !product.colors.some((colour) => filters.colours.includes(colour.name))
    ) {
      return false;
    }
    return true;
  });
}

/**
 * Sold-out pieces always sink to the bottom, whatever the sort — a shopper
 * scrolling a collection should meet things they can buy first.
 */
export function sortProducts(products: Product[], sort: SortKey) {
  const compare: Record<SortKey, (a: Product, b: Product) => number> = {
    featured: () => 0,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    name: (a, b) =>
      `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`),
  };

  return products
    .map((product, index) => ({ product, index }))
    .sort(
      (a, b) =>
        Number(b.product.available) - Number(a.product.available) ||
        compare[sort](a.product, b.product) ||
        a.index - b.index,
    )
    .map((entry) => entry.product);
}
