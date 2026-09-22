import "server-only";

import {
  getShopifyConfig,
  shopifyStorefrontGraphqlUrl,
  type ShopifyConfig,
} from "@/lib/shopify/config";

export class ShopifyStorefrontError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ShopifyStorefrontError";
  }
}

export type StorefrontFetchOptions = {
  /** Seconds before the cached response is refetched. Omit to bypass the cache. */
  revalidate?: number;
  tags?: string[];
  config?: ShopifyConfig;
};

export async function shopifyStorefrontGraphql<T>(
  query: string,
  variables?: Record<string, unknown>,
  options: StorefrontFetchOptions = {},
): Promise<T> {
  const { revalidate, tags, config = getShopifyConfig() } = options;

  if (!config.storeDomain) {
    throw new ShopifyStorefrontError(
      "Shopify Storefront API is not configured. Set SHOPIFY_STORE_DOMAIN.",
    );
  }

  if (!config.storefrontPrivateToken && !config.storefrontToken) {
    throw new ShopifyStorefrontError(
      "Set SHOPIFY_STOREFRONT_PRIVATE_TOKEN or SHOPIFY_STOREFRONT_ACCESS_TOKEN.",
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.storefrontPrivateToken) {
    headers["Shopify-Storefront-Private-Token"] = config.storefrontPrivateToken;
  } else {
    headers["X-Shopify-Storefront-Access-Token"] = config.storefrontToken;
  }

  // force-cache is what makes Next cache a POST; without it the route goes dynamic.
  const response = await fetch(shopifyStorefrontGraphqlUrl(config), {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    ...(revalidate === undefined
      ? { cache: "no-store" as const }
      : { cache: "force-cache" as const, next: { revalidate, tags } }),
  });

  if (!response.ok) {
    throw new ShopifyStorefrontError(
      `Shopify Storefront API HTTP ${response.status}`,
      response.status,
    );
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: Array<{
      message: string;
      extensions?: { code?: string; requiredAccess?: string };
    }>;
  };

  const blocking = json.errors?.filter((error) => !isInventoryScopeError(error));
  if (blocking?.length) {
    throw new ShopifyStorefrontError(
      blocking.map((error) => error.message).join("; "),
    );
  }

  if (!json.data) {
    throw new ShopifyStorefrontError("Shopify Storefront API returned no data");
  }

  return json.data;
}

/** Headless tokens often omit inventory; the rest of the catalogue still loads. */
function isInventoryScopeError(error: {
  message: string;
  extensions?: { code?: string; requiredAccess?: string };
}) {
  if (error.extensions?.code !== "ACCESS_DENIED") return false;
  return /quantityAvailable|totalInventory|product_inventory/i.test(
    `${error.message} ${error.extensions.requiredAccess ?? ""}`,
  );
}
