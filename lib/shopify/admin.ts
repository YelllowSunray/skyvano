import "server-only";

import {
  getShopifyConfig,
  shopifyAdminGraphqlUrl,
  type ShopifyConfig,
} from "@/lib/shopify/config";

export class ShopifyAdminError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ShopifyAdminError";
  }
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAdminAccessToken(config: ShopifyConfig) {
  if (config.adminToken) {
    return config.adminToken;
  }

  if (!config.storeDomain || !config.apiKey || !config.apiSecret) {
    throw new ShopifyAdminError(
      "Shopify Admin API is not configured. Set SHOPIFY_STORE_DOMAIN, SHOPIFY_API_KEY, and SHOPIFY_API_SECRET.",
    );
  }

  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value;
  }

  const response = await fetch(
    `https://${config.storeDomain}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: config.apiKey,
        client_secret: config.apiSecret,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new ShopifyAdminError(
      `Shopify token request failed (${response.status})`,
      response.status,
    );
  }

  const json = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!json.access_token) {
    throw new ShopifyAdminError("Shopify token response had no access_token");
  }

  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 86400) * 1000,
  };

  return cachedToken.value;
}

export async function shopifyAdminGraphql<T>(
  query: string,
  variables?: Record<string, unknown>,
  config: ShopifyConfig = getShopifyConfig(),
): Promise<T> {
  const token = await getAdminAccessToken(config);

  const response = await fetch(shopifyAdminGraphqlUrl(config), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ShopifyAdminError(
      `Shopify Admin API HTTP ${response.status}`,
      response.status,
    );
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    throw new ShopifyAdminError(json.errors.map((error) => error.message).join("; "));
  }

  if (!json.data) {
    throw new ShopifyAdminError("Shopify Admin API returned no data");
  }

  return json.data;
}
