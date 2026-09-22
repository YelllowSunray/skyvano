// Shapes shared by server and client components. All catalog data comes from
// Shopify via lib/catalog.ts — nothing here holds product data.

export type Gender = "women" | "men";
export type Department = "clothing" | "shoes" | "accessories";
export type ProductTag = "new" | "bestseller" | "sale";

export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductVariant = {
  id: string;
  color: string;
  size: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  /** Units on the variant. Missing when Shopify withholds inventory. */
  quantity?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  gender: Gender;
  department: Department;
  subcategory: string;
  season?: string;
  tags: ProductTag[];
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  variants: ProductVariant[];
  description: string;
  details: string[];
  available: boolean;
};

export type CollectionSlug =
  | "new-arrivals"
  | "women"
  | "men"
  | "accessories"
  | "best-sellers"
  | "sale";

export type Collection = {
  slug: CollectionSlug;
  title: string;
  description: string;
};

export const collections: Collection[] = [
  {
    slug: "new-arrivals",
    title: "New Arrivals",
    description: "The latest pieces added to the Skyvano edit.",
  },
  {
    slug: "women",
    title: "Women",
    description: "Womenswear, shoes and accessories.",
  },
  {
    slug: "men",
    title: "Men",
    description: "Menswear, shoes and accessories.",
  },
  {
    slug: "accessories",
    title: "Accessories",
    description: "Bags, belts, eyewear and small leather goods.",
  },
  {
    slug: "best-sellers",
    title: "Best Sellers",
    description: "The most requested pieces in the edit.",
  },
  {
    slug: "sale",
    title: "Sale",
    description: "Selected pieces, now reduced.",
  },
];

export function isCollectionSlug(value: string): value is CollectionSlug {
  return collections.some((collection) => collection.slug === value);
}

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function brandToSlug(brand: string) {
  return brand
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
