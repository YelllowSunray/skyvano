"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/button";
import { PageIntro } from "@/components/page-intro";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } =
    useStore();
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
          Order received
        </p>
        <h1 className="mt-3 font-serif text-5xl">Thank you</h1>
        <p className="mt-4 text-muted">
          This is a demonstration checkout. In production, this step connects to
          Shopify payments.
        </p>
        <div className="mt-8">
          <Button href="/collections/new-arrivals">Continue shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 md:px-8">
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
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr]">
          <ul>
            {cart.map((item) => (
              <li
                key={item.key}
                className="flex gap-4 border-b border-line py-6"
              >
                <Link href={`/products/${item.slug}`}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={120}
                    height={150}
                    className="h-[150px] w-[120px] object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                    {item.brand}
                  </p>
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-serif text-2xl"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    {item.color} / {item.size}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-line">
                      <button
                        type="button"
                        className="px-3 py-1"
                        onClick={() =>
                          updateQuantity(item.key, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        type="button"
                        className="px-3 py-1"
                        onClick={() =>
                          updateQuantity(item.key, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <p>{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <button
                    type="button"
                    className="mt-3 text-[11px] uppercase tracking-[0.16em] underline"
                    onClick={() => removeFromCart(item.key)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit border border-line bg-white p-6">
            <h2 className="font-serif text-3xl">Summary</h2>
            <div className="mt-6 flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span>Shipping</span>
              <span>{cartTotal >= 150 ? "Complimentary" : "€9"}</span>
            </div>
            <div className="mt-6 flex justify-between border-t border-line pt-4">
              <span className="uppercase tracking-[0.16em]">Total</span>
              <span className="font-serif text-2xl">
                {formatPrice(cartTotal + (cartTotal >= 150 ? 0 : 9))}
              </span>
            </div>
            <Button
              className="mt-6 w-full"
              onClick={() => {
                clearCart();
                setPlaced(true);
              }}
            >
              Checkout
            </Button>
            <p className="mt-4 text-xs leading-5 text-muted">
              Secure payments with Visa, Mastercard, Amex, Apple Pay, iDEAL and
              Klarna.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
