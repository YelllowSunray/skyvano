import { getBrands } from "@/lib/catalog";

export async function HouseMarquee() {
  const brands = await getBrands();
  if (brands.length === 0) return null;

  const names = brands.map((brand) => brand.name);
  const row = [...names, ...names];

  return (
    <div className="overflow-hidden border-y border-line bg-ivory py-3 sm:py-5">
      <div className="flex w-max marquee-track">
        {row.map((name, index) => (
          <span
            key={`${name}-${index}`}
            className="px-5 text-[10px] uppercase tracking-[0.24em] text-ink/70 sm:px-8 sm:text-[11px] sm:tracking-[0.32em]"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
