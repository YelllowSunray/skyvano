import type { MetadataRoute } from "next";
import { getBrands, getProductHandles } from "@/lib/catalog";
import { collections } from "@/lib/products";
import { absoluteUrl } from "@/lib/seo";

const STATIC_PATHS = [
  "/",
  "/brands",
  "/about",
  "/contact",
  "/faq",
  "/shipping",
  "/returns",
  "/privacy",
  "/terms",
];

const HANDLE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

function entry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified?: Date,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    changeFrequency,
    priority,
    ...(lastModified ? { lastModified } : {}),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = [
    ...STATIC_PATHS.map((path) =>
      entry(path, "weekly", path === "/" ? 1 : 0.5),
    ),
    ...collections.map((collection) =>
      entry(`/collections/${collection.slug}`, "daily", 0.8),
    ),
  ];

  try {
    const [handles, brands] = await Promise.all([
      getProductHandles(),
      getBrands(),
    ]);
    const now = new Date();

    return [
      ...staticEntries,
      ...brands
        .filter((brand) => HANDLE.test(brand.slug))
        .map((brand) => entry(`/brands/${brand.slug}`, "weekly", 0.6, now)),
      ...handles
        .filter((handle) => HANDLE.test(handle))
        .map((handle) => entry(`/products/${handle}`, "daily", 0.7, now)),
    ];
  } catch {
    // An empty/failed catalogue must not 500 — crawlers would drop the site.
    return staticEntries;
  }
}
