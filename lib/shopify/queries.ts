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
export const ALL_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query AllProducts($cursor: String) {
    products(first: 250, after: $cursor, sortKey: CREATED_AT, reverse: true) {
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

/** Shopify's own best-selling ranking; we only need the order of handles. */
export const BEST_SELLING_QUERY = /* GraphQL */ `
  query BestSelling($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        handle
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
