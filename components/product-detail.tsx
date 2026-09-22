"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/button";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";
import type { Product, ProductVariant } from "@/lib/products";

/** Preselects the size only when there is exactly one a shopper could buy. */
function onlyAvailableSize(variants: ProductVariant[]) {
  const sizes = [
    ...new Set(
      variants.filter((variant) => variant.available).map((variant) => variant.size),
    ),
  ];
  return sizes.length === 1 ? sizes[0] : "";
}

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(
    product.colors.find((colour) =>
      product.variants.some(
        (variant) => variant.color === colour.name && variant.available,
      ),
    )?.name ??
      product.colors[0]?.name ??
      "",
  );
  const [size, setSize] = useState(onlyAvailableSize(product.variants));
  const [error, setError] = useState("");

  const productSoldOut = !product.variants.some((variant) => variant.available);

  // Sizes belong to a colour, so the option list follows the current swatch.
  const sizeOptions = useMemo(() => {
    const matches = product.variants.filter(
      (variant) => !color || variant.color === color,
    );
    const source = matches.length > 0 ? matches : product.variants;
    return [...new Map(source.map((variant) => [variant.size, variant])).values()];
  }, [color, product.variants]);

  const selected = useMemo(
    () =>
      product.variants.find(
        (variant) =>
          variant.size === size && (!color || variant.color === color),
      ),
    [color, product.variants, size],
  );

  const price = selected?.price ?? product.price;
  const compareAtPrice = selected?.compareAtPrice ?? product.compareAtPrice;
  const savings = compareAtPrice ? compareAtPrice - price : null;

  const selectColor = (next: string) => {
    setColor(next);
    setError("");
    const forColour = product.variants.filter(
      (variant) => variant.color === next,
    );
    const only = onlyAvailableSize(forColour);
    if (only) setSize(only);
    else if (!forColour.some((variant) => variant.size === size)) setSize("");
  };

  const selectedSoldOut = Boolean(size && selected && !selected.available);
  const blocked = productSoldOut || selectedSoldOut;

  const stockLabel = productSoldOut
    ? "Sold out"
    : !size
      ? "Select a size"
      : selectedSoldOut
        ? "Sold out"
        : "In stock — ships within 48 hours";

  const add = () => {
    if (productSoldOut) return;
    if (!size) {
      setError("Please select a size.");
      return;
    }
    if (!selected?.available) {
      setError("That size is sold out.");
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
            className={`object-cover ${productSoldOut ? "opacity-60" : ""}`}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          {productSoldOut ? (
            <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.18em]">
              Sold out
            </span>
          ) : product.tags.includes("sale") ? (
            <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
              Sale
            </span>
          ) : product.tags.includes("new") ? (
            <span className="absolute left-3 top-3 bg-gold px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-ink">
              New
            </span>
          ) : null}
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
          {compareAtPrice ? (
            <>
              <span className="mr-3 text-muted line-through">
                {formatPrice(compareAtPrice)}
              </span>
              {formatPrice(price)}
            </>
          ) : (
            formatPrice(price)
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

        {product.colors.length > 0 ? (
          <fieldset className="mt-8">
            <legend className="text-[11px] uppercase tracking-[0.2em]">
              Colour — {color}
            </legend>
            <div className="mt-3 flex gap-3">
              {product.colors.map((option) => {
                const unavailable = !product.variants.some(
                  (variant) =>
                    variant.color === option.name && variant.available,
                );
                return (
                  <button
                    key={option.name}
                    type="button"
                    aria-label={
                      unavailable ? `${option.name} — sold out` : option.name
                    }
                    onClick={() => selectColor(option.name)}
                    className={`relative h-9 w-9 overflow-hidden rounded-full border sm:h-7 sm:w-7 ${
                      color === option.name ? "border-ink p-0.5" : "border-line"
                    }`}
                  >
                    <span
                      className="block h-full w-full rounded-full"
                      style={{ backgroundColor: option.hex }}
                    />
                    {unavailable ? (
                      <span className="pointer-events-none absolute inset-x-1 top-1/2 border-t border-ink/50" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        <fieldset className="mt-8">
          <legend className="text-[11px] uppercase tracking-[0.2em]">Size</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizeOptions.map((option) => (
              <button
                key={option.size}
                type="button"
                aria-label={
                  option.available ? option.size : `${option.size} — sold out`
                }
                onClick={() => {
                  setSize(option.size);
                  setError("");
                }}
                className={`min-h-11 min-w-11 border px-3 py-2 text-sm ${
                  !option.available ? "text-muted/50 line-through" : ""
                } ${
                  size === option.size
                    ? "border-ink bg-ink text-white"
                    : "border-line hover:border-ink"
                }`}
              >
                {option.size}
              </button>
            ))}
          </div>
        </fieldset>

        <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted">
          {stockLabel}
        </p>

        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

        <div className="mt-8 hidden flex-col gap-3 sm:flex-row md:flex">
          <Button className="flex-1" onClick={add} disabled={blocked}>
            {blocked ? "Sold out" : "Add to bag"}
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
            <p className="truncate text-sm">{formatPrice(price)}</p>
            <p className="truncate text-[11px] text-muted">
              {blocked
                ? "Sold out"
                : [color, size].filter(Boolean).join(" / ") || "Select a size"}
            </p>
          </div>
          <Button className="shrink-0" onClick={add} disabled={blocked}>
            {blocked ? "Sold out" : "Add to bag"}
          </Button>
        </div>
      </div>
    </div>
  );
}
