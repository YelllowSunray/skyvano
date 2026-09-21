import { BestSellers } from "@/components/best-sellers";
import { BrandStory } from "@/components/brand-story";
import { FeaturedCollections } from "@/components/featured-collections";
import { Hero } from "@/components/hero";
import { HouseMarquee } from "@/components/house-marquee";
import { NewArrivals } from "@/components/new-arrivals";
import { NewsletterSection } from "@/components/newsletter-section";
import { ShopByBrand } from "@/components/shop-by-brand";
import { WhyShop } from "@/components/why-shop";
import { getBestSellers } from "@/lib/catalog";

export default async function Home() {
  const bestSellers = await getBestSellers(12);

  return (
    <>
      <Hero />
      <HouseMarquee />
      <FeaturedCollections />
      <ShopByBrand />
      <NewArrivals />
      <BestSellers products={bestSellers} />
      <BrandStory />
      <WhyShop />
      <NewsletterSection />
    </>
  );
}
