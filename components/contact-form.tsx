"use client";

import { useState } from "react";
import { Button } from "@/components/button";

type Status = "idle" | "pending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("pending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          orderNumber: String(data.get("orderNumber") ?? ""),
          message: String(data.get("message") ?? ""),
          company: String(data.get("company") ?? ""),
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setStatus("error");
        setError(payload?.error ?? "Could not send your message.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setError("Could not send your message. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="border border-gold bg-white px-6 py-8 text-center font-serif text-2xl">
        Thank you. A member of the Skyvano team will reply within one working
        day.
      </p>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.18em]">
        Name
        <input
          name="name"
          required
          autoComplete="name"
          disabled={status === "pending"}
          className="border border-line bg-white px-4 py-3 text-base normal-case tracking-normal disabled:opacity-60"
        />
      </label>
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.18em]">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          disabled={status === "pending"}
          className="border border-line bg-white px-4 py-3 text-base normal-case tracking-normal disabled:opacity-60"
        />
      </label>
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.18em]">
        Order number (optional)
        <input
          name="orderNumber"
          autoComplete="off"
          disabled={status === "pending"}
          className="border border-line bg-white px-4 py-3 text-base normal-case tracking-normal disabled:opacity-60"
        />
      </label>
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.18em]">
        Message
        <textarea
          name="message"
          required
          rows={6}
          disabled={status === "pending"}
          className="border border-line bg-white px-4 py-3 text-base normal-case tracking-normal disabled:opacity-60"
        />
      </label>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="w-full sm:w-auto" disabled={status === "pending"}>
        {status === "pending" ? "Sending" : "Send message"}
      </Button>
    </form>
  );
}
