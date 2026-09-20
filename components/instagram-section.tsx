import Image from "next/image";
import { InstagramIcon } from "@/components/icons";
import { instagramImages } from "@/lib/products";

export function InstagramSection() {
  return (
    <section className="pb-8">
      <div className="mb-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
          Follow @skyvano
        </p>
        <h2 className="mt-2 font-serif text-4xl">The edit, in motion</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6">
        {instagramImages.map((src, index) => (
          <a
            key={src}
            href="https://instagram.com"
            className="group relative aspect-square overflow-hidden"
          >
            <Image
              src={src}
              alt={`Skyvano Instagram look ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 16vw, 50vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/0 text-white opacity-0 transition-all group-hover:bg-ink/35 group-hover:opacity-100">
              <InstagramIcon className="h-6 w-6" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
