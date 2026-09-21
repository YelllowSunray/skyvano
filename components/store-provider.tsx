"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/lib/products";

export type CartItem = {
  key: string;
  productId: string;
  /** Shopify variant GID, needed when we hand the bag over to checkout. */
  variantId?: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
};

type StoreContextValue = {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMenuOpen: boolean;
  toast: string | null;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  addToCart: (input: {
    product: Product;
    color: string;
    size: string;
    quantity?: number;
  }) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const STORAGE_KEY = "skyvano-cart";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCart(JSON.parse(stored) as CartItem[]);
      } catch {
        setCart([]);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const locked = isCartOpen || isSearchOpen || isMenuOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, isMenuOpen, isSearchOpen]);

  const addToCart = useCallback(
    ({
      product,
      color,
      size,
      quantity = 1,
    }: {
      product: Product;
      color: string;
      size: string;
      quantity?: number;
    }) => {
      const variant = product.variants.find(
        (option) => option.color === color && option.size === size,
      );
      const key = `${product.id}-${color}-${size}`;
      setCart((current) => {
        const existing = current.find((item) => item.key === key);
        if (existing) {
          return current.map((item) =>
            item.key === key
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [
          ...current,
          {
            key,
            productId: product.id,
            variantId: variant?.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            image: product.images[0],
            price: variant?.price ?? product.price,
            color,
            size,
            quantity,
          },
        ];
      });
      setIsCartOpen(true);
      setToast("Added to bag");
    },
    [],
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setCart((current) =>
      quantity <= 0
        ? current.filter((item) => item.key !== key)
        : current.map((item) =>
            item.key === key ? { ...item, quantity } : item,
          ),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((current) => current.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return {
      cart,
      cartCount,
      cartTotal,
      isCartOpen,
      isSearchOpen,
      isMenuOpen,
      toast,
      openCart: () => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsCartOpen(true);
      },
      closeCart: () => setIsCartOpen(false),
      openSearch: () => {
        setIsMenuOpen(false);
        setIsCartOpen(false);
        setIsSearchOpen(true);
      },
      closeSearch: () => setIsSearchOpen(false),
      openMenu: () => {
        setIsSearchOpen(false);
        setIsCartOpen(false);
        setIsMenuOpen(true);
      },
      closeMenu: () => setIsMenuOpen(false),
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    };
  }, [
    addToCart,
    cart,
    clearCart,
    isCartOpen,
    isMenuOpen,
    isSearchOpen,
    removeFromCart,
    toast,
    updateQuantity,
  ]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}

