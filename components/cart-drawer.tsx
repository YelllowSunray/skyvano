"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";
import { CloseIcon } from "@/components/icons";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const {
    cart,
    cartTotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        onClick={closeCart}
        aria-label="Close bag"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-serif text-3xl">Your bag</h2>
          <button type="button" onClick={closeCart} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-serif text-3xl">Your bag is empty</p>
            <p className="mt-3 text-sm text-muted">
              Discover the latest designer pieces.
            </p>
            <div className="mt-6" onClick={closeCart}>
              <Button href="/collections/new-arrivals">Continue shopping</Button>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-6">
              {cart.map((item) => (
                <li key={item.key} className="mb-6 flex gap-4">
                  <Link href={`/products/${item.slug}`} onClick={closeCart}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={90}
                      height={112}
                      className="h-28 w-20 object-cover"
                    />
                  </Link>
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                      {item.brand}
                    </p>
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="font-serif text-xl leading-tight"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {item.color} / {item.size}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          className="px-2 py-1"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          className="px-2 py-1"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm">{formatPrice(item.price)}</p>
                    </div>
                    <button
                      type="button"
                      className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted underline"
                      onClick={() => removeFromCart(item.key)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.16em]">
                  Subtotal
                </span>
                <span className="font-serif text-2xl">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <p className="mb-4 text-xs text-muted">
                Shipping and tax calculated at checkout.
              </p>
              <Button href="/cart" className="w-full" onClick={closeCart}>
                View bag & checkout
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
