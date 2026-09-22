import type { Metadata } from "next";
import { PageIntro, Prose } from "@/components/page-intro";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "The terms that apply to purchases from Skyvano.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageIntro eyebrow="Legal" title="Terms & conditions">
        The agreement between you and Skyvano when you place an order.
      </PageIntro>
      <Prose>
        <p>
          By placing an order you offer to buy the selected pieces at the price
          shown, plus any applicable shipping. A contract is formed when we send
          the dispatch confirmation. We may refuse or cancel an order if a piece
          is unavailable, if there is an obvious pricing error, or if we cannot
          verify the payment.
        </p>
        <p className="mt-6">
          All pieces remain the property of Skyvano until payment has cleared.
          Colours may vary slightly from screen to cloth. EU consumer
          withdrawal rights apply as described on the Returns page, except where
          a piece has been personalised or unsealed for hygiene reasons.
        </p>
        <p className="mt-6">
          These terms are governed by the laws of the Netherlands. Skyvano is an
          independent retailer and is not affiliated with the designer houses
          whose names appear on product pages.
        </p>
      </Prose>
    </>
  );
}
