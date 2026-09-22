import { Marquee } from "@/components/marquee";
import { getBrands } from "@/lib/catalog";

export async function HouseMarquee() {
  const brands = await getBrands();
  if (brands.length === 0) return null;

  return (
    <Marquee className="border-y border-line bg-ivory py-3 sm:py-5">
      {brands.map((brand) => (
        <span
          key={brand.slug}
          className="px-5 text-[10px] uppercase tracking-[0.24em] text-ink/70 sm:px-8 sm:text-[11px] sm:tracking-[0.32em]"
        >
          {brand.name}
        </span>
      ))}
    </Marquee>
  );
}
