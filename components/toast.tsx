"use client";

import { useStore } from "@/components/store-provider";

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-[70] w-[min(90vw,24rem)] -translate-x-1/2 rounded-sm bg-ink px-5 py-3 text-center text-[11px] uppercase tracking-[0.22em] text-white">
      {toast}
    </div>
  );
}
