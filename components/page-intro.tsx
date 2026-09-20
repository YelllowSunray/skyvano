import Link from "next/link";

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto max-w-3xl px-4 pb-8 pt-10 text-center sm:pb-12 sm:pt-16 md:px-8">
      {eyebrow ? (
        <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-gold">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="break-words font-serif text-4xl sm:text-5xl md:text-6xl">
        {title}
      </h1>
      {children ? (
        <div className="mt-4 text-sm leading-7 text-muted sm:mt-5 sm:text-base">
          {children}
        </div>
      ) : null}
    </header>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 text-base leading-8 text-ink/85 sm:pb-24 md:px-8">
      {children}
    </div>
  );
}

export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="underline decoration-gold underline-offset-4">
      {children}
    </Link>
  );
}
