"use client";

import { RefObject, useEffect, useRef, useState } from "react";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** true si el usuario pidió reducir el movimiento. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Ancho de la ventana (para escalar posiciones 3D en móvil). */
export function useViewportWidth(initial = 1440) {
  const [w, setW] = useState(initial);
  useEffect(() => {
    const update = () => setW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return w;
}

/**
 * Progreso de una sección según el scroll, medido con getBoundingClientRect
 * dentro de requestAnimationFrame (listener pasivo).
 *  - "sticky": 0 cuando la sección toca el borde superior, 1 cuando el sticky termina.
 *  - "enter":  0 cuando la sección asoma por abajo, 1 cuando llega arriba.
 *  - "exit":   0 con la sección arriba del todo, 1 cuando ya salió por arriba.
 */
export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
  mode: "sticky" | "enter" | "exit",
  initial = 0
) {
  const [p, setP] = useState(initial);
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const measure = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const H = window.innerHeight;
      let v: number;
      if (mode === "sticky") {
        const stickyH = Math.min(H, 960);
        v = clamp01(-r.top / Math.max(1, r.height - stickyH));
      } else if (mode === "enter") {
        v = clamp01((H - r.top) / (H * 0.95));
      } else {
        v = clamp01(-r.top / Math.max(1, r.height));
      }
      if (v !== last && (Math.abs(v - last) > 0.0015 || v === 0 || v === 1)) {
        last = v;
        setP(v);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, mode]);
  return p;
}

/** Posición normalizada del puntero dentro de un elemento (-0.5 … 0.5). */
export function pointerIn(e: { clientX: number; clientY: number }, el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return { px: (e.clientX - r.left) / r.width - 0.5, py: (e.clientY - r.top) / r.height - 0.5 };
}

export const smooth = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** Mezcla dos colores hex (#RRGGBB). */
export function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const k = clamp01(t);
  const ch = (s: number) => Math.round(((pa >> s) & 255) + (((pb >> s) & 255) - ((pa >> s) & 255)) * k);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

/**
 * Progreso (0…1) de una sección "pin" (contenedor alto + hijo sticky),
 * suavizado con inercia. Llama a onFrame en cada cuadro sin re-renderizar React.
 * topOffset: px del sticky respecto al borde superior (p. ej. el header).
 */
export function useScrub(
  ref: RefObject<HTMLElement | null>,
  onFrame: (p: number) => void,
  topOffset: () => number = () => 0
) {
  const cb = useRef(onFrame);
  cb.current = onFrame;
  const off = useRef(topOffset);
  off.current = topOffset;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let target = 0, cur = 0, raf = 0;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const o = off.current();
      const stickyH = window.innerHeight - o;
      target = clamp01(-(r.top - o) / Math.max(1, r.height - stickyH));
    };
    const frame = () => {
      cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      cb.current(cur);
      raf = cur !== target ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(frame);
    };
    measure();
    cur = target;
    cb.current(cur);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}

/**
 * Igual que useScrub, pero si `auto` viene definido la animación no depende
 * del scroll: avanza sola de 0 a 1 en `auto.duration` ms y luego llama a onDone.
 * Se usa para las animaciones de entrada de cada sección.
 */
export function useDrive(
  ref: RefObject<HTMLElement | null>,
  onFrame: (p: number) => void,
  auto?: { duration: number; onDone?: () => void }
) {
  const cb = useRef(onFrame);
  cb.current = onFrame;
  const done = useRef(auto?.onDone);
  done.current = auto?.onDone;
  const isAuto = !!auto;
  const duration = auto?.duration ?? 0;

  useEffect(() => {
    if (!isAuto) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      cb.current(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else done.current?.();
    };
    cb.current(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isAuto, duration]);

  useScrub(ref, (p) => {
    if (!isAuto) cb.current(p);
  });
}
