"use client";

import { useId, useState } from "react";
import Link from "next/link";

type NewsletterFormProps = {
  dark?: boolean;
};

type Status = "idle" | "pending" | "success" | "error";

export function NewsletterForm({ dark = false }: NewsletterFormProps) {
  const fieldId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;

    const form = new FormData(event.currentTarget);
    setStatus("pending");
    setError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company: String(form.get("company") ?? ""),
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setStatus("error");
        setError(payload?.error ?? "Could not join the Skyvano Club.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setError("Could not join the Skyvano Club. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="max-w-md px-1 py-3 text-sm">
        Welcome to the Skyvano Club. You are subscribed for collection updates.
      </p>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form
        className="flex w-full overflow-hidden rounded-sm border border-current"
        onSubmit={onSubmit}
      >
        <label className="sr-only" htmlFor={fieldId}>
          Email address
        </label>
        <input
          id={fieldId}
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          disabled={status === "pending"}
          className={`min-w-0 flex-1 bg-transparent px-3 py-3 text-base outline-none disabled:opacity-60 sm:px-4 ${
            dark ? "placeholder:text-white/40" : "placeholder:text-muted"
          }`}
        />
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <button
          type="submit"
          disabled={status === "pending"}
          className={`min-h-11 px-4 text-[11px] uppercase tracking-[0.16em] disabled:opacity-60 sm:px-5 sm:tracking-[0.2em] ${
            dark ? "bg-gold text-ink" : "bg-ink text-white"
          }`}
        >
          {status === "pending" ? "Joining" : "Join"}
        </button>
      </form>
      {error ? (
        <p className="mt-3 text-[12px] leading-5 text-red-700" role="alert">
          {error}
        </p>
      ) : (
        <p
          className={`mt-3 text-[11px] leading-5 ${
            dark ? "text-white/50" : "text-muted"
          }`}
        >
          Join to receive new collections and offers. Unsubscribe anytime.{" "}
          <Link
            href="/privacy"
            className={dark ? "text-gold underline-offset-2 hover:underline" : "underline underline-offset-2"}
          >
            Privacy
          </Link>
        </p>
      )}
    </div>
  );
}
