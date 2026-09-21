"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SearchHit } from "@/app/api/search/route";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";

export function SearchModal() {
  const { isSearchOpen, closeSearch } = useStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = (await response.json()) as { results: SearchHit[] };
        setResults(data.results);
      } catch {
        // Aborted or offline — keep whatever is on screen.
      }
    }, 200);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query]);

  if (!isSearchOpen) return null;

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
            onClick={closeSearch}
            aria-label="Close search"
          >
            <CloseIcon />
          </button>
        </div>
        <form
          className="flex items-center border-b border-ink pb-3"
          onSubmit={(event) => {
            event.preventDefault();
            closeSearch();
            router.push(`/search?q=${encodeURIComponent(query)}`);
          }}
        >
          <SearchIcon className="mr-3 h-6 w-6 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search designer pieces"
            className="min-w-0 w-full bg-transparent font-serif text-xl outline-none placeholder:text-ink/30 sm:text-3xl"
          />
        </form>

        <div className="mt-6 flex-1 overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="grid gap-3">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={closeSearch}
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
        </div>
      </div>
    </div>
  );
}
