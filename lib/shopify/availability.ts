import "server-only";

import { CART_CREATE_MUTATION } from "@/lib/shopify/queries";
import {
  shopifyStorefrontGraphql,
  type StorefrontFetchOptions,
} from "@/lib/shopify/storefront";

/**
 * Which variants Shopify will actually sell.
 *
 * `ProductVariant.availableForSale` is the obvious source, but on this store it
 * reports true for every variant while the cart refuses all of them, so it
 * cannot be trusted to drive sold-out badges. The cart is the thing checkout
 * enforces: it accepts a line at the requested quantity only when the variant
 * is genuinely sellable, and silently zeroes the quantity when it is not.
 *
 * Granting the Headless storefront `unauthenticated_read_product_inventory`
 * would let this read `variant.quantityAvailable` instead, which is cheaper and
 * more direct. Until then, probing the cart is the only honest signal.
 */

/** cartCreate accepts many lines at once, so a whole catalogue costs few calls. */
const PROBE_BATCH_SIZE = 100;

type CartProbeResponse = {
  cartCreate: {
    cart: {
      lines: {
        nodes: Array<{
          quantity: number;
          merchandise: { id?: string };
        }>;
      };
    } | null;
    userErrors: Array<{ message: string }>;
  };
};

export async function fetchSellableVariantIds(
  variantIds: string[],
  options: StorefrontFetchOptions = {},
): Promise<Set<string>> {
  const sellable = new Set<string>();

  for (let index = 0; index < variantIds.length; index += PROBE_BATCH_SIZE) {
    const batch = variantIds.slice(index, index + PROBE_BATCH_SIZE);

    const data = await shopifyStorefrontGraphql<CartProbeResponse>(
      CART_CREATE_MUTATION,
      { lines: batch.map((id) => ({ merchandiseId: id, quantity: 1 })) },
      options,
    );

    const cart = data.cartCreate.cart;
    if (!cart) continue;

    for (const line of cart.lines.nodes) {
      const id = line.merchandise?.id;
      if (id && line.quantity >= 1) sellable.add(id);
    }
  }

  return sellable;
}
