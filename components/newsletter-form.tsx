"use client";

import { useState } from "react";

type NewsletterFormProps = {
  dark?: boolean;
};

export function NewsletterForm({ dark = false }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="flex w-full max-w-md overflow-hidden rounded-sm border border-current"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      {submitted ? (
        <p className="px-4 py-3 text-sm">Welcome to the Skyvano Club.</p>
      ) : (
        <>
          <label className="sr-only" htmlFor={dark ? "footer-email" : "home-email"}>
            Email address
          </label>
          <input
            id={dark ? "footer-email" : "home-email"}
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className={`min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none ${
              dark
                ? "placeholder:text-white/40"
                : "placeholder:text-muted"
            }`}
          />
          <button
            type="submit"
            className={`px-5 text-[11px] uppercase tracking-[0.2em] ${
              dark ? "bg-gold text-ink" : "bg-ink text-white"
            }`}
          >
            Join
          </button>
        </>
      )}
    </form>
  );
}
