import type { MetadataRoute } from "next";
import { getAllProducts, getBrands } from "@/lib/catalog";
import { collections } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

const STATIC_PATHS = [
  "/",
  "/brands",
  "/collections",
  "/about",
  "/contact",
  "/faq",
  "/shipping",
  "/returns",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, brands] = await Promise.all([getAllProducts(), getBrands()]);

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.5,
    })),
    ...collections.map((collection) => ({
      url: `${SITE_URL}/collections/${collection.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...brands.map((brand) => ({
      url: `${SITE_URL}/brands/${brand.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...products.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
