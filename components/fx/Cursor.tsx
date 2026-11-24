"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor personalizado (solo con mouse): un punto y un anillo que lo sigue con
 * inercia. Crece sobre enlaces y botones y muestra una etiqueta si el elemento
 * tiene data-cursor="…". También da el efecto "magnético" a los .magnetic.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    let x = -100, y = -100, rx = -100, ry = -100;
    let raf = 0;
    let magnet: HTMLElement | null = null;
    let visible = false;

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        root.classList.add("cursor-on");
      }
      // Magnético
      const m = (e.target as HTMLElement | null)?.closest?.(".magnetic") as HTMLElement | null;
      if (magnet && magnet !== m) {
        magnet.style.setProperty("--mx", "0px");
        magnet.style.setProperty("--my", "0px");
      }
      magnet = m;
      if (m) {
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        m.style.setProperty("--mx", `${dx * 0.22}px`);
        m.style.setProperty("--my", `${dy * 0.32}px`);
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const hot = t?.closest?.("a, button, [data-cursor], label, input, textarea") as HTMLElement | null;
      const txt = hot?.getAttribute("data-cursor") || "";
      root.classList.toggle("cursor-hot", !!hot);
      root.classList.toggle("cursor-label", !!txt);
      if (label.current) label.current.textContent = txt;
    };

    const onLeave = () => {
      visible = false;
      root.classList.remove("cursor-on");
    };
    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor", "cursor-on", "cursor-hot", "cursor-label", "cursor-down");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span className="cursor-circle" />
        <span ref={label} className="cursor-text" />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
