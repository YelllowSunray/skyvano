import { houses } from "@/lib/products";

export function HouseMarquee() {
  const row = [...houses, ...houses, ...houses];
  return (
    <div className="overflow-hidden border-y border-line bg-ivory py-3 sm:py-5">
      <div className="flex w-max marquee-track">
        {row.map((house, index) => (
          <span
            key={`${house}-${index}`}
            className="px-5 text-[10px] uppercase tracking-[0.24em] text-ink/70 sm:px-8 sm:text-[11px] sm:tracking-[0.32em]"
          >
            {house}
            <span className="ml-8 text-gold">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
