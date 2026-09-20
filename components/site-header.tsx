"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BagIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";
import { useStore } from "@/components/store-provider";

const nav = [
  { href: "/collections/new-arrivals", label: "New Arrivals" },
  { href: "/collections/women", label: "Women" },
  { href: "/collections/men", label: "Men" },
  { href: "/collections/accessories", label: "Accessories" },
  { href: "/collections/best-sellers", label: "Best Sellers" },
  { href: "/collections/sale", label: "Sale" },
];

const messages = [
  "Complimentary European shipping on orders over €150",
  "New designer arrivals, authenticated and ready to ship",
  "Easy returns within 30 days",
];

export function SiteHeader() {
  const {
    cartCount,
    openCart,
    openSearch,
    isMenuOpen,
    openMenu,
    closeMenu,
  } = useStore();

  return (
    <header className="sticky top-0 z-50">
      <div className="overflow-hidden bg-ink text-gold">
        <div className="flex w-max marquee-track">
          {[0, 1].map((copy) => (
            <p
              key={copy}
              className="flex items-center py-2 text-[10px] uppercase tracking-[0.22em] sm:py-2.5 sm:text-[11px] sm:tracking-[0.28em]"
            >
              {messages.map((message) => (
                <span key={`${copy}-${message}`} className="px-5 sm:px-8">
                  {message}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>

      <div className="border-b border-line bg-ivory/95 backdrop-blur-md">
        <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-5 lg:grid lg:grid-cols-3 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center lg:hidden"
              onClick={openMenu}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
            <nav className="hidden items-center gap-6 text-[11px] uppercase tracking-[0.22em] lg:flex">
              {nav.slice(0, 3).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-ink/80 transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:justify-self-center lg:translate-x-0"
          >
            <span className="sr-only">Skyvano</span>
            <div className="flex items-center gap-2 sm:gap-3">
              <Image
                src="/logo.png"
                alt="Skyvano"
                width={48}
                height={48}
                className="h-9 w-9 rounded-sm object-cover sm:h-11 sm:w-11"
                priority
              />
              <span className="hidden font-serif text-2xl tracking-[0.28em] text-ink md:block">
                SKYVANO
              </span>
            </div>
          </Link>

          <div className="flex items-center justify-end gap-0.5 sm:gap-2">
            <nav className="mr-2 hidden items-center gap-6 text-[11px] uppercase tracking-[0.22em] lg:flex">
              {nav.slice(3).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors hover:text-gold ${
                    item.label === "Sale" ? "text-gold" : "text-ink/80"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center"
              onClick={openSearch}
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <Link
              href="/account"
              aria-label="Account"
              className="hidden h-11 w-11 items-center justify-center sm:flex"
            >
              <UserIcon />
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label="Open bag"
              className="relative flex h-11 w-11 items-center justify-center"
            >
              <BagIcon />
              {cartCount > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] text-ink">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 flex h-dvh flex-col bg-ivory pt-[env(safe-area-inset-top)] lg:hidden">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="font-serif text-xl tracking-[0.24em] sm:text-2xl">
              SKYVANO
            </span>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`py-2 font-serif text-3xl tracking-wide sm:text-4xl ${
                  item.label === "Sale" ? "text-gold" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-6 grid gap-3 border-t border-line pt-6 text-sm uppercase tracking-[0.2em] text-muted">
              <Link href="/account" onClick={closeMenu} className="py-1">
                Account
              </Link>
              <Link href="/about" onClick={closeMenu} className="py-1">
                About
              </Link>
              <Link href="/contact" onClick={closeMenu} className="py-1">
                Contact
              </Link>
              <Link href="/faq" onClick={closeMenu} className="py-1">
                FAQ
              </Link>
              <Link href="/shipping" onClick={closeMenu} className="py-1">
                Shipping
              </Link>
              <Link href="/returns" onClick={closeMenu} className="py-1">
                Returns
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
