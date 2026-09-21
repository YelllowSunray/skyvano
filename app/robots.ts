import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The bag and account are per-shopper, and filtered or searched URLs are
      // endless combinations of the same products.
      disallow: ["/cart", "/account", "/search", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
