"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted looping hero film layered over the hero photograph. It fades in
 * only once it is actually playing (so there is never a black flash), and
 * pauses when scrolled out of view or when the tab is hidden.
 */
export function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Autoplay can start before hydration, so the "playing" event may already
    // have fired: check the current state as well as listening for it.
    const markPlaying = () => setPlaying(true);
    if (!v.paused) markPlaying();
    v.addEventListener("playing", markPlaying);
    v.addEventListener("timeupdate", markPlaying, { once: true });
    let inView = true;
    const sync = () => {
      if (inView && document.visibilityState === "visible") void v.play().catch(() => undefined);
      else v.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      sync();
    });
    io.observe(v);
    document.addEventListener("visibilitychange", sync);
    return () => {
      v.removeEventListener("playing", markPlaying);
      v.removeEventListener("timeupdate", markPlaying);
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? "opacity-100" : "opacity-0"}`}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}
