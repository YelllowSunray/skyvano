import type { Metadata } from "next";
import { Button } from "@/components/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center px-4 py-20 text-center sm:py-32">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">404</p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">This page has left the edit</h1>
      <p className="mt-4 max-w-md text-muted">
        The piece or page you were looking for is no longer available.
      </p>
      <div className="mt-8">
        <Button href="/">Back to Skyvano</Button>
      </div>
    </div>
  );
}
