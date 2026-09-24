const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    vendor
    productType
    tags
    availableForSale
    descriptionHtml
    images(first: 8) {
      nodes {
        url
      }
    }
    variants(first: 100) {
      nodes {
        id
        availableForSale
        quantityAvailable
        price {
          amount
        }
        compareAtPrice {
          amount
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

/**
 * `quantityAvailable` is the unit count. Without a buyer market it follows
 * Admin on-hand; `@inContext` would collapse it to "sellable online" and
 * mark the whole catalogue sold out.
 */
export const SEARCHED_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query SearchedProducts($cursor: String, $query: String) {
    products(
      first: 250
      after: $cursor
      query: $query
      sortKey: CREATED_AT
      reverse: true
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...ProductFields
      }
    }
  }
`;

/** Newest products for homepage shelves and on-demand ISR seeds. */
export const NEWEST_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query NewestProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        ...ProductFields
      }
    }
  }
`;

/** Shopify's own best-selling ranking, with enough fields to render cards. */
export const BEST_SELLING_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query BestSelling($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        ...ProductFields
      }
    }
  }
`;

/** One product page — never the rest of the shop. */
export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

/**
 * Header, brands, and sitemap only need tags and a thumbnail.
 * Walking 7k SKUs is acceptable every 15 minutes; variants are not.
 */
export const NAV_PRODUCTS_QUERY = /* GraphQL */ `
  query NavProducts($cursor: String) {
    products(first: 250, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        handle
        title
        vendor
        productType
        tags
        availableForSale
        images(first: 1) {
          nodes {
            url
          }
        }
      }
    }
  }
`;

/**
 * The lines come back so the caller can confirm Shopify actually took the
 * quantities it was asked for; checkoutUrl is Shopify's hosted payment page.
 */
export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 250) {
          nodes {
            quantity
            merchandise {
              ... on ProductVariant {
                id
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
