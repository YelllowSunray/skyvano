"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SearchResponse } from "@/app/api/search/route";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";
import type { Brand } from "@/lib/catalog";

const CATEGORY_LINKS = [
  { href: "/collections/new-arrivals", label: "New Arrivals" },
  { href: "/collections/women", label: "Women" },
  { href: "/collections/men", label: "Men" },
  { href: "/collections/accessories", label: "Accessories" },
  { href: "/collections/sale", label: "Sale" },
];

export function SearchModal({ brands = [] }: { brands?: Brand[] }) {
  const { isSearchOpen, closeSearch } = useStore();

  // Mounting the panel only while open keeps each search session clean without
  // having to reset state by hand.
  if (!isSearchOpen) return null;
  return <SearchPanel brands={brands} onClose={closeSearch} />;
}

/** Results are tagged with the term that produced them, so a stale response
 * from a slower request is never shown against a newer query. */
type Answer = SearchResponse & { term: string };

function SearchPanel({
  brands,
  onClose,
}: {
  brands: Brand[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);

  const term = query.trim();

  useEffect(() => {
    if (!term) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const request = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        if (!request.ok) return;
        const data = (await request.json()) as SearchResponse;
        setAnswer({ ...data, term });
      } catch {
        // Aborted by the next keystroke, or offline. Keep what is on screen.
      }
    }, 200);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [term]);

  const current = answer?.term === term ? answer : null;
  const loading = term.length > 0 && current === null;
  const results = current?.results ?? [];
  const remaining = (current?.total ?? 0) - results.length;

  const submit = () => {
    if (!term) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex h-dvh flex-col bg-ivory pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-5 md:px-8 md:py-8">
        <div className="mb-5 flex items-center justify-between sm:mb-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
            Search Skyvano
          </p>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center"
            onClick={onClose}
            aria-label="Close search"
          >
            <CloseIcon />
          </button>
        </div>
        <form
          className="flex items-center border-b border-ink pb-3"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <SearchIcon className="mr-3 h-6 w-6 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Brand, piece or colour"
            aria-label="Search products"
            className="min-w-0 w-full bg-transparent font-serif text-xl outline-none placeholder:text-ink/30 sm:text-3xl"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="ml-2 shrink-0 text-[11px] uppercase tracking-[0.16em] text-muted underline"
            >
              Clear
            </button>
          ) : null}
        </form>

        <div
          aria-live="polite"
          className="mt-6 flex-1 overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        >
          {!term ? (
            <div className="space-y-8">
              <div>
                <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-muted">
                  Browse
                </p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className="border border-line px-3 py-2 text-[11px] uppercase tracking-[0.16em] hover:border-ink"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              {brands.length > 0 ? (
                <div>
                  <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-muted">
                    Houses
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {brands.map((brand) => (
                      <Link
                        key={brand.slug}
                        href={`/brands/${brand.slug}`}
                        onClick={onClose}
                        className="font-serif text-xl hover:text-gold sm:text-2xl"
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : loading ? (
            <p className="text-sm text-muted">Searching…</p>
          ) : results.length === 0 ? (
            <div>
              <p className="font-serif text-2xl">Nothing matches “{term}”.</p>
              <p className="mt-2 text-sm text-muted">
                Try a brand, a colour, or a piece — “Barbour”, “black”, “boots”.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 py-1 hover:bg-white/60 sm:gap-4"
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={72}
                        height={90}
                        className="h-[72px] w-[58px] shrink-0 object-cover sm:h-[90px] sm:w-[72px]"
                      />
                    ) : null}
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                        {product.brand}
                      </p>
                      <p className="font-serif text-xl leading-tight sm:text-2xl">
                        {product.name}
                      </p>
                      <p className="text-sm">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <button
                type="button"
                onClick={submit}
                className="mt-6 text-[11px] uppercase tracking-[0.18em] underline decoration-gold underline-offset-8"
              >
                {remaining > 0
                  ? `View all ${current?.total} results`
                  : "View as a grid"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
