"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/** Same travel speed for the announcement bar and the house names. */
const PX_PER_SECOND = 48;

export function Marquee({
  children,
  className,
  trackClassName,
}: {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const width = track.scrollWidth / 2;
      if (width > 0) setDuration(width / PX_PER_SECOND);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div
        ref={trackRef}
        className={`flex w-max marquee-track ${trackClassName ?? ""}`}
        style={
          duration
            ? ({ animationDuration: `${duration}s` } satisfies CSSProperties)
            : undefined
        }
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
