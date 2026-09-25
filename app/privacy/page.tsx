import type { Metadata } from "next";
import { PageIntro, Prose } from "@/components/page-intro";
import { pageMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Skyvano collects and uses personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="Legal" title="Privacy policy">
        How we handle the information you share with Skyvano.
      </PageIntro>
      <Prose>
        <p>
          {COMPANY.legalName} (“we”), trading as Skyvano, processes personal
          data to run this store: your name, email, delivery address, order
          history and, if you join the Skyvano Club, newsletter preferences.
          Payments are handled by certified processors; we do not store full
          card numbers.
        </p>
        <p className="mt-6">
          We use this information to fulfil orders, provide client care, prevent
          fraud and, with your consent, send collection updates. You may
          unsubscribe at any time. You can request access, correction or
          deletion by writing to {COMPANY.email}.
        </p>
        <p className="mt-6">
          We keep order records as required under Dutch and EU law. This site
          uses essential cookies for the bag and session. We also use Vercel
          Analytics and the Meta Pixel to measure visits, ads, and shopping
          events.
        </p>
      </Prose>
    </>
  );
}
