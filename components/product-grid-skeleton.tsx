export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="skeleton-card"
          style={{ animationDelay: `${index * 70}ms` }}
        >
          <div className="skeleton-shimmer aspect-[4/5]" />
          <div className="skeleton-shimmer mt-3 h-3 w-2/3" />
          <div className="skeleton-shimmer mt-2 h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function CollectionLoading({
  title = "Loading the edit",
  flush = false,
}: {
  title?: string;
  flush?: boolean;
}) {
  const body = (
    <>
      <div className="mx-auto max-w-3xl px-4 pb-8 pt-6 text-center sm:pb-12 sm:pt-12 md:px-8">
        <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-gold">
          Collection
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl">{title}</h1>
        <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted">
          <span className="load-dots" aria-hidden>
            <span />
            <span />
            <span />
          </span>
          Gathering pieces
        </p>
      </div>
      <ProductGridSkeleton />
    </>
  );

  if (flush) return body;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-20">{body}</div>
  );
}
