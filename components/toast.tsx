"use client";

import { useStore } from "@/components/store-provider";

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-sm bg-ink px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-white">
      {toast}
    </div>
  );
}
