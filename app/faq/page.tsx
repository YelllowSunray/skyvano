import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to the most common Skyvano questions.",
};

const faqs = [
  {
    q: "Are the pieces authentic?",
    a: "Yes. Skyvano is an independent luxury retailer. Every piece is inspected by our team before it is listed and again before it ships. We do not sell unofficial or unauthorised copies.",
  },
  {
    q: "Do you ship across Europe?",
    a: "Yes. We ship throughout the European Union, the United Kingdom, Switzerland and Norway. Orders over €150 qualify for complimentary tracked shipping.",
  },
  {
    q: "How long does delivery take?",
    a: "Most EU orders arrive in 2–5 working days. UK, Switzerland and Norway typically take 3–7 working days. You will receive a tracking link as soon as the parcel leaves our atelier.",
  },
  {
    q: "What is your returns policy?",
    a: "You have 30 days from delivery to return unworn items with original tags attached. Sale pieces may be exchanged for store credit unless they are faulty. See our Returns page for the full process.",
  },
  {
    q: "How do I choose a size?",
    a: "Each product page lists available sizes. If you are between sizes, we generally recommend the larger option for tailoring and the listed size for leather. Email hello@skyvano.com with your usual size and we will advise.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Visa, Mastercard, American Express, Apple Pay, iDEAL and Klarna. All payments are processed through a secure, encrypted checkout.",
  },
  {
    q: "Can I change or cancel an order?",
    a: "If the order has not yet been packed, yes. Contact us as soon as possible with your order number. Once a parcel is with the courier we cannot amend it, but you can refuse delivery or return it.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 md:px-8">
      <PageIntro eyebrow="Help" title="Frequently asked questions">
        Straight answers. If yours is not here, write to client care.
      </PageIntro>
      <div className="space-y-3">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="group border border-line bg-white px-5 py-4"
          >
            <summary className="cursor-pointer list-none font-serif text-2xl">
              {item.q}
            </summary>
            <p className="mt-3 text-sm leading-7 text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
