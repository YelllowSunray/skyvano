"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50">
      <div className="overflow-hidden bg-ink text-gold">
        <div className="flex w-max marquee-track">
          {[0, 1].map((copy) => (
            <p
              key={copy}
              className="flex items-center py-2.5 text-[11px] uppercase tracking-[0.28em]"
            >
              {messages.map((message) => (
                <span key={`${copy}-${message}`} className="px-8">
                  {message}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>

      <div className="border-b border-line bg-ivory/90 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden"
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

          <Link href="/" className="justify-self-center">
            <span className="sr-only">Skyvano</span>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Skyvano"
                width={48}
                height={48}
                className="h-11 w-11 rounded-sm object-cover"
                priority
              />
              <span className="hidden font-serif text-2xl tracking-[0.28em] text-ink sm:block">
                SKYVANO
              </span>
            </div>
          </Link>

          <div className="flex items-center justify-end gap-4">
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
            <button type="button" onClick={openSearch} aria-label="Search">
              <SearchIcon />
            </button>
            <Link href="/account" aria-label="Account">
              <UserIcon />
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label="Open bag"
              className="relative"
            >
              <BagIcon />
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] text-ink">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 bg-ivory lg:hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-4">
            <span className="font-serif text-2xl tracking-[0.28em]">SKYVANO</span>
            <button type="button" onClick={closeMenu} aria-label="Close menu">
              <CloseIcon />
            </button>
          </div>
          <nav className="flex flex-col gap-6 px-6 py-10">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="font-serif text-4xl tracking-wide"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/about"
              onClick={closeMenu}
              className="pt-4 text-sm uppercase tracking-[0.2em] text-muted"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              className="text-sm uppercase tracking-[0.2em] text-muted"
            >
              Contact
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
