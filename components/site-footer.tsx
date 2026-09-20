import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, PinterestIcon, TikTokIcon } from "@/components/icons";
import { NewsletterForm } from "@/components/newsletter-form";

const shopLinks = [
  ["New Arrivals", "/collections/new-arrivals"],
  ["Women", "/collections/women"],
  ["Men", "/collections/men"],
  ["Brands", "/brands"],
  ["Accessories", "/collections/accessories"],
  ["Best Sellers", "/collections/best-sellers"],
  ["Sale", "/collections/sale"],
];

const helpLinks = [
  ["Contact", "/contact"],
  ["Shipping & Delivery", "/shipping"],
  ["Returns", "/returns"],
  ["FAQ", "/faq"],
];

const aboutLinks = [
  ["About Us", "/about"],
  ["Privacy Policy", "/privacy"],
  ["Terms & Conditions", "/terms"],
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink text-ivory pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:gap-12 sm:py-16 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div>
          <Image
            src="/logo.png"
            alt="Skyvano"
            width={160}
            height={160}
            className="mb-5 h-16 w-16 object-contain sm:h-20 sm:w-20"
          />
          <p className="max-w-xs text-sm leading-6 text-white/70">
            A curated luxury boutique for designer clothing and accessories —
            selected for those who stand out.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-[11px] uppercase tracking-[0.28em] text-gold">
            Shop
          </h3>
          <ul className="space-y-1 text-sm text-white/75">
            {shopLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="inline-block py-1.5 hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[11px] uppercase tracking-[0.28em] text-gold">
            Help
          </h3>
          <ul className="space-y-1 text-sm text-white/75">
            {helpLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="inline-block py-1.5 hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mb-4 mt-8 text-[11px] uppercase tracking-[0.28em] text-gold">
            About
          </h3>
          <ul className="space-y-1 text-sm text-white/75">
            {aboutLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="inline-block py-1.5 hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-3xl text-ivory">
            Join the Skyvano Club
          </h3>
          <p className="mb-5 text-sm leading-6 text-white/70">
            Get first access to new collections and exclusive offers.
          </p>
          <NewsletterForm dark />
          <div className="mt-6 flex items-center gap-2 text-gold">
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href="https://pinterest.com"
              aria-label="Pinterest"
              className="flex h-11 w-11 items-center justify-center"
            >
              <PinterestIcon className="h-5 w-5" />
            </a>
            <a
              href="https://tiktok.com"
              aria-label="TikTok"
              className="flex h-11 w-11 items-center justify-center"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} Skyvano. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {["Visa", "Mastercard", "Amex", "Apple Pay", "iDEAL", "Klarna"].map(
              (method) => (
                <span
                  key={method}
                  className="rounded-sm border border-white/20 px-2 py-1 uppercase tracking-[0.12em]"
                >
                  {method}
                </span>
              ),
            )}
          </div>
        </div>
        <p className="mx-auto max-w-7xl px-4 pb-8 text-[11px] leading-5 text-white/40 md:px-8">
          Skyvano is an independent luxury retailer. Designer names are used to
          identify the origin of the pieces we offer and do not imply
          affiliation with or endorsement by those houses.
        </p>
      </div>
    </footer>
  );
}
