import { houses } from "@/lib/products";

export function HouseMarquee() {
  const row = [...houses, ...houses, ...houses];
  return (
    <div className="overflow-hidden border-y border-line bg-ivory py-5">
      <div className="flex w-max marquee-track">
        {row.map((house, index) => (
          <span
            key={`${house}-${index}`}
            className="px-8 text-[11px] uppercase tracking-[0.32em] text-ink/70"
          >
            {house}
            <span className="ml-8 text-gold">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
