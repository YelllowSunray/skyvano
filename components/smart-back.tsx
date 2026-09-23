"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BackIcon } from "@/components/icons";

const STACK_KEY = "skyvano:nav-stack";

function readStack(): string[] {
  try {
    const raw = window.sessionStorage.getItem(STACK_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeStack(stack: string[]) {
  window.sessionStorage.setItem(STACK_KEY, JSON.stringify(stack.slice(-30)));
}

function getFallback(pathname: string) {
  if (pathname.startsWith("/brands/") && pathname !== "/brands") {
    return { href: "/brands", label: "Brands" };
  }
  if (pathname.startsWith("/products/")) {
    return { href: "/collections/new-arrivals", label: "Shopping" };
  }
  if (pathname.startsWith("/collections/")) {
    return { href: "/", label: "Home" };
  }
  if (pathname === "/search" || pathname === "/cart") {
    return { href: "/", label: "Home" };
  }
  return { href: "/", label: "Home" };
}

export function useSmartBack() {
  const pathname = usePathname();
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  const fallback = useMemo(() => getFallback(pathname), [pathname]);
  const isHome = pathname === "/";

  useEffect(() => {
    const stack = readStack();

    if (isHome) {
      writeStack(["/"]);
      setCanGoBack(false);
    } else if (stack.length >= 2 && stack[stack.length - 2] === pathname) {
      stack.pop();
      writeStack(stack);
      setCanGoBack(stack.length >= 2);
    } else {
      if (stack[stack.length - 1] !== pathname) {
        stack.push(pathname);
        writeStack(stack);
      }
      setCanGoBack(stack.length >= 2);
    }

    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [isHome, pathname]);

  const goBack = useCallback(() => {
    if (canGoBack && window.history.length > 1) {
      router.back();
      return;
    }
    writeStack([fallback.href]);
    router.push(fallback.href);
  }, [canGoBack, fallback.href, router]);

  const label = canGoBack ? "Back" : `Back to ${fallback.label}`;

  return { isHome, label, goBack };
}

export function NavbarBackButton() {
  const { isHome, label, goBack } = useSmartBack();

  if (isHome) return null;

  return (
    <button
      type="button"
      onClick={goBack}
      className="flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-gold"
      aria-label={label}
    >
      <BackIcon className="h-5 w-5" />
    </button>
  );
}
