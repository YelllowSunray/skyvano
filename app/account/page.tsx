"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { PageIntro } from "@/components/page-intro";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [done, setDone] = useState(false);

  return (
    <div className="mx-auto max-w-md px-4 pb-24">
      <PageIntro
        eyebrow="Client account"
        title={mode === "login" ? "Sign in" : "Create account"}
      >
        Access orders, returns and Skyvano Club offers.
      </PageIntro>
      {done ? (
        <p className="border border-gold bg-white px-6 py-8 text-center font-serif text-2xl">
          Welcome back. Your account is ready.
        </p>
      ) : (
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            setDone(true);
          }}
        >
          {mode === "register" ? (
            <input
              required
              placeholder="Full name"
              className="min-h-11 border border-line bg-white px-4 py-3 text-base"
            />
          ) : null}
          <input
            type="email"
            required
            placeholder="Email"
            className="min-h-11 border border-line bg-white px-4 py-3 text-base"
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="min-h-11 border border-line bg-white px-4 py-3 text-base"
          />
          <Button type="submit" className="w-full">
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>
      )}
      <button
        type="button"
        className="mt-6 w-full text-center text-[11px] uppercase tracking-[0.18em] text-muted"
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setDone(false);
        }}
      >
        {mode === "login"
          ? "New to Skyvano? Create an account"
          : "Already a client? Sign in"}
      </button>
    </div>
  );
}
