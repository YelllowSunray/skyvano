import type { Product } from "@/lib/products";

/**
 * Ranked product search. The catalogue is small enough to score in memory on
 * every request, which buys typo tolerance and relevance ordering without a
 * search service.
 */

/** A brand hit says far more about intent than a word buried in the copy. */
const WEIGHTS = {
  brand: 12,
  name: 9,
  subcategory: 8,
  gender: 5,
  department: 5,
  colour: 4,
  tag: 4,
  size: 3,
  season: 2,
  description: 1,
} as const;

type Field = keyof typeof WEIGHTS;

type IndexedField = {
  field: Field;
  tokens: string[];
};

export type SearchIndex = Array<{
  product: Product;
  fields: IndexedField[];
}>;

/** Folds case and accents so "hermes" reaches "Hermès". */
function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Crude plural folding. Queries and the index run through the same function,
 * so consistency matters more than linguistic accuracy — "blazers" and
 * "Blazer" only have to meet somewhere.
 */
function stem(token: string) {
  if (token.length <= 3) return token;
  if (token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.endsWith("sses")) return token.slice(0, -2);
  if (token.endsWith("es")) return token.slice(0, -1);
  if (token.endsWith("ss")) return token;
  if (token.endsWith("s")) return token.slice(0, -1);
  return token;
}

/** Drops the single letters left behind by possessives ("women's" → "women"). */
function tokenize(value: string) {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 1)
    .map(stem);
}

/** True when a single insert, delete, or substitution turns one into the other. */
function withinOneEdit(a: string, b: string) {
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (long.length - short.length > 1) return false;

  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < short.length && j < long.length) {
    if (short[i] === long[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (short.length === long.length) i += 1;
    j += 1;
  }
  return edits + (long.length - j) + (short.length - i) <= 1;
}

/** Anything at or above this counts as a deliberate match rather than a guess. */
const CONFIDENT = 0.5;
const FUZZY = 0.35;

/** How well one query term matches one indexed token, from 0 to 1. */
function matchQuality(term: string, token: string) {
  if (token === term) return 1;
  if (token.startsWith(term)) return 0.7;
  if (token.includes(term)) return CONFIDENT;
  // Typos are only forgiven on longer words, where a stray letter is unlikely
  // to turn one real word into another.
  if (term.length >= 4 && withinOneEdit(term, token)) return FUZZY;
  return 0;
}

export function buildSearchIndex(products: Product[]): SearchIndex {
  return products.map((product) => {
    const fields: IndexedField[] = [
      { field: "brand", tokens: tokenize(product.brand) },
      { field: "name", tokens: tokenize(product.name) },
      { field: "subcategory", tokens: tokenize(product.subcategory) },
      { field: "gender", tokens: tokenize(product.gender) },
      { field: "department", tokens: tokenize(product.department) },
      {
        field: "colour",
        tokens: product.colors.flatMap((colour) => tokenize(colour.name)),
      },
      { field: "tag", tokens: product.tags.flatMap(tokenize) },
      // Sizes are a closed set, so "xl" and "s" stay searchable despite being
      // shorter than the tokenizer's minimum.
      { field: "size", tokens: product.sizes.map((size) => normalize(size)) },
      { field: "season", tokens: tokenize(product.season ?? "") },
      { field: "description", tokens: tokenize(product.description) },
    ];
    return { product, fields };
  });
}

export function searchIndex(index: SearchIndex, query: string) {
  const terms = normalize(query)
    .split(" ")
    .filter(Boolean)
    .map(stem);

  if (terms.length === 0) return [];

  const scored: Array<{ product: Product; score: number; order: number }> = [];

  index.forEach((entry, order) => {
    let total = 0;

    for (const term of terms) {
      const hits: Array<{ field: Field; quality: number }> = [];
      let strongest = 0;

      for (const { field, tokens } of entry.fields) {
        let best = 0;
        for (const token of tokens) {
          const quality = matchQuality(term, token);
          if (quality > best) best = quality;
          if (best === 1) break;
        }
        if (best > 0) {
          hits.push({ field, quality: best });
          if (best > strongest) strongest = best;
        }
      }

      // Every term has to land somewhere, so "black boots" cannot be satisfied
      // by "black" alone.
      if (hits.length === 0) return;

      // Fuzzy matches are a fallback, never a bonus: once a term matches
      // something properly, a near-miss elsewhere must not lift the ranking.
      // Otherwise "blazer" would favour the brand Blauer over every blazer.
      const usable =
        strongest >= CONFIDENT
          ? hits.filter((hit) => hit.quality >= CONFIDENT)
          : hits;

      for (const hit of usable) total += hit.quality * WEIGHTS[hit.field];
    }

    scored.push({ product: entry.product, score: total, order });
  });

  // Catalogue order is newest first, which is the right tiebreak.
  scored.sort((a, b) => b.score - a.score || a.order - b.order);
  return scored.map((entry) => entry.product);
}
