import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageIntro } from "@/components/page-intro";
import { pageMetadata } from "@/lib/seo";
import { COMPANY, companyAddressLines } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with the Skyvano client care team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 md:px-8">
      <PageIntro eyebrow="Client care" title="Contact">
        Questions about sizing, orders or a piece in the edit? Write to us.
      </PageIntro>
      <div className="grid gap-12 md:grid-cols-2">
        <div className="text-sm leading-7 text-muted">
          <p className="font-serif text-3xl text-ink">{COMPANY.legalName}</p>
          <div className="mt-4">
            {companyAddressLines().map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-6">
            Email
            <br />
            <a href={`mailto:${COMPANY.email}`} className="text-ink">
              {COMPANY.email}
            </a>
          </p>
          <p className="mt-4">
            Telephone
            <br />
            <a href={`tel:${COMPANY.phone}`} className="text-ink">
              {COMPANY.phoneDisplay}
            </a>
          </p>
          <p className="mt-6">
            KVK {COMPANY.kvk}
            <br />
            BTW-id {COMPANY.vatId}
          </p>
          <p className="mt-4">Monday–Friday, 9:00–18:00 CET</p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
