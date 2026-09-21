"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";
import { CloseIcon } from "@/components/icons";
import { ShippingProgress } from "@/components/shipping-progress";
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
      <aside className="absolute right-0 top-0 flex h-dvh w-full max-w-md flex-col bg-ivory pt-[env(safe-area-inset-top)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="font-serif text-2xl sm:text-3xl">Your bag</h2>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center"
            onClick={closeCart}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center sm:px-8">
            <p className="font-serif text-3xl">Your bag is empty</p>
            <p className="mt-3 text-sm text-muted">
              Discover the latest designer pieces.
            </p>
            <div className="mt-6 w-full max-w-xs" onClick={closeCart}>
              <Button href="/collections/new-arrivals" className="w-full">
                Continue shopping
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              {cart.map((item) => (
                <li key={item.key} className="mb-6 flex gap-3 sm:gap-4">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="shrink-0"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={90}
                      height={112}
                      className="h-24 w-[72px] object-cover sm:h-28 sm:w-20"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                      {item.brand}
                    </p>
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="block font-serif text-lg leading-tight sm:text-xl"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {item.color} / {item.size}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
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
                        <span className="min-w-6 text-center text-sm">
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
                      <p className="shrink-0 text-sm">{formatPrice(item.price)}</p>
                    </div>
                    <button
                      type="button"
                      className="mt-2 min-h-10 text-[11px] uppercase tracking-[0.16em] text-muted underline"
                      onClick={() => removeFromCart(item.key)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-4 py-4 sm:px-6 sm:py-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-sm uppercase tracking-[0.16em]">
                  Subtotal
                </span>
                <span className="font-serif text-2xl">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <ShippingProgress total={cartTotal} />
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
