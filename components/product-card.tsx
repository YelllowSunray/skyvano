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
    <article className="group min-w-0">
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
          <span className="absolute left-2 top-2 bg-ink px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white sm:left-3 sm:top-3">
            Sale
          </span>
        ) : product.tags.includes("new") ? (
          <span className="absolute left-2 top-2 bg-gold px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-ink sm:left-3 sm:top-3">
            New
          </span>
        ) : null}
        <div className="absolute inset-x-2 bottom-2 z-10 sm:inset-x-3 sm:bottom-3 sm:translate-y-3 sm:opacity-0 sm:transition-all sm:duration-300 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          {open ? (
            <div className="max-h-28 overflow-y-auto bg-ivory/95 p-2 sm:max-h-none sm:p-3">
              <p className="mb-2 text-[10px] uppercase tracking-[0.18em]">
                Select size
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className="min-h-8 min-w-8 border border-ink px-2 py-1 text-[10px] uppercase tracking-[0.12em] hover:bg-ink hover:text-white sm:min-h-0 sm:text-[11px]"
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
              className="w-full bg-ink py-2 text-[10px] uppercase tracking-[0.16em] text-white sm:py-3 sm:text-[11px] sm:tracking-[0.22em]"
              onClick={() => setOpen(true)}
            >
              Quick add
            </button>
          )}
        </div>
      </div>
      <div className="pt-3 sm:pt-4">
        <p className="truncate text-[10px] uppercase tracking-[0.16em] text-muted sm:text-[11px] sm:tracking-[0.2em]">
          {product.brand}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-1 block font-serif text-[17px] leading-snug sm:text-xl"
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
        <div className="mt-2 flex flex-wrap gap-2 sm:mt-3">
          {product.colors.map((option) => (
            <button
              key={option.name}
              type="button"
              aria-label={option.name}
              onClick={() => setColor(option.name)}
              className={`h-5 w-5 rounded-full border sm:h-3.5 sm:w-3.5 ${
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
