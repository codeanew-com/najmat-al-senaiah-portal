/**
 * Plain CSS opacity fade, deliberately not using the browser's View
 * Transitions API. That API crossfades two full-page bitmap snapshots, and
 * when a locale switch also flips dir (LTR<->RTL), the old and new snapshots
 * are mirrored relative to each other — overlapping them produces visible
 * ghosting/ping-ponging instead of a clean dissolve. Remounting (via `key`)
 * and playing a fade-in keyframe on the already-correctly-mirrored new
 * content sidesteps that entirely, with identical behavior regardless of
 * direction — and needs no client-side JS at all.
 */
export function FadeIn({
  children,
  transitionKey,
}: {
  children: React.ReactNode;
  transitionKey: string;
}) {
  return (
    <div key={transitionKey} className="animate-[fade-in_200ms_ease-out]">
      {children}
    </div>
  );
}
