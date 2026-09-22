/** Methods a Dutch Shopify checkout should offer once Payments is on. */
export const PAYMENT_METHODS = [
  "iDEAL",
  "Visa",
  "Mastercard",
  "Amex",
  "Apple Pay",
  "Google Pay",
  "Shop Pay",
  "Klarna",
  "PayPal",
] as const;

export const PAYMENT_METHODS_COPY = PAYMENT_METHODS.join(", ").replace(
  /, ([^,]+)$/,
  " and $1",
);
