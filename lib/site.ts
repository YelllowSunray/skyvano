/** Canonical origin. Structured data needs absolute URLs, unlike metadata. */
export const SITE_URL = "https://skyvano.com";

export const SITE_NAME = "Skyvano";

/** Shopify New customer accounts — orders and profile (Admin → Customer accounts). */
export const SHOPIFY_ACCOUNT_URL = "https://shopify.com/108213731669/account";

/** Legal entity behind the Skyvano shop — required on Dutch webshops. */
export const COMPANY = {
  legalName: "Skyz Inc",
  brandName: SITE_NAME,
  streetAddress: "Graaf Huynlaan 11",
  postalCode: "6161 EX",
  addressLocality: "Geleen",
  addressCountry: "NL",
  addressCountryName: "The Netherlands",
  kvk: "87735342",
  vatId: "NL004475098B46",
  email: "info@skyvano.com",
  phone: "+31687880578",
  phoneDisplay: "+31 6 8788 0578",
} as const;

export function companyAddressLines() {
  return [
    COMPANY.streetAddress,
    `${COMPANY.postalCode} ${COMPANY.addressLocality}`,
    COMPANY.addressCountryName,
  ];
}
