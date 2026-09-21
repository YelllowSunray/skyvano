import { NextResponse } from "next/server";
import { createShopifyCheckout, type CheckoutLine } from "@/lib/shopify/cart";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const lines = (payload as { lines?: unknown } | null)?.lines;
  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  const parsed: CheckoutLine[] = [];
  for (const line of lines) {
    const { variantId, quantity } = (line ?? {}) as {
      variantId?: unknown;
      quantity?: unknown;
    };
    if (typeof variantId !== "string" || typeof quantity !== "number") {
      return NextResponse.json({ error: "Invalid bag contents." }, { status: 400 });
    }
    parsed.push({ variantId, quantity });
  }

  try {
    const result = await createShopifyCheckout(parsed);

    if (result.ok) {
      return NextResponse.json({ checkoutUrl: result.checkoutUrl });
    }

    return NextResponse.json(
      result.reason === "unavailable"
        ? { error: result.message, variantIds: result.variantIds }
        : { error: result.message },
      { status: result.reason === "unavailable" ? 409 : 400 },
    );
  } catch (error) {
    // Token, network, or store-configuration problems land here.
    console.error("Shopify checkout failed", error);
    return NextResponse.json(
      { error: "Checkout is unavailable right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
