"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";
import { searchProducts } from "@/lib/products";

export function SearchModal() {
  const { isSearchOpen, closeSearch } = useStore();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchProducts(query).slice(0, 6), [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-ivory">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
            Search Skyvano
          </p>
          <button type="button" onClick={closeSearch} aria-label="Close search">
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
          <SearchIcon className="mr-3 h-6 w-6" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search designer pieces"
            className="w-full bg-transparent font-serif text-3xl outline-none placeholder:text-ink/30"
          />
        </form>

        <div className="mt-8 grid gap-4">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              onClick={closeSearch}
              className="flex items-center gap-4 hover:bg-white/60"
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                width={72}
                height={90}
                className="h-[90px] w-[72px] object-cover"
              />
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                  {product.brand}
                </p>
                <p className="font-serif text-2xl">{product.name}</p>
                <p className="text-sm">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
