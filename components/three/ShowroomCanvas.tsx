"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildShowroom, type Quality, type Showroom, type ShowroomState } from "@/lib/three/showroom";

interface Props {
  state: ShowroomState;
  className?: string;
  /** Slight camera movement following the mouse (desktop). */
  parallax?: boolean;
  /** Push the camera in as the canvas scrolls away. */
  scrollLinked?: boolean;
  /** The first frame is on screen. */
  onReady?: () => void;
  /** WebGL is unavailable or was lost: the caller keeps showing its poster. */
  onFail?: () => void;
}

/** Phones and low-memory devices skip bloom and shadows. */
function pickQuality(): Quality {
  try {
    const nav = navigator as Navigator & { deviceMemory?: number };
    if (window.matchMedia("(pointer: coarse)").matches) return "low";
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 8) return "low";
    return "high";
  } catch {
    return "low";
  }
}

/**
 * The live 3D lighting room (lib/three/showroom.ts) on a canvas that fills
 * its parent. It only draws while something is changing (a light fading, the
 * camera moving) and stops when off screen, so it is easy on batteries.
 * Load it with next/dynamic and ssr: false; three.js stays out of the first bundle.
 */
export default function ShowroomCanvas({ state, className = "", parallax = false, scrollLinked = false, onReady, onFail }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roomRef = useRef<Showroom | null>(null);
  const wake = useRef<() => void>(() => undefined);
  const drawn = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;
  const callbacks = useRef({ onReady, onFail });
  callbacks.current = { onReady, onFail };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch {
      callbacks.current.onFail?.();
      return;
    }

    let quality = pickQuality();
    const room = buildShowroom(renderer, { quality });
    roomRef.current = room;
    room.setState(stateRef.current, true);

    const ratio = () => Math.min(window.devicePixelRatio || 1, quality === "high" ? 1.75 : 1.5);
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) room.resize(Math.round(r.width), Math.round(r.height), ratio());
    };
    fit();

    let raf = 0;
    let last = 0;
    let onScreen = true;
    let slowFrames = 0;
    const schedule = () => {
      if (raf || !onScreen || document.visibilityState === "hidden") return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const tick = (now: number) => {
      raf = 0;
      const elapsed = now - last;
      const moving = room.update(Math.min(0.05, Math.max(0.001, elapsed / 1000)));
      room.render();
      if (!drawn.current) {
        drawn.current = true;
        callbacks.current.onReady?.();
      }
      // If the device cannot keep up, drop to the lighter pipeline once.
      if (quality === "high" && moving) {
        slowFrames = elapsed > 42 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
        if (slowFrames > 18) {
          quality = "low";
          room.setQuality("low");
          fit();
        }
      }
      if (moving) schedule();
    };
    wake.current = schedule;
    schedule();

    const resize = new ResizeObserver(() => {
      fit();
      schedule();
    });
    resize.observe(canvas);

    const seen = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      schedule();
    });
    seen.observe(canvas);

    const onVisible = () => schedule();
    document.addEventListener("visibilitychange", onVisible);

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      room.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
      schedule();
    };
    if (parallax) window.addEventListener("pointermove", onPointer, { passive: true });

    const onScroll = () => {
      const r = canvas.getBoundingClientRect();
      room.setScroll(-r.top / Math.max(1, r.height));
      schedule();
    };
    if (scrollLinked) window.addEventListener("scroll", onScroll, { passive: true });

    const onLost = (e: Event) => {
      e.preventDefault();
      callbacks.current.onFail?.();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("webglcontextlost", onLost);
      wake.current = () => undefined;
      roomRef.current = null;
      room.dispose();
      renderer.dispose();
    };
  }, [parallax, scrollLinked]);

  // Changes fade in the scene; anything set before the first frame applies at once.
  useEffect(() => {
    roomRef.current?.setState(state, !drawn.current);
    wake.current();
  }, [state]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`block h-full w-full ${className}`} />;
}
