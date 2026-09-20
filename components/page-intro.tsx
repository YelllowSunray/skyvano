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
    <header className="mx-auto max-w-3xl px-4 pb-12 pt-16 text-center md:px-8">
      {eyebrow ? (
        <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-gold">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-serif text-5xl md:text-6xl">{title}</h1>
      {children ? (
        <div className="mt-5 text-base leading-7 text-muted">{children}</div>
      ) : null}
    </header>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 text-base leading-8 text-ink/85 md:px-8">
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
