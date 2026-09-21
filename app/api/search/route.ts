import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/catalog";

export type SearchHit = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image?: string;
};

export type SearchResponse = {
  results: SearchHit[];
  /** Full match count, so the modal can offer the rest of them. */
  total: number;
};

const SUGGESTION_LIMIT = 6;

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!query) {
    return NextResponse.json({ results: [], total: 0 } satisfies SearchResponse);
  }

  const products = await searchProducts(query);
  const results: SearchHit[] = products
    .slice(0, SUGGESTION_LIMIT)
    .map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
    }));

  return NextResponse.json({
    results,
    total: products.length,
  } satisfies SearchResponse);
}
