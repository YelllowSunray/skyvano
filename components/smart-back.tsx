"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

export function SmartBack() {
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
      return;
    }

    if (stack.length >= 2 && stack[stack.length - 2] === pathname) {
      stack.pop();
      writeStack(stack);
      setCanGoBack(stack.length >= 2);
      return;
    }

    if (stack[stack.length - 1] !== pathname) {
      stack.push(pathname);
      writeStack(stack);
    }

    setCanGoBack(stack.length >= 2);
  }, [isHome, pathname]);

  if (isHome) return null;

  const label = canGoBack ? "Back" : `Back to ${fallback.label}`;

  return (
    <div className="border-b border-line bg-ivory/95 md:bg-transparent">
      <div className="mx-auto flex max-w-7xl items-center px-2 sm:px-4 md:px-8">
        <button
          type="button"
          onClick={() => {
            if (canGoBack && window.history.length > 1) {
              router.back();
              return;
            }
            writeStack([fallback.href]);
            router.push(fallback.href);
          }}
          className="flex min-h-11 items-center gap-1 px-2 text-[11px] uppercase tracking-[0.2em] text-ink/80 transition-colors hover:text-gold sm:px-0"
          aria-label={label}
        >
          <BackIcon className="h-4 w-4" />
          {label}
        </button>
      </div>
    </div>
  );
}
