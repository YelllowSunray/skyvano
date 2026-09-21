import { formatPrice } from "@/lib/format";

/** Matches the threshold promised in the header promo bar and the footer. */
export const FREE_SHIPPING_THRESHOLD = 150;

export function ShippingProgress({ total }: { total: number }) {
  const remaining = FREE_SHIPPING_THRESHOLD - total;
  const progress = Math.min(total / FREE_SHIPPING_THRESHOLD, 1);

  return (
    <div className="mb-4">
      <p className="mb-2 text-xs text-muted">
        {remaining > 0 ? (
          <>
            {formatPrice(remaining)} away from complimentary shipping.
          </>
        ) : (
          "Complimentary shipping unlocked."
        )}
      </p>
      <div
        className="h-1 w-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={FREE_SHIPPING_THRESHOLD}
        aria-valuenow={Math.min(total, FREE_SHIPPING_THRESHOLD)}
        aria-label="Progress toward complimentary shipping"
      >
        <div
          className="h-full bg-gold transition-[width] duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
