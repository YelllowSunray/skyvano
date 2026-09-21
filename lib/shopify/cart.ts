import "server-only";

import { CART_CREATE_MUTATION } from "@/lib/shopify/queries";
import { shopifyStorefrontGraphql } from "@/lib/shopify/storefront";

export type CheckoutLine = {
  variantId: string;
  quantity: number;
};

export type CheckoutResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; reason: "invalid"; message: string }
  | { ok: false; reason: "unavailable"; message: string; variantIds: string[] };

const VARIANT_GID = /^gid:\/\/shopify\/ProductVariant\/\d+$/;
const MAX_QUANTITY_PER_LINE = 50;

type CartCreateResponse = {
  cartCreate: {
    cart: {
      id: string;
      checkoutUrl: string;
      totalQuantity: number;
      lines: {
        nodes: Array<{
          quantity: number;
          merchandise: { id?: string };
        }>;
      };
    } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
};

/**
 * Hands the bag to Shopify and returns its hosted checkout URL.
 *
 * Shopify accepts a line and then silently drops its quantity to zero when the
 * variant cannot actually be sold, reporting no error, so the created cart is
 * read back and compared against what was asked for. Without that check the
 * shopper would be sent to a checkout that rejects them.
 */
export async function createShopifyCheckout(
  lines: CheckoutLine[],
): Promise<CheckoutResult> {
  const requested = new Map<string, number>();

  for (const line of lines) {
    if (!VARIANT_GID.test(line.variantId)) {
      return {
        ok: false,
        reason: "invalid",
        message: "That piece is no longer in the catalogue.",
      };
    }
    if (
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > MAX_QUANTITY_PER_LINE
    ) {
      return { ok: false, reason: "invalid", message: "Invalid quantity." };
    }
    requested.set(
      line.variantId,
      (requested.get(line.variantId) ?? 0) + line.quantity,
    );
  }

  if (requested.size === 0) {
    return { ok: false, reason: "invalid", message: "Your bag is empty." };
  }

  const data = await shopifyStorefrontGraphql<CartCreateResponse>(
    CART_CREATE_MUTATION,
    {
      lines: [...requested].map(([merchandiseId, quantity]) => ({
        merchandiseId,
        quantity,
      })),
    },
  );

  const { cart, userErrors } = data.cartCreate;

  if (userErrors.length > 0) {
    return { ok: false, reason: "invalid", message: userErrors[0].message };
  }
  if (!cart) {
    return {
      ok: false,
      reason: "invalid",
      message: "Shopify did not return a bag.",
    };
  }

  const accepted = new Map<string, number>();
  for (const node of cart.lines.nodes) {
    const id = node.merchandise?.id;
    if (id) accepted.set(id, (accepted.get(id) ?? 0) + node.quantity);
  }

  const short = [...requested].filter(
    ([variantId, quantity]) => (accepted.get(variantId) ?? 0) < quantity,
  );

  if (short.length > 0) {
    return {
      ok: false,
      reason: "unavailable",
      message:
        short.length === requested.size
          ? "These pieces are currently out of stock, so checkout cannot be completed."
          : "Some pieces in your bag are no longer in stock. Please remove them to continue.",
      variantIds: short.map(([variantId]) => variantId),
    };
  }

  return { ok: true, checkoutUrl: cart.checkoutUrl };
}
