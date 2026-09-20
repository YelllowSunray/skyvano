import Image from "next/image";
import Link from "next/link";
import { collections } from "@/lib/products";

const featured = collections.filter((collection) =>
  ["women", "men", "accessories"].includes(collection.slug),
);

export function FeaturedCollections() {
  return (
    <section className="px-4 py-12 sm:py-16 md:px-8 md:py-20">
      <div className="mx-auto mb-8 max-w-7xl px-1 text-center sm:mb-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
          Shop by world
        </p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl">
          Featured collections
        </h2>
      </div>
      <div className="mx-auto grid max-w-7xl gap-3 sm:gap-4 md:grid-cols-3">
        {featured.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className="group relative block aspect-[5/4] overflow-hidden sm:aspect-[4/5] md:aspect-[3/4]"
          >
            <Image
              src={collection.image}
              alt={collection.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
            <div className="absolute inset-0 bg-ink/25" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
              <h3 className="font-serif text-3xl sm:text-4xl">{collection.title}</h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] sm:mt-2">
                Shop now
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
