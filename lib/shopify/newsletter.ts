import "server-only";

import { randomBytes } from "node:crypto";
import { getShopifyConfig } from "@/lib/shopify/config";
import { shopifyAdminGraphql } from "@/lib/shopify/admin";
import { shopifyStorefrontGraphql } from "@/lib/shopify/storefront";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CLUB_TAGS = ["skyvano-club", "newsletter"];

type UserErrors = Array<{
  field?: string[] | null;
  message: string;
  code?: string | null;
}>;

type AdminCustomerCreateResponse = {
  customerCreate: {
    customer: { id: string } | null;
    userErrors: UserErrors;
  };
};

type CustomerSearchResponse = {
  customers: {
    nodes: Array<{ id: string }>;
  };
};

type ConsentUpdateResponse = {
  customerEmailMarketingConsentUpdate: {
    customer: { id: string } | null;
    userErrors: UserErrors;
  };
};

type StorefrontCustomerCreateResponse = {
  customerCreate: {
    customer: { id: string } | null;
    customerUserErrors: UserErrors;
  };
};

const ADMIN_CUSTOMER_CREATE = /* GraphQL */ `
  mutation NewsletterAdminCustomerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_SEARCH = /* GraphQL */ `
  query NewsletterCustomerSearch($query: String!) {
    customers(first: 1, query: $query) {
      nodes {
        id
      }
    }
  }
`;

const CONSENT_UPDATE = /* GraphQL */ `
  mutation NewsletterConsentUpdate(
    $input: CustomerEmailMarketingConsentUpdateInput!
  ) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const TAGS_ADD = /* GraphQL */ `
  mutation NewsletterTagsAdd($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      userErrors {
        message
      }
    }
  }
`;

const STOREFRONT_CUSTOMER_CREATE = /* GraphQL */ `
  mutation NewsletterCustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

function consentInput() {
  return {
    marketingState: "SUBSCRIBED",
    marketingOptInLevel: "SINGLE_OPT_IN",
  };
}

function alreadyOnFile(errors: UserErrors) {
  return errors.some((error) => {
    const haystack = `${error.code ?? ""} ${error.message}`;
    return /taken|already exists|already been taken/i.test(haystack);
  });
}

async function findCustomerId(email: string) {
  const data = await shopifyAdminGraphql<CustomerSearchResponse>(
    CUSTOMER_SEARCH,
    { query: `email:'${email.replace(/'/g, "\\'")}'` },
  );
  return data.customers.nodes[0]?.id;
}

async function subscribeExisting(customerId: string) {
  const data = await shopifyAdminGraphql<ConsentUpdateResponse>(CONSENT_UPDATE, {
    input: {
      customerId,
      emailMarketingConsent: consentInput(),
    },
  });
  const errors = data.customerEmailMarketingConsentUpdate.userErrors;
  if (errors.length > 0) {
    throw new Error(errors.map((error) => error.message).join("; "));
  }
  try {
    await shopifyAdminGraphql(TAGS_ADD, { id: customerId, tags: CLUB_TAGS });
  } catch {
    // Tagging is secondary to consent.
  }
}

async function subscribeViaAdmin(email: string) {
  const data = await shopifyAdminGraphql<AdminCustomerCreateResponse>(
    ADMIN_CUSTOMER_CREATE,
    {
      input: {
        email,
        tags: CLUB_TAGS,
        emailMarketingConsent: consentInput(),
      },
    },
  );

  const { customer, userErrors } = data.customerCreate;
  if (customer) return;

  if (alreadyOnFile(userErrors)) {
    const existingId = await findCustomerId(email);
    if (!existingId) {
      throw new Error("Could not update an existing subscriber.");
    }
    await subscribeExisting(existingId);
    return;
  }

  throw new Error(
    userErrors.map((error) => error.message).join("; ") ||
      "Shopify did not accept that email.",
  );
}

async function subscribeViaStorefront(email: string) {
  const password = `Sv-${randomBytes(16).toString("hex")}aA1`;
  const data = await shopifyStorefrontGraphql<StorefrontCustomerCreateResponse>(
    STOREFRONT_CUSTOMER_CREATE,
    {
      input: {
        email,
        password,
        acceptsMarketing: true,
      },
    },
  );

  const { customer, customerUserErrors } = data.customerCreate;
  if (customer) return;
  if (alreadyOnFile(customerUserErrors)) return;

  throw new Error(
    customerUserErrors.map((error) => error.message).join("; ") ||
      "Shopify did not accept that email.",
  );
}

export function normalizeNewsletterEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isNewsletterEmail(value: string) {
  return value.length <= 254 && EMAIL.test(value);
}

export async function subscribeToShopifyMarketing(email: string) {
  if (getShopifyConfig().adminToken) {
    await subscribeViaAdmin(email);
    return;
  }
  await subscribeViaStorefront(email);
}
