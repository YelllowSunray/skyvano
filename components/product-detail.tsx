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

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:px-8 lg:gap-16">
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
        <div className="mt-3 grid grid-cols-4 gap-3">
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

      <div className="pt-2">
        <p className="text-[11px] uppercase tracking-[0.24em] text-gold">
          {product.brand}
        </p>
        <h1 className="mt-2 font-serif text-5xl">{product.name}</h1>
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

        <p className="mt-6 max-w-md leading-7 text-muted">{product.description}</p>

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
                className={`h-7 w-7 rounded-full border ${
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
                className={`min-w-12 border px-3 py-2 text-sm ${
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

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            className="flex-1"
            onClick={() => {
              if (!size) {
                setError("Please select a size.");
                return;
              }
              addToCart({ product, color, size });
            }}
          >
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
    </div>
  );
}
