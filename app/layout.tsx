import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { CartDrawer } from "@/components/cart-drawer";
import { ClientCleanup } from "@/components/client-cleanup";
import { SearchModal } from "@/components/search-modal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreProvider } from "@/components/store-provider";
import { Toast } from "@/components/toast";
import "./globals.css";

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
  metadataBase: new URL("https://skyvano.com"),
  title: {
    default: "Skyvano | Elevated style. Everyday luxury.",
    template: "%s | Skyvano",
  },
  description:
    "Skyvano is a curated luxury boutique for designer clothing and accessories for women and men.",
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: false,
    title: "Skyvano",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col overflow-x-clip bg-cream font-sans text-ink">
        <StoreProvider>
          <ClientCleanup />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <SearchModal />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
