"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products";

function firstAvailableColor(product: Product) {
  return (
    product.colors.find((colour) =>
      product.variants.some(
        (variant) => variant.color === colour.name && variant.available,
      ),
    )?.name ??
    product.colors[0]?.name ??
    ""
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const [color, setColor] = useState(() => firstAvailableColor(product));
  const [open, setOpen] = useState(false);

  const sizesForColour = [
    ...new Map(
      product.variants
        .filter((variant) => !color || variant.color === color)
        .map((variant) => [variant.size, variant]),
    ).values(),
  ];
  const soldOut = !product.variants.some((variant) => variant.available);

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-white">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 block">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
              soldOut ? "opacity-60" : ""
            }`}
          />
          {product.images[1] ? (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className={`object-cover opacity-0 transition-opacity duration-500 ${
                soldOut ? "group-hover:opacity-60" : "group-hover:opacity-100"
              }`}
            />
          ) : null}
        </Link>
        {soldOut ? (
          <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-ink sm:left-3 sm:top-3">
            Sold out
          </span>
        ) : product.tags.includes("sale") ? (
          <span className="absolute left-2 top-2 bg-ink px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white sm:left-3 sm:top-3">
            Sale
          </span>
        ) : product.tags.includes("new") ? (
          <span className="absolute left-2 top-2 bg-gold px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-ink sm:left-3 sm:top-3">
            New
          </span>
        ) : null}
        <div className="absolute inset-x-2 bottom-2 z-10 sm:inset-x-3 sm:bottom-3 sm:translate-y-3 sm:opacity-0 sm:transition-all sm:duration-300 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          {soldOut ? (
            <p className="w-full bg-ivory/95 py-2 text-center text-[10px] uppercase tracking-[0.16em] text-muted sm:py-3 sm:text-[11px] sm:tracking-[0.22em]">
              Sold out
            </p>
          ) : open ? (
            <div className="max-h-28 overflow-y-auto bg-ivory/95 p-2 sm:max-h-none sm:p-3">
              <p className="mb-2 text-[10px] uppercase tracking-[0.18em]">
                Select size
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {sizesForColour.map((option) => (
                  <button
                    key={option.size}
                    type="button"
                    disabled={!option.available}
                    aria-label={
                      option.available
                        ? option.size
                        : `${option.size} — sold out`
                    }
                    className={`min-h-8 min-w-8 border px-2 py-1 text-[10px] uppercase tracking-[0.12em] sm:min-h-0 sm:text-[11px] ${
                      option.available
                        ? "border-ink hover:bg-ink hover:text-white"
                        : "cursor-not-allowed border-line text-muted/50 line-through"
                    }`}
                    onClick={() => {
                      if (!option.available) return;
                      addToCart({ product, color, size: option.size });
                      setOpen(false);
                    }}
                  >
                    {option.size}
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
          {product.colors.map((option) => {
            const unavailable = !product.variants.some(
              (variant) => variant.color === option.name && variant.available,
            );
            return (
              <button
                key={option.name}
                type="button"
                aria-label={
                  unavailable ? `${option.name} — sold out` : option.name
                }
                onClick={() => setColor(option.name)}
                className={`relative h-5 w-5 overflow-hidden rounded-full border sm:h-3.5 sm:w-3.5 ${
                  color === option.name ? "border-ink" : "border-transparent"
                }`}
                style={{ backgroundColor: option.hex }}
              >
                {unavailable ? (
                  <span className="absolute inset-x-0 top-1/2 border-t border-ink/50" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
