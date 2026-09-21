import "server-only";

const DEFAULT_API_VERSION = "2026-07";

function read(name: string) {
  return process.env[name]?.trim() ?? "";
}

export type ShopifyConfig = {
  storeDomain: string;
  apiVersion: string;
  adminToken: string;
  apiKey: string;
  apiSecret: string;
  storefrontToken: string;
  storefrontPrivateToken: string;
  webhookSecret: string;
};

export function getShopifyConfig(): ShopifyConfig {
  const storeDomain = read("SHOPIFY_STORE_DOMAIN").replace(/^https?:\/\//, "").replace(/\/$/, "");

  return {
    storeDomain,
    apiVersion: read("SHOPIFY_API_VERSION") || DEFAULT_API_VERSION,
    adminToken: read("SHOPIFY_ADMIN_ACCESS_TOKEN"),
    apiKey: read("SHOPIFY_API_KEY"),
    apiSecret: read("SHOPIFY_API_SECRET"),
    storefrontToken: read("SHOPIFY_STOREFRONT_ACCESS_TOKEN"),
    storefrontPrivateToken: read("SHOPIFY_STOREFRONT_PRIVATE_TOKEN"),
    webhookSecret: read("SHOPIFY_WEBHOOK_SECRET"),
  };
}

/**
 * The storefront reads the catalog through the Storefront API, so Admin
 * credentials stay optional — they only unlock inventory, orders, and drafts.
 */
export function shopifyMissingKeys(config: ShopifyConfig = getShopifyConfig()) {
  const missing: string[] = [];
  if (!config.storeDomain) missing.push("SHOPIFY_STORE_DOMAIN");
  if (!config.storefrontToken && !config.storefrontPrivateToken) {
    missing.push("SHOPIFY_STOREFRONT_PRIVATE_TOKEN or SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  }
  return missing;
}

export function isShopifyReady() {
  return shopifyMissingKeys().length === 0;
}

export function isShopifyAdminReady(config: ShopifyConfig = getShopifyConfig()) {
  return (
    Boolean(config.storeDomain) &&
    (Boolean(config.adminToken) || Boolean(config.apiKey && config.apiSecret))
  );
}

export function shopifyAdminGraphqlUrl(config: ShopifyConfig = getShopifyConfig()) {
  return `https://${config.storeDomain}/admin/api/${config.apiVersion}/graphql.json`;
}

export function shopifyStorefrontGraphqlUrl(config: ShopifyConfig = getShopifyConfig()) {
  return `https://${config.storeDomain}/api/${config.apiVersion}/graphql.json`;
}
