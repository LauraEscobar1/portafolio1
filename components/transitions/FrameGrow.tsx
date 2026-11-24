"use client";

import { useRef } from "react";
import { C } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { range, smooth, useDrive } from "@/lib/hooks";
import { useMotionOK } from "./useMotionOK";

/**
 * Transición 6 (Experiencia → Testimonios), estilo "ventana que crece":
 * una ventana pistacho aparece pequeña en el centro, rodeada de burbujas de
 * comillas, y crece hasta ocupar toda la pantalla.
 */
const BUBBLES = [
  { x: -30, y: -22, r: -6, w: 230 },
  { x: 31, y: -18, r: 5, w: 200 },
  { x: -34, y: 20, r: 4, w: 210 },
  { x: 28, y: 24, r: -4, w: 240 },
  { x: 0, y: -36, r: 2, w: 180 },
];

export default function FrameGrow({ auto, onDone }: { auto?: boolean; onDone?: () => void }) {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const bubbles = useRef<(HTMLDivElement | null)[]>([]);
  const on = useMotionOK();

  useDrive(ref, (p) => {
    const c = card.current;
    if (!c) return;
    const a = smooth(range(p, 0, 0.25));
    const g = smooth(range(p, 0.3, 0.92));
    const s = (0.28 + 0.06 * a) + (1 - 0.34) * g;
    c.style.transform = `translate(-50%, -50%) scale(${(a * s).toFixed(4)}) rotate(${((1 - g) * -3).toFixed(2)}deg)`;
    c.style.borderRadius = `${((40 * (1 - g)) / Math.max(0.2, s)).toFixed(1)}px`;
    bubbles.current.forEach((b, i) => {
      if (!b) return;
      const d = BUBBLES[i];
      const t = smooth(range(p, 0.05 + i * 0.04, 0.3 + i * 0.04));
      const out = 1 + g * 1.6;
      b.style.transform = `translate(-50%, -50%) translate(${(d.x * out).toFixed(2)}vw, ${(d.y * out + (1 - t) * 20).toFixed(2)}vh) rotate(${d.r}deg) scale(${(0.8 + 0.2 * t).toFixed(3)})`;
      b.style.opacity = String(Math.max(0, Math.min(t, 1 - g * 1.5)));
    });
    if (title.current) {
      title.current.style.opacity = String(Math.min(range(p, 0.1, 0.3), 1 - range(p, 0.75, 0.9)));
      title.current.style.transform = `translate(-50%, -50%) scale(${(0.9 + g * 0.4).toFixed(3)})`;
    }
  }, auto ? { duration: 2300, onDone } : undefined);

  if (!on) return null;
  return (
    <section id="viaje-testimonios" ref={ref} className={`tr ${auto ? "tr--auto" : ""} tr--grow`} aria-hidden="true">
      <div className="tr-sticky" style={{ background: C.white }}>
        <div ref={card} className="fg-card" style={{ background: C.pistachio, transform: "translate(-50%,-50%) scale(0)" }} />
        {BUBBLES.map((d, i) => (
          <div key={i} ref={(el) => { bubbles.current[i] = el; }} className="fg-bubble" style={{ width: d.w, opacity: 0 }}>
            <span className="fg-q serif it">{i % 2 ? "”" : "“"}</span>
            <span className="fg-line" style={{ width: "88%" }} />
            <span className="fg-line" style={{ width: "70%" }} />
            <span className="fg-who">
              <span className="fg-av" />
              <span className="fg-line" style={{ width: 70 }} />
            </span>
          </div>
        ))}
        <div ref={title} className="fg-title serif" style={{ opacity: 0 }}>
          Testi<span className="it">{t("monios", "monials")}</span>
        </div>
      </div>
    </section>
  );
}
