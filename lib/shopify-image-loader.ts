/** Vercel bills Image Optimization. Shopify already resizes on their CDN. */
export default function shopifyImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.startsWith("/") || src.startsWith("data:")) return src;

  try {
    const url = new URL(src);
    if (url.hostname === "cdn.shopify.com") {
      url.searchParams.set("width", String(width));
      url.searchParams.set("quality", String(quality ?? 75));
      return url.toString();
    }
  } catch {
    return src;
  }

  return src;
}
