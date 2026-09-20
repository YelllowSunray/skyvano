import { NewsletterForm } from "@/components/newsletter-form";

export function NewsletterSection() {
  return (
    <section className="border-y border-line bg-white px-4 py-12 text-center sm:py-16 md:py-20">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
        Private access
      </p>
      <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Join the Skyvano Club</h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted sm:text-base">
        Get first access to new collections and exclusive offers.
      </p>
      <div className="mx-auto mt-8 flex w-full max-w-md justify-center">
        <NewsletterForm />
      </div>
    </section>
  );
}
