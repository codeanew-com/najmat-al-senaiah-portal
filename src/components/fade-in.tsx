"use client";

import { useEffect, useState } from "react";

/**
 * Plain CSS opacity fade, deliberately not using the browser's View
 * Transitions API. That API crossfades two full-page bitmap snapshots, and
 * when a locale switch also flips dir (LTR<->RTL), the old and new snapshots
 * are mirrored relative to each other — overlapping them produces visible
 * ghosting/ping-ponging instead of a clean dissolve. Swapping to already-
 * correctly-mirrored new content and fading it in from opacity 0 sidesteps
 * that entirely, with identical behavior regardless of direction.
 */
export function FadeIn({
  children,
  transitionKey,
}: {
  children: React.ReactNode;
  transitionKey: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [transitionKey]);

  return (
    <div className={`transition-opacity duration-200 ease-out ${visible ? "opacity-100" : "opacity-0"}`}>
      {children}
    </div>
  );
}
