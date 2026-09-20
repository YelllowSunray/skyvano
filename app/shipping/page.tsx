import type { Metadata } from "next";
import { PageIntro, Prose, TextLink } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description: "Skyvano shipping times, costs and delivery partners.",
};

export default function ShippingPage() {
  return (
    <>
      <PageIntro eyebrow="Help" title="Shipping & delivery">
        Fast, tracked European delivery from our Amsterdam atelier.
      </PageIntro>
      <Prose>
        <h2 className="mb-3 font-serif text-3xl text-ink">Costs</h2>
        <p>
          Complimentary tracked shipping on orders over €150 within the EU.
          Below that threshold, standard shipping is €9. Standard shipping to
          the United Kingdom, Switzerland and Norway is €18.
        </p>
        <h2 className="mb-3 mt-10 font-serif text-3xl text-ink">Timing</h2>
        <p>
          Orders placed before 14:00 CET on a working day leave the same
          afternoon. EU delivery is typically 2–5 working days. Remote areas
          may take longer during peak season.
        </p>
        <h2 className="mb-3 mt-10 font-serif text-3xl text-ink">Partners</h2>
        <p>
          We ship with DHL Express and UPS. A tracking number is sent by email
          and SMS when the parcel is collected. Signature may be required for
          high-value orders.
        </p>
        <p className="mt-6">
          Need to change an address? See <TextLink href="/faq">FAQ</TextLink>{" "}
          or write via our <TextLink href="/contact">contact form</TextLink>.
        </p>
      </Prose>
    </>
  );
}
