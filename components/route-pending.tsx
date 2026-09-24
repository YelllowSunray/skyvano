"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CollectionLoading } from "@/components/product-grid-skeleton";
import { headingFromCollectionHref } from "@/lib/collection-heading";

type HeadingNav = Parameters<typeof headingFromCollectionHref>[1];

const PENDING_EVENT = "skyvano:route-pending";
const SKELETON_DELAY_MS = 80;

export function startRoutePending(href: string) {
  window.dispatchEvent(new CustomEvent(PENDING_EVENT, { detail: href }));
}

function sameLocation(href: string, pathname: string, search: string) {
  const url = new URL(href, window.location.origin);
  return url.pathname === pathname && url.search === search;
}

function isCollectionHref(href: string) {
  return href.startsWith("/collections");
}

export function RoutePending({ genderNav }: { genderNav: HeadingNav }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [href, setHref] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    setHref(null);
    setShowSkeleton(false);
  }, [pathname, search]);

  useEffect(() => {
    if (!href) {
      setShowSkeleton(false);
      return;
    }
    const timer = window.setTimeout(() => setShowSkeleton(true), SKELETON_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [href]);

  useEffect(() => {
    const begin = (next: string) => {
      if (!isCollectionHref(next)) return;
      if (sameLocation(next, pathname, search ? `?${search}` : "")) return;
      setHref(next);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("#")) return;
      begin(raw);
    };

    const onPending = (event: Event) => {
      const next = (event as CustomEvent<string>).detail;
      if (typeof next === "string") begin(next);
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener(PENDING_EVENT, onPending);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(PENDING_EVENT, onPending);
    };
  }, [pathname, search]);

  if (!href) return null;

  const title = headingFromCollectionHref(href, genderNav);

  return (
    <div
      className="pointer-events-none"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div className="fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden bg-line/40">
        <div className="load-bar h-full bg-gold" />
      </div>
      {showSkeleton ? (
        <div className="collection-pending-panel pointer-events-auto fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-cream/90 backdrop-blur-[3px]">
          <CollectionLoading title={title} />
        </div>
      ) : null}
    </div>
  );
}
