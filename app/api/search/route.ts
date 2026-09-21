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

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!query) return NextResponse.json({ results: [] satisfies SearchHit[] });

  const products = await searchProducts(query);
  const results: SearchHit[] = products.slice(0, 6).map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    price: product.price,
    image: product.images[0],
  }));

  return NextResponse.json({ results });
}
