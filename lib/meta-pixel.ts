export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
export const META_CURRENCY = "EUR";

export function isMetaPixelId(id: string) {
  return /^\d{5,20}$/.test(id);
}

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded: boolean;
  version: string;
  push: Fbq;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export function metaTrack(
  event: string,
  data?: Record<string, string | number | string[] | undefined>,
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (data) {
    window.fbq("track", event, data);
    return;
  }
  window.fbq("track", event);
}
