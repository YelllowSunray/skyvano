"use client";

import { useState } from "react";
import { Button } from "@/components/button";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="border border-gold bg-white px-6 py-8 text-center font-serif text-2xl">
        Thank you. A member of the Skyvano team will reply within one working
        day.
      </p>
    );
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.18em]">
        Name
        <input required className="border border-line bg-white px-4 py-3 text-base normal-case tracking-normal" />
      </label>
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.18em]">
        Email
        <input
          type="email"
          required
          className="border border-line bg-white px-4 py-3 text-base normal-case tracking-normal"
        />
      </label>
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.18em]">
        Order number (optional)
        <input className="border border-line bg-white px-4 py-3 text-base normal-case tracking-normal" />
      </label>
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.18em]">
        Message
        <textarea
          required
          rows={6}
          className="border border-line bg-white px-4 py-3 text-base normal-case tracking-normal"
        />
      </label>
      <Button type="submit" className="w-full sm:w-auto">Send message</Button>
    </form>
  );
}
