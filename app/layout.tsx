import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Suspense } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { ClientCleanup } from "@/components/client-cleanup";
import { RoutePending } from "@/components/route-pending";
import { SearchModal } from "@/components/search-modal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreProvider } from "@/components/store-provider";
import { Toast } from "@/components/toast";
import { getBrands, getGenderNavigation } from "@/lib/catalog";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// Keep in sync with NAV_REVALIDATE_SECONDS; Next requires a literal here.
export const revalidate = 900;

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Skyvano",
  },
  description: DEFAULT_DESCRIPTION,
  // Canonicals are set per page. A root `/` here would tell Google every
  // route is a duplicate of the homepage.
  openGraph: {
    type: "website",
    locale: "en_NL",
    siteName: SITE_NAME,
    images: [{ url: "/logo.png", alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  appleWebApp: {
    capable: false,
    title: SITE_NAME,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [brands, genderNav] = await Promise.all([
    getBrands(),
    getGenderNavigation(),
  ]);
  // The empty search panel offers the best-stocked houses as a starting point.
  const searchBrands = [...brands]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 8);

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col overflow-x-clip bg-cream font-sans text-ink">
        <StoreProvider>
          <ClientCleanup />
          <SiteHeader brands={brands} genderNav={genderNav} />
          <Suspense fallback={null}>
            <RoutePending genderNav={genderNav} />
          </Suspense>
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <SearchModal brands={searchBrands} />
          <Toast />
        </StoreProvider>
        <Analytics />
      </body>
    </html>
  );
}
