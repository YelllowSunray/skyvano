import { CheckIcon } from "@/components/icons";

const reasons = [
  {
    title: "Premium selection",
    text: "An edited mix of designer houses, chosen for cut, fabric and staying power.",
  },
  {
    title: "Secure payments",
    text: "Encrypted checkout with Visa, Mastercard, Apple Pay, iDEAL and Klarna.",
  },
  {
    title: "Fast European delivery",
    text: "Tracked shipping across Europe, complimentary over €150.",
  },
  {
    title: "Easy returns",
    text: "30 days to return unworn pieces. Labels included.",
  },
  {
    title: "Customer support",
    text: "Stylists and client care, Monday to Friday, 9:00–18:00 CET.",
  },
];

export function WhyShop() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="mb-12 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
          The Skyvano standard
        </p>
        <h2 className="mt-2 font-serif text-4xl md:text-5xl">Why shop with us</h2>
      </div>
      <div className="grid gap-8 md:grid-cols-5">
        {reasons.map((reason) => (
          <div key={reason.title} className="text-center md:text-left">
            <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-gold text-gold md:mx-0">
              <CheckIcon />
            </div>
            <h3 className="font-serif text-2xl">{reason.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{reason.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
