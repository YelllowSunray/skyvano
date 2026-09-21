// Verifies Shopify credentials in .env.local can read the store catalog.
// Run with: npm run shopify:check

import { readFileSync } from "node:fs";

function loadEnv(file) {
  let raw;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    return {};
  }

  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

// .env.local wins, and blank values never shadow a real one.
const env = {};
for (const source of [process.env, loadEnv(".env.local")]) {
  for (const [key, value] of Object.entries(source)) {
    if (value) env[key] = value;
  }
}
const storeDomain = env.SHOPIFY_STORE_DOMAIN;
const apiVersion = env.SHOPIFY_API_VERSION ?? "2026-07";

if (!storeDomain) {
  console.error("Missing SHOPIFY_STORE_DOMAIN in .env.local");
  process.exit(1);
}

const PRODUCTS_QUERY = `
  query CheckProducts {
    shop { name myshopifyDomain }
    products(first: 5) {
      nodes { title vendor status }
    }
  }
`;

async function adminToken() {
  if (env.SHOPIFY_ADMIN_ACCESS_TOKEN) return env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!env.SHOPIFY_API_KEY || !env.SHOPIFY_API_SECRET) {
    throw new Error("Set SHOPIFY_API_KEY and SHOPIFY_API_SECRET (or SHOPIFY_ADMIN_ACCESS_TOKEN)");
  }

  const response = await fetch(`https://${storeDomain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.SHOPIFY_API_KEY,
      client_secret: env.SHOPIFY_API_SECRET,
    }),
  });

  const body = await response.text();
  if (!response.ok) {
    if (body.includes("app_not_installed")) {
      throw new Error("app_not_installed — the app exists but is not installed on this store yet");
    }
    if (body.includes("shop_not_permitted")) {
      throw new Error("shop_not_permitted — the app lives in a different organization than the store");
    }
    throw new Error(`token request failed (HTTP ${response.status})`);
  }

  return JSON.parse(body).access_token;
}

async function viaAdmin() {
  const token = await adminToken();
  const response = await fetch(`https://${storeDomain}/admin/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query: PRODUCTS_QUERY }),
  });

  const json = await response.json();
  if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data;
}

async function viaStorefront() {
  const token = env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN || env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!token) throw new Error("no storefront token set");

  const header = env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
    ? "Shopify-Storefront-Private-Token"
    : "X-Shopify-Storefront-Access-Token";

  const response = await fetch(`https://${storeDomain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", [header]: token },
    body: JSON.stringify({
      query: `query { shop { name } products(first: 5) { nodes { title vendor } } }`,
    }),
  });

  const json = await response.json();
  if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data;
}

console.log(`Store: ${storeDomain}  (API ${apiVersion})\n`);

// Storefront API is what the site reads from; Admin is a bonus.
const checks = [
  { label: "Storefront API", run: viaStorefront, required: true },
  { label: "Admin API (optional)", run: viaAdmin, required: false },
];

let ready = false;

for (const { label, run, required } of checks) {
  try {
    const data = await run();
    const products = data.products.nodes;
    console.log(`✓ ${label} — ${data.shop.name}, ${products.length} product(s) read`);
    for (const product of products) console.log(`    · ${product.vendor} — ${product.title}`);
    if (required) ready = true;
  } catch (error) {
    console.log(`${required ? "✗" : "–"} ${label} — ${error.message}`);
  }
}

console.log(
  ready
    ? "\nReady to sync products."
    : "\nStorefront API not connected — fill SHOPIFY_STOREFRONT_PRIVATE_TOKEN in .env.local.",
);
process.exit(ready ? 0 : 1);
