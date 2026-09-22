import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const DEFAULT_TITLE = "Skyvano | Elevated style. Everyday luxury.";
export const DEFAULT_DESCRIPTION =
  "Skyvano is a curated luxury boutique for designer clothing and accessories for women and men.";

export function absoluteUrl(path: string) {
  if (path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  index = true,
  images,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  images?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const ogTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_NL",
      title: ogTitle,
      description,
      url,
      ...(images?.length ? { images: images.map((image) => ({ url: image })) } : {}),
    },
  };
}
