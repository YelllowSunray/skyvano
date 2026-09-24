"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

export function ProductGrid({
  products,
  pageSize,
}: {
  products: Product[];
  pageSize?: number;
}) {
  const items = products.filter((product) => product.available);
  const [visible, setVisible] = useState(pageSize ?? items.length);

  if (items.length === 0) {
    return (
      <p className="py-20 text-center text-muted">No pieces found in this edit.</p>
    );
  }

  const shown = pageSize ? items.slice(0, visible) : items;
  const remaining = items.length - shown.length;

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {shown.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {remaining > 0 ? (
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            onClick={() => setVisible((count) => count + (pageSize ?? 25))}
          >
            Load more
          </Button>
        </div>
      ) : null}
    </div>
  );
}
