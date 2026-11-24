"use client";

import { useEffect } from "react";

/**
 * Efectos globales ligados al scroll:
 *  1. --scroll (0…1) para la barra de progreso del header.
 *  2. --vel: velocidad del scroll suavizada (inclina las marquesinas).
 *  3. Fallback de los revelados (.reveal) con IntersectionObserver cuando el
 *     navegador no soporta animation-timeline: view().
 */
export default function ScrollFx() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- progreso + velocidad ---
    let raf = 0;
    let lastY = window.scrollY;
    let vel = 0;
    const loop = () => {
      const y = window.scrollY;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      root.style.setProperty("--scroll", (y / max).toFixed(4));
      if (!reduced) {
        const target = Math.max(-10, Math.min(10, (y - lastY) * 0.25));
        vel += (target - vel) * 0.12;
        if (Math.abs(vel) < 0.01) vel = 0;
        root.style.setProperty("--vel", vel.toFixed(3));
      }
      lastY = y;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // --- revelados ---
    // .reveal usa animation-timeline: view() en CSS; si no hay soporte, IO.
    // .mark y .letters siempre se activan con IO (animaciones con retardo).
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;
    const supportsView = typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: view()");
    if (!reduced && "IntersectionObserver" in window) {
      root.classList.add("io-on");
      if (!supportsView) root.classList.add("io-reveal");
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("is-in");
              io?.unobserve(en.target);
            }
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
      );
      const sel = supportsView ? ".mark, .letters" : ".reveal, .mark, .letters";
      const scan = (root: ParentNode) => root.querySelectorAll(sel).forEach((el) => io!.observe(el));
      scan(document);
      // Las secciones se montan al entrar: observa también lo nuevo
      mo = new MutationObserver((list) => {
        list.forEach((m) => m.addedNodes.forEach((n) => n instanceof Element && (n.matches(sel) ? io!.observe(n) : scan(n))));
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      mo?.disconnect();
    };
  }, []);

  return null;
}
