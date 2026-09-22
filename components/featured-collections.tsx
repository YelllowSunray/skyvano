import Image from "next/image";
import Link from "next/link";
import { getCollectionPreviews } from "@/lib/catalog";

export async function FeaturedCollections() {
  const featured = await getCollectionPreviews(["women", "men"]);
  const visible = featured.filter((collection) => collection.count > 0);
  if (visible.length === 0) return null;

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
      <div className="mx-auto grid max-w-7xl gap-3 sm:gap-4 md:grid-cols-2">
        {visible.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className="group relative block aspect-[5/4] overflow-hidden bg-cream sm:aspect-[4/5] md:aspect-[3/4]"
          >
            {collection.image ? (
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            ) : null}
            {/* Product shots have pale backdrops, so the label needs a scrim. */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
              <h3 className="font-serif text-3xl sm:text-4xl">{collection.title}</h3>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] sm:text-[11px]">
                {collection.count} pieces
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
