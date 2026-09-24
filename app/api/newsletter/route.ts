import { NextResponse } from "next/server";
import {
  isNewsletterEmail,
  normalizeNewsletterEmail,
  subscribeToShopifyMarketing,
} from "@/lib/shopify/newsletter";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const body = (payload ?? {}) as { email?: unknown; company?: unknown };
  // Honeypot: bots fill hidden fields; pretend it worked.
  if (typeof body.company === "string" && body.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (typeof body.email !== "string") {
    return NextResponse.json({ error: "Enter your email address." }, { status: 400 });
  }

  const email = normalizeNewsletterEmail(body.email);
  if (!isNewsletterEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await subscribeToShopifyMarketing(email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Shopify newsletter subscribe failed", error);
    return NextResponse.json(
      { error: "Could not join the Skyvano Club. Please try again." },
      { status: 502 },
    );
  }
}
