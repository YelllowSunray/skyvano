"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/button";
import { PageIntro } from "@/components/page-intro";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useStore();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  /** Variants Shopify would not take, so the shopper can see which line to drop. */
  const [rejected, setRejected] = useState<string[]>([]);

  const checkout = async () => {
    setError("");
    setRejected([]);

    // Bags saved before the Shopify migration have no variant to order.
    if (cart.some((item) => !item.variantId)) {
      setError(
        "Your bag was saved before a store update. Please remove these pieces and add them again.",
      );
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: cart.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });
      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
        variantIds?: string[];
      };

      if (!response.ok || !data.checkoutUrl) {
        setError(data.error ?? "Checkout is unavailable right now.");
        setRejected(data.variantIds ?? []);
        return;
      }

      // Shopify hosts the payment step. The bag stays put until the order is
      // confirmed, so a shopper who backs out still has it.
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Could not reach checkout. Check your connection and try again.");
      setPending(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 md:px-8 md:pb-24">
      <PageIntro eyebrow="Bag" title="Your bag">
        {cart.length === 0
          ? "Nothing here yet."
          : `${cart.reduce((sum, item) => sum + item.quantity, 0)} items`}
      </PageIntro>
      {cart.length === 0 ? (
        <div className="text-center">
          <Button href="/collections/women">Shop the edit</Button>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:gap-12">
          <ul>
            {cart.map((item) => {
              const unavailable =
                !item.variantId || rejected.includes(item.variantId);

              return (
                <li
                  key={item.key}
                  className="flex gap-3 border-b border-line py-5 sm:gap-4 sm:py-6"
                >
                  <Link href={`/products/${item.slug}`} className="shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={120}
                      height={150}
                      className="h-24 w-20 object-cover sm:h-[150px] sm:w-[120px]"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                      {item.brand}
                    </p>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-serif text-xl leading-tight sm:text-2xl"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      {item.color} / {item.size}
                    </p>
                    {unavailable ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-red-700">
                        Out of stock
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 sm:mt-4">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          className="flex h-10 w-10 items-center justify-center"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="flex h-10 w-10 items-center justify-center"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm sm:text-base">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="mt-2 min-h-10 text-[11px] uppercase tracking-[0.16em] underline"
                      onClick={() => removeFromCart(item.key)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <aside className="h-fit border border-line bg-white p-5 sm:p-6">
            <h2 className="font-serif text-3xl">Summary</h2>
            <div className="mt-6 flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">
              Shipping and tax are calculated at checkout. Delivery is
              complimentary on orders over €150.
            </p>
            {error ? (
              <p
                role="alert"
                className="mt-5 border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-800"
              >
                {error}
              </p>
            ) : null}
            <Button
              className="mt-6 w-full"
              disabled={pending}
              onClick={checkout}
            >
              {pending ? "Preparing checkout…" : "Checkout"}
            </Button>
            <p className="mt-4 text-xs leading-5 text-muted">
              Payment is handled securely by Shopify. Visa, Mastercard, Amex,
              Apple Pay, iDEAL and Klarna.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
