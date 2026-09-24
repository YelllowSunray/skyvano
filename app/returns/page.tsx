import type { Metadata } from "next";
import { PageIntro, Prose, TextLink } from "@/components/page-intro";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Returns",
  description: "How to return or exchange a Skyvano order.",
  path: "/returns",
});

export default function ReturnsPage() {
  return (
    <>
      <PageIntro eyebrow="Help" title="Returns">
        30 days. Unworn pieces. A process that stays as quiet as the clothes.
      </PageIntro>
      <Prose>
        <h2 className="mb-3 font-serif text-3xl text-ink">The window</h2>
        <p>
          You have 30 days from the delivery date to return an item. It must be
          unworn, unwashed and in original condition, with tags attached and
          dust bags included where supplied.
        </p>
        <h2 className="mb-3 mt-10 font-serif text-3xl text-ink">How to return</h2>
        <ol className="list-decimal space-y-3 pl-5">
          <li>Email info@skyvano.com with your order number.</li>
          <li>We send a prepaid European return label.</li>
          <li>Drop the parcel at a DHL or UPS point within 7 days.</li>
          <li>Refunds are issued to the original payment method within 5 working days of inspection.</li>
        </ol>
        <h2 className="mb-3 mt-10 font-serif text-3xl text-ink">Exchanges</h2>
        <p>
          Size exchanges are complimentary within Europe. Sale items are
          refunded as Skyvano credit unless the piece is faulty. For full terms,
          read our <TextLink href="/terms">Terms & Conditions</TextLink>.
        </p>
      </Prose>
    </>
  );
}
