export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="h-10 w-48 bg-white" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-[4/5] bg-white" />
        ))}
      </div>
    </div>
  );
}
