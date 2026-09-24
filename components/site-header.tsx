"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BagIcon, CloseIcon, HomeIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { Marquee } from "@/components/marquee";
import { useStore } from "@/components/store-provider";
import { NavbarBackButton } from "@/components/smart-back";
import type { Brand, GenderNav } from "@/lib/catalog";

const leftPlain = [{ href: "/collections/new-arrivals", label: "New Arrivals" }];

const rightNav = [
  { href: "/brands", label: "Brands" },
  { href: "/collections/best-sellers", label: "Best Sellers" },
  { href: "/collections/sale", label: "Sale" },
];

const messages = [
  "Complimentary European shipping on orders over €150",
  "New designer arrivals, authenticated and ready to ship",
  "Easy returns within 30 days",
];

function categoryColumns(count: number) {
  if (count > 14) return "columns-2 gap-x-6 xl:columns-3 xl:gap-x-8";
  if (count > 7) return "columns-2 gap-x-6";
  return "";
}

function GenderColumns({
  item,
  onNavigate,
}: {
  item: GenderNav;
  onNavigate?: () => void;
}) {
  return (
    <>
      {item.departments.map((department) => (
        <div key={department.slug}>
          <Link
            href={`${item.href}?department=${department.slug}`}
            onClick={onNavigate}
            className="font-serif text-xl tracking-wide text-ink transition-colors hover:text-gold"
          >
            {department.name}
          </Link>
          <ul className={`mt-3 ${categoryColumns(department.categories.length)}`}>
            {department.categories.map((category) => (
              <li key={category.slug} className="break-inside-avoid">
                <Link
                  href={`${item.href}?category=${category.slug}`}
                  onClick={onNavigate}
                  className="block py-0.5 text-[13px] text-muted transition-colors hover:text-gold"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`${item.href}?department=${department.slug}`}
            onClick={onNavigate}
            className="mt-3 inline-block text-[11px] uppercase tracking-[0.18em] text-gold"
          >
            View all
          </Link>
        </div>
      ))}
    </>
  );
}

function useDismissibleMenu() {
  const [open, setOpen] = useState(false);
  const blockHover = useRef(false);

  const closeFromNav = () => {
    setOpen(false);
    blockHover.current = true;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return {
    open,
    closeFromNav,
    onMouseEnter: () => {
      if (!blockHover.current) setOpen(true);
    },
    onMouseLeave: () => {
      setOpen(false);
      blockHover.current = false;
    },
  };
}

function GenderNavItem({ item }: { item: GenderNav }) {
  const menu = useDismissibleMenu();
  const feature = item.departments.find((department) => department.image);

  return (
    <div
      className="group"
      onMouseEnter={menu.onMouseEnter}
      onMouseLeave={menu.onMouseLeave}
    >
      <Link
        href={item.href}
        onClick={menu.closeFromNav}
        className={`inline-flex h-16 items-center text-ink/80 transition-colors hover:text-gold ${
          menu.open
            ? "text-gold underline decoration-gold/50 underline-offset-[14px]"
            : ""
        }`}
      >
        {item.label}
      </Link>
      {item.departments.length > 0 ? (
        <div
          className={`absolute inset-x-0 top-full z-50 origin-top transition duration-200 ease-out ${
            menu.open
              ? "pointer-events-auto visible opacity-100"
              : "pointer-events-none invisible opacity-0"
          }`}
        >
          <div className="border-t border-line bg-ivory shadow-[0_24px_48px_rgba(17,17,17,0.08)]">
            <div className="mx-auto max-w-7xl px-8 py-7">
              <div className="grid grid-cols-3 items-start gap-x-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_12rem] xl:gap-x-10">
                <GenderColumns item={item} onNavigate={menu.closeFromNav} />
                {feature?.image ? (
                  <Link
                    href={`${item.href}?all=1`}
                    onClick={menu.closeFromNav}
                    className="group/feature relative hidden aspect-[3/4] max-h-56 overflow-hidden bg-cream xl:block"
                  >
                    <Image
                      src={feature.image}
                      alt={`${item.label} edit`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/feature:scale-105"
                      sizes="12rem"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-4 text-[11px] uppercase tracking-[0.2em] text-white">
                      Shop all {item.label.toLowerCase()}
                    </span>
                  </Link>
                ) : null}
              </div>
              <Link
                href={`${item.href}?all=1`}
                onClick={menu.closeFromNav}
                className="mt-8 inline-block text-[11px] uppercase tracking-[0.2em] text-gold xl:hidden"
              >
                Shop all {item.label.toLowerCase()}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BrandsNav({ href, brands }: { href: string; brands: Brand[] }) {
  const menu = useDismissibleMenu();

  return (
    <div
      className="relative"
      onMouseEnter={menu.onMouseEnter}
      onMouseLeave={menu.onMouseLeave}
    >
      <Link
        href={href}
        onClick={menu.closeFromNav}
        className={`inline-flex h-16 items-center text-ink/80 transition-colors hover:text-gold ${
          menu.open ? "text-gold" : ""
        }`}
      >
        Brands
      </Link>
      <div
        className={`absolute left-0 top-full z-50 flex max-h-[70vh] min-w-52 flex-col border border-line bg-ivory shadow-sm transition ${
          menu.open
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      >
        <div className="overflow-y-auto py-3">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              onClick={menu.closeFromNav}
              className="block whitespace-nowrap px-5 py-2 text-[11px] tracking-[0.18em] text-ink/80 hover:text-gold"
            >
              {brand.name}
            </Link>
          ))}
        </div>
        <Link
          href="/brands"
          onClick={menu.closeFromNav}
          className="border-t border-line bg-ivory px-5 py-3 text-[11px] tracking-[0.18em] text-gold"
        >
          Shop all brands
        </Link>
      </div>
    </div>
  );
}

export function SiteHeader({
  brands,
  genderNav,
}: {
  brands: Brand[];
  genderNav: GenderNav[];
}) {
  const {
    cartCount,
    openCart,
    openSearch,
    isMenuOpen,
    openMenu,
    closeMenu,
  } = useStore();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      <Marquee
        className="bg-ink text-gold"
        trackClassName="items-center py-2 text-[10px] uppercase tracking-[0.22em] sm:py-2.5 sm:text-[11px] sm:tracking-[0.28em]"
      >
        {messages.map((message) => (
          <span key={message} className="px-5 sm:px-8">
            {message}
          </span>
        ))}
      </Marquee>

      <div className="relative border-b border-line bg-ivory/95 backdrop-blur-md">
        <div className="mx-auto grid h-14 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-3 sm:h-16 sm:px-5 lg:px-8">
          <div className="flex min-w-0 items-center">
            <NavbarBackButton />
            {pathname !== "/" ? (
              <Link
                href="/"
                className="flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-gold"
                aria-label="Home"
              >
                <HomeIcon />
              </Link>
            ) : null}
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center lg:hidden"
              onClick={openMenu}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
            <nav className="hidden items-center gap-4 whitespace-nowrap text-[11px] uppercase tracking-[0.18em] xl:gap-6 xl:tracking-[0.22em] lg:flex">
              {leftPlain.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-ink/80 transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
              {genderNav.map((item) => (
                <GenderNavItem key={item.href} item={item} />
              ))}
            </nav>
          </div>

          <Link href="/">
            <span className="sr-only">Skyvano</span>
            <Image
              src="/logo-mark.jpg"
              alt="Skyvano"
              width={48}
              height={48}
              className="h-9 w-9 rounded-sm object-cover sm:h-11 sm:w-11"
              priority
            />
          </Link>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <nav className="mr-1 hidden min-w-0 items-center justify-end gap-4 overflow-hidden whitespace-nowrap text-[11px] uppercase tracking-[0.16em] xl:mr-2 xl:flex xl:gap-6 xl:tracking-[0.22em]">
              {rightNav.map((item) =>
                item.label === "Brands" ? (
                  <BrandsNav key={item.href} href={item.href} brands={brands} />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`transition-colors hover:text-gold ${
                      item.label === "Best Sellers" ? "hidden 2xl:inline" : ""
                    } ${
                      item.label === "Sale" ? "text-gold" : "text-ink/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
            <div className="flex shrink-0 items-center gap-0.5 xl:border-l xl:border-line xl:pl-3">
              <button
                type="button"
                className="flex h-11 w-11 shrink-0 items-center justify-center"
                onClick={openSearch}
                aria-label="Search"
              >
                <SearchIcon />
              </button>
              <button
                type="button"
                onClick={openCart}
                aria-label={cartCount > 0 ? `Bag, ${cartCount} items` : "Bag"}
                className="relative flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap px-1.5 text-ink/80 transition-colors hover:text-gold"
              >
                <BagIcon />
                <span className="hidden text-[11px] uppercase tracking-[0.18em] lg:inline">
                  Bag{cartCount > 0 ? ` (${cartCount})` : ""}
                </span>
                {cartCount > 0 ? (
                  <span className="absolute -right-0.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] text-ink lg:hidden">
                    {cartCount}
                  </span>
                ) : null}
              </button>
            </div>
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
            <Link
              href="/collections/new-arrivals"
              onClick={closeMenu}
              className="py-2 font-serif text-3xl tracking-wide sm:text-4xl"
            >
              New Arrivals
            </Link>
            {genderNav.map((item) => (
              <details key={item.href} className="group">
                <summary className="flex cursor-pointer list-none items-baseline justify-between py-2 font-serif text-3xl tracking-wide sm:text-4xl [&::-webkit-details-marker]:hidden">
                  {item.label}
                  <span className="font-sans text-lg text-gold group-open:hidden">
                    +
                  </span>
                  <span className="hidden font-sans text-lg text-gold group-open:inline">
                    −
                  </span>
                </summary>
                <div className="space-y-8 border-b border-line pb-6">
                  <Link
                    href={`${item.href}?all=1`}
                    onClick={closeMenu}
                    className="inline-block text-[11px] uppercase tracking-[0.18em] text-gold"
                  >
                    Shop all {item.label.toLowerCase()}
                  </Link>
                  <div className="grid gap-8">
                    <GenderColumns item={item} onNavigate={closeMenu} />
                  </div>
                </div>
              </details>
            ))}
            {rightNav.map((item) => (
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
              <button
                type="button"
                className="py-1 text-left"
                onClick={() => {
                  closeMenu();
                  openSearch();
                }}
              >
                Search
              </button>
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
