import Image from "next/image";
import Link from "next/link";
import type { GenderNav } from "@/lib/catalog";

export function GenderLanding({ item }: { item: GenderNav }) {
  return (
    <div>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        {item.departments.map((department) => (
          <Link
            key={department.slug}
            href={`${item.href}?department=${department.slug}`}
            className="group relative block aspect-[4/5] overflow-hidden bg-cream"
          >
            {department.image ? (
              <Image
                src={department.image}
                alt={department.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
              <h2 className="font-serif text-3xl">{department.name}</h2>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] sm:text-[11px]">
                {department.count} {department.count === 1 ? "piece" : "pieces"}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-14 grid gap-12 border-t border-line pt-12 sm:grid-cols-3 sm:gap-10">
        {item.departments.map((department) => (
          <div key={`${department.slug}-list`}>
            <Link
              href={`${item.href}?department=${department.slug}`}
              className="font-serif text-2xl tracking-wide text-ink transition-colors hover:text-gold"
            >
              {department.name}
            </Link>
            <ul className="mt-4">
              {department.categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`${item.href}?category=${category.slug}`}
                    className="flex items-baseline justify-between gap-3 py-1.5 text-sm text-muted transition-colors hover:text-gold"
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-muted/70">{category.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`${item.href}?department=${department.slug}`}
              className="mt-4 inline-block text-[11px] uppercase tracking-[0.18em] text-gold"
            >
              View all {department.name.toLowerCase()}
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-12 text-center">
        <Link
          href={`${item.href}?all=1`}
          className="text-[11px] uppercase tracking-[0.22em] text-gold underline decoration-gold/40 underline-offset-8"
        >
          Shop all {item.label.toLowerCase()}
        </Link>
      </p>
    </div>
  );
}
