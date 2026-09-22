import "server-only";

import type { Product } from "@/lib/products";
import { shopifyAdminGraphql } from "@/lib/shopify/admin";
import { getShopifyConfig } from "@/lib/shopify/config";

type AdminInventoryResponse = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: Array<{
      variants: {
        nodes: Array<{ id: string; inventoryQuantity: number | null }>;
      };
    }>;
  };
};

const ADMIN_INVENTORY_QUERY = /* GraphQL */ `
  query AdminInventory($cursor: String) {
    products(first: 250, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        variants(first: 100) {
          nodes {
            id
            inventoryQuantity
          }
        }
      }
    }
  }
`;

/** Admin on-hand units, keyed by variant GID. Null when the Admin app is not installed. */
export async function fetchAdminVariantQuantities() {
  if (!getShopifyConfig().adminToken) return null;

  try {
    const quantities = new Map<string, number>();
    let cursor: string | null = null;

    do {
      const data = await shopifyAdminGraphql<AdminInventoryResponse>(
        ADMIN_INVENTORY_QUERY,
        { cursor },
      );
      for (const product of data.products.nodes) {
        for (const variant of product.variants.nodes) {
          if (variant.inventoryQuantity != null) {
            quantities.set(variant.id, variant.inventoryQuantity);
          }
        }
      }
      cursor = data.products.pageInfo.hasNextPage
        ? data.products.pageInfo.endCursor
        : null;
    } while (cursor);

    return quantities.size > 0 ? quantities : null;
  } catch {
    return null;
  }
}

/** Sold-out follows unit count: 0 is sold out, anything above is buyable. */
export function applyInventoryQuantities(
  products: Product[],
  adminQuantities?: Map<string, number> | null,
): Product[] {
  return products.map((product) => {
    const variants = product.variants.map((variant) => {
      const quantity = adminQuantities?.get(variant.id) ?? variant.quantity;
      return {
        ...variant,
        ...(quantity == null ? {} : { quantity }),
        available: quantity == null ? variant.available : quantity > 0,
      };
    });
    return {
      ...product,
      variants,
      available: variants.some((variant) => variant.available),
    };
  });
}
