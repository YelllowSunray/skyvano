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
