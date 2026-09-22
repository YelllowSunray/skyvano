import type { Metadata } from "next";
import { BestSellers } from "@/components/best-sellers";
import { BrandStory } from "@/components/brand-story";
import { FeaturedCollections } from "@/components/featured-collections";
import { Hero } from "@/components/hero";
import { HouseMarquee } from "@/components/house-marquee";
import { JsonLd } from "@/components/json-ld";
import { NewArrivals } from "@/components/new-arrivals";
import { NewsletterSection } from "@/components/newsletter-section";
import { OnSale } from "@/components/on-sale";
import { ShopByBrand } from "@/components/shop-by-brand";
import { WhyShop } from "@/components/why-shop";
import { getBestSellers, getNewArrivals, getOnSale } from "@/lib/catalog";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  absoluteUrl,
  pageMetadata,
} from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: "/",
  }),
  title: { absolute: DEFAULT_TITLE },
};

export default async function Home() {
  const newArrivals = await getNewArrivals(8);
  const taken = newArrivals.map((product) => product.id);
  const bestSellers = await getBestSellers(12, {
    inStockOnly: true,
    excludeIds: taken,
  });
  const onSale = await getOnSale(8, {
    excludeIds: [...taken, ...bestSellers.map((product) => product.id)],
  });

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: absoluteUrl("/"),
            logo: absoluteUrl("/logo.png"),
            email: "hello@skyvano.com",
            telephone: "+31 20 244 1800",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Herengracht 120",
              addressLocality: "Amsterdam",
              postalCode: "1015 BT",
              addressCountry: "NL",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: absoluteUrl("/"),
            potentialAction: {
              "@type": "SearchAction",
              target: `${absoluteUrl("/search")}?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ]}
      />
      <Hero />
      <HouseMarquee />
      <FeaturedCollections />
      <ShopByBrand />
      <NewArrivals products={newArrivals} />
      <BestSellers products={bestSellers} />
      <OnSale products={onSale} />
      <BrandStory />
      <WhyShop />
      <NewsletterSection />
    </>
  );
}
