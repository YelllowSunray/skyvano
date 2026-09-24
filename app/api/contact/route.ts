import { NextResponse } from "next/server";
import { parseContactPayload, sendContactEmail } from "@/lib/contact";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const body = (payload ?? {}) as { company?: unknown };
  if (typeof body.company === "string" && body.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  const parsed = parseContactPayload(payload);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }

  try {
    await sendContactEmail(parsed);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact email failed", error);
    return NextResponse.json(
      { error: "Could not send your message. Please email us directly." },
      { status: 502 },
    );
  }
}
