import Image from "next/image";
import { Button } from "@/components/button";

export function Hero() {
  return (
    <section className="relative h-[78vh] min-h-[560px] w-full overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
        alt="Skyvano campaign"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/10" />
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <Image
          src="/logo.png"
          alt=""
          width={92}
          height={92}
          className="mb-6 h-20 w-20 object-contain"
        />
        <h1 className="font-serif text-6xl tracking-[0.18em] md:text-8xl">
          SKYVANO
        </h1>
        <div className="my-5 h-px w-16 bg-gold" />
        <p className="max-w-md text-sm uppercase tracking-[0.28em] text-white/85">
          Elevated style. Everyday luxury.
        </p>
        <div className="mt-8">
          <Button href="/collections/new-arrivals">Shop new arrivals</Button>
        </div>
      </div>
    </section>
  );
}
