"use client";

import { useRef } from "react";
import { C } from "@/lib/data";
import { range, smooth, useDrive } from "@/lib/hooks";
import { useMotionOK } from "./useMotionOK";

/**
 * Transición Testimonios → Contacto: un círculo azul marino se abre desde el
 * centro hasta cubrir la pantalla y, justo detrás, aparece Contacto.
 */
export default function GlowStar({ auto, onDone }: { auto?: boolean; onDone?: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const dark = useRef<HTMLDivElement>(null);
  const on = useMotionOK();

  useDrive(ref, (p) => {
    const c = smooth(range(p, 0, 0.92));
    if (dark.current) dark.current.style.clipPath = `circle(${(c * 75).toFixed(2)}vmax at 50% 50%)`;
  }, auto ? { duration: 1200, onDone } : undefined);

  if (!on) return null;
  return (
    <section id="viaje-contacto" ref={ref} className={`tr ${auto ? "tr--auto" : ""} tr--star`} aria-hidden="true">
      <div className="tr-sticky" style={{ background: C.pistachio }}>
        <div ref={dark} className="tr-veil" style={{ background: C.navy, clipPath: "circle(0 at 50% 50%)" }} />
      </div>
    </section>
  );
}
