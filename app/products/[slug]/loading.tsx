export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8" aria-busy="true">
      <div className="skeleton-shimmer mb-8 h-3 w-40" />
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="skeleton-shimmer aspect-[4/5]" />
        <div className="pt-2">
          <div className="skeleton-shimmer h-3 w-24" />
          <div className="skeleton-shimmer mt-4 h-10 w-3/4" />
          <div className="skeleton-shimmer mt-4 h-5 w-20" />
          <div className="mt-8 flex gap-2">
            <div className="skeleton-shimmer h-11 w-16" />
            <div className="skeleton-shimmer h-11 w-16" />
            <div className="skeleton-shimmer h-11 w-16" />
          </div>
          <div className="skeleton-shimmer mt-8 h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
