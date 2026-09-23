import Image from "next/image";
import { Button } from "@/components/button";

export function Hero() {
  return (
    <section className="relative h-[70svh] min-h-[420px] w-full overflow-hidden sm:h-[78vh] sm:min-h-[520px]">
      <video
        className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero.jpg"
        aria-hidden="true"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <Image
        src="/hero.jpg"
        alt=""
        fill
        priority
        className="hidden object-cover object-center motion-reduce:block"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-ink/10" />
      <div className="relative flex h-full flex-col items-center justify-center px-5 text-center text-white">
        <Image
          src="/logo.png"
          alt=""
          width={92}
          height={92}
          className="mb-4 h-14 w-14 object-contain sm:mb-6 sm:h-20 sm:w-20"
        />
        <h1 className="font-serif text-[12vw] leading-none tracking-[0.14em] sm:text-6xl sm:tracking-[0.18em] md:text-8xl">
          SKYVANO
        </h1>
        <div className="my-4 h-px w-12 bg-gold sm:my-5 sm:w-16" />
        <p className="max-w-[16rem] text-[11px] uppercase leading-5 tracking-[0.18em] text-white/85 sm:max-w-md sm:text-sm sm:tracking-[0.28em]">
          Elevated style. Everyday luxury.
        </p>
        <div className="mt-6 w-full max-w-xs sm:mt-8 sm:w-auto">
          <Button href="/collections/new-arrivals" className="w-full sm:w-auto">
            Shop new arrivals
          </Button>
        </div>
      </div>
    </section>
  );
}
