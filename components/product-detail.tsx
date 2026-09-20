"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/button";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products";

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState(product.sizes[0]);
  const [error, setError] = useState("");

  const savings = useMemo(() => {
    if (!product.compareAtPrice) return null;
    return product.compareAtPrice - product.price;
  }, [product]);

  const add = () => {
    if (!size) {
      setError("Please select a size.");
      return;
    }
    addToCart({ product, color, size });
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:gap-10 sm:py-8 md:grid-cols-2 md:px-8 lg:gap-16">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden bg-white">
          <Image
            src={product.images[activeImage]}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
          {product.images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(index)}
              className={`relative aspect-square overflow-hidden ${
                activeImage === index ? "ring-1 ring-ink" : ""
              }`}
            >
              <Image src={image} alt="" fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      </div>

      <div className="pt-1 pb-24 md:pb-2">
        <p className="text-[11px] uppercase tracking-[0.24em] text-gold">
          {product.brand}
        </p>
        <h1 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 text-lg">
          {product.compareAtPrice ? (
            <>
              <span className="mr-3 text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
              {formatPrice(product.price)}
            </>
          ) : (
            formatPrice(product.price)
          )}
        </p>
        {savings ? (
          <p className="mt-1 text-sm text-muted">
            You save {formatPrice(savings)}
          </p>
        ) : null}

        <p className="mt-5 max-w-md text-sm leading-7 text-muted sm:mt-6 sm:text-base">
          {product.description}
        </p>

        <fieldset className="mt-8">
          <legend className="text-[11px] uppercase tracking-[0.2em]">
            Colour — {color}
          </legend>
          <div className="mt-3 flex gap-3">
            {product.colors.map((option) => (
              <button
                key={option.name}
                type="button"
                aria-label={option.name}
                onClick={() => setColor(option.name)}
                className={`h-9 w-9 rounded-full border sm:h-7 sm:w-7 ${
                  color === option.name ? "border-ink p-0.5" : "border-line"
                }`}
              >
                <span
                  className="block h-full w-full rounded-full"
                  style={{ backgroundColor: option.hex }}
                />
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="text-[11px] uppercase tracking-[0.2em]">Size</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSize(option);
                  setError("");
                }}
                className={`min-h-11 min-w-11 border px-3 py-2 text-sm ${
                  size === option
                    ? "border-ink bg-ink text-white"
                    : "border-line hover:border-ink"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

        <div className="mt-8 hidden flex-col gap-3 sm:flex-row md:flex">
          <Button className="flex-1" onClick={add}>
            Add to bag
          </Button>
          <Button href="/shipping" variant="outline" className="flex-1">
            Shipping & returns
          </Button>
        </div>

        <ul className="mt-10 space-y-2 border-t border-line pt-8 text-sm text-muted">
          {product.details.map((detail) => (
            <li key={detail}>— {detail}</li>
          ))}
        </ul>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-4 py-3 backdrop-blur md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{formatPrice(product.price)}</p>
            <p className="truncate text-[11px] text-muted">
              {color} / {size}
            </p>
          </div>
          <Button className="shrink-0" onClick={add}>
            Add to bag
          </Button>
        </div>
      </div>
    </div>
  );
}
