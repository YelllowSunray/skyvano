import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Skyvano",
    short_name: "Skyvano",
    description:
      "A curated luxury boutique for designer clothing and accessories.",
    start_url: "/",
    display: "standalone",
    background_color: "#111111",
    theme_color: "#c6a15b",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
