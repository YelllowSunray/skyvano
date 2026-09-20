import { NewsletterForm } from "@/components/newsletter-form";

export function NewsletterSection() {
  return (
    <section className="border-y border-line bg-white px-4 py-20 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
        Private access
      </p>
      <h2 className="mt-3 font-serif text-5xl">Join the Skyvano Club</h2>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Get first access to new collections and exclusive offers.
      </p>
      <div className="mx-auto mt-8 flex justify-center">
        <NewsletterForm />
      </div>
    </section>
  );
}
