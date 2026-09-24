"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { startRoutePending } from "@/components/route-pending";
import {
  countFilters,
  SORT_OPTIONS,
  type Facet,
  type Filters,
  type SortKey,
} from "@/lib/collection-view";

type Group = {
  param: "brand" | "size" | "colour";
  label: string;
  facets: Facet[];
  selected: string[];
};

export function CollectionToolbar({
  total,
  shown,
  sort,
  filters,
  facets,
}: {
  total: number;
  shown: number;
  sort: SortKey;
  filters: Filters;
  facets: { brands: Facet[]; sizes: Facet[]; colours: Facet[] };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const active = countFilters(filters);

  /** Filters live in the URL so a filtered collection can be shared. */
  const apply = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    startRoutePending(href);
    router.push(href, { scroll: false });
  };

  const toggle = (param: string, value: string) =>
    apply((params) => {
      const current = params.getAll(param);
      params.delete(param);
      for (const entry of current.filter((item) => item !== value)) {
        params.append(param, entry);
      }
      if (!current.includes(value)) params.append(param, value);
    });

  const groups: Group[] = [
    { param: "brand", label: "Brand", facets: facets.brands, selected: filters.brands },
    { param: "size", label: "Size", facets: facets.sizes, selected: filters.sizes },
    { param: "colour", label: "Colour", facets: facets.colours, selected: filters.colours },
  ];

  return (
    <div className="mb-8 border-y border-line">
      <div className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="text-[11px] uppercase tracking-[0.18em] underline decoration-gold underline-offset-8"
          >
            {open ? "Hide filters" : "Filter"}
            {active > 0 ? ` (${active})` : ""}
          </button>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
            {shown === total
              ? `${total} ${total === 1 ? "piece" : "pieces"}`
              : `${shown} of ${total}`}
          </p>
        </div>

        <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]">
          <span className="text-muted">Sort</span>
          <select
            value={sort}
            onChange={(event) =>
              apply((params) => {
                if (event.target.value === "featured") params.delete("sort");
                else params.set("sort", event.target.value);
              })
            }
            className="min-h-11 border border-line bg-transparent px-2 py-1 text-[11px] uppercase tracking-[0.14em]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {open ? (
        <div className="border-t border-line py-5">
          <label className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em]">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={() =>
                apply((params) => {
                  if (filters.inStockOnly) params.delete("available");
                  else params.set("available", "1");
                })
              }
              className="h-4 w-4 accent-ink"
            />
            In stock only
          </label>

          <div className="grid gap-6 sm:grid-cols-3">
            {groups.map((group) =>
              group.facets.length === 0 ? null : (
                <div key={group.param}>
                  <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-muted">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.facets.map((facet) => {
                      const on = group.selected.includes(facet.value);
                      return (
                        <button
                          key={facet.value}
                          type="button"
                          onClick={() => toggle(group.param, facet.value)}
                          aria-pressed={on}
                          className={`border px-3 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors ${
                            on
                              ? "border-ink bg-ink text-white"
                              : "border-line hover:border-ink"
                          }`}
                        >
                          {facet.value}
                          <span className={on ? "text-white/60" : "text-muted"}>
                            {" "}
                            {facet.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ),
            )}
          </div>

          {active > 0 ? (
            <button
              type="button"
              onClick={() =>
                apply((params) => {
                  for (const key of ["brand", "size", "colour", "available"]) {
                    params.delete(key);
                  }
                })
              }
              className="mt-6 text-[11px] uppercase tracking-[0.16em] underline"
            >
              Clear all filters
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
