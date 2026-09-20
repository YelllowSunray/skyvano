"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const [color, setColor] = useState(product.colors[0].name);
  const [open, setOpen] = useState(false);

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-white">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 block">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.images[1] ? (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          ) : null}
        </Link>
        {product.tags.includes("sale") ? (
          <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
            Sale
          </span>
        ) : product.tags.includes("new") ? (
          <span className="absolute left-3 top-3 bg-gold px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-ink">
            New
          </span>
        ) : null}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          {open ? (
            <div className="bg-ivory/95 p-3">
              <p className="mb-2 text-[10px] uppercase tracking-[0.18em]">
                Select size
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className="border border-ink px-2 py-1 text-[11px] uppercase tracking-[0.12em] hover:bg-ink hover:text-white"
                    onClick={() => {
                      addToCart({ product, color, size });
                      setOpen(false);
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="w-full bg-ink py-3 text-[11px] uppercase tracking-[0.22em] text-white"
              onClick={() => setOpen(true)}
            >
              Quick add
            </button>
          )}
        </div>
      </div>
      <div className="pt-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
          {product.brand}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-1 block font-serif text-xl leading-tight"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-sm">
          {product.compareAtPrice ? (
            <>
              <span className="mr-2 text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
              <span>{formatPrice(product.price)}</span>
            </>
          ) : (
            formatPrice(product.price)
          )}
        </p>
        <div className="mt-3 flex gap-2">
          {product.colors.map((option) => (
            <button
              key={option.name}
              type="button"
              aria-label={option.name}
              onClick={() => setColor(option.name)}
              className={`h-3.5 w-3.5 rounded-full border ${
                color === option.name ? "border-ink" : "border-transparent"
              }`}
              style={{ backgroundColor: option.hex }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
