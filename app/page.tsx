import { BestSellers } from "@/components/best-sellers";
import { BrandStory } from "@/components/brand-story";
import { FeaturedCollections } from "@/components/featured-collections";
import { Hero } from "@/components/hero";
import { HouseMarquee } from "@/components/house-marquee";
import { InstagramSection } from "@/components/instagram-section";
import { NewArrivals } from "@/components/new-arrivals";
import { NewsletterSection } from "@/components/newsletter-section";
import { ShopByBrand } from "@/components/shop-by-brand";
import { WhyShop } from "@/components/why-shop";

export default function Home() {
  return (
    <>
      <Hero />
      <HouseMarquee />
      <FeaturedCollections />
      <ShopByBrand />
      <NewArrivals />
      <BestSellers />
      <BrandStory />
      <WhyShop />
      <InstagramSection />
      <NewsletterSection />
    </>
  );
}
