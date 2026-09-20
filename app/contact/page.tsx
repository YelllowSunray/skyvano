import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Skyvano client care team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 md:px-8">
      <PageIntro eyebrow="Client care" title="Contact">
        Questions about sizing, orders or a piece in the edit? Write to us.
      </PageIntro>
      <div className="grid gap-12 md:grid-cols-2">
        <div className="text-sm leading-7 text-muted">
          <p className="font-serif text-3xl text-ink">Skyvano Atelier</p>
          <p className="mt-4">Herengracht 120</p>
          <p>1015 BT Amsterdam</p>
          <p>The Netherlands</p>
          <p className="mt-6">
            Email
            <br />
            <a href="mailto:hello@skyvano.com" className="text-ink">
              hello@skyvano.com
            </a>
          </p>
          <p className="mt-4">
            Telephone
            <br />
            +31 20 244 1800
          </p>
          <p className="mt-4">Monday–Friday, 9:00–18:00 CET</p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
