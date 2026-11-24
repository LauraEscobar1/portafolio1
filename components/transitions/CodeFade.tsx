"use client";

import { useEffect, useRef } from "react";
import BinaryRain from "../fx/BinaryRain";

/**
 * Transición suave entre dos secciones: el color se desvanece de una a otra
 * mientras cae una lluvia de unos y ceros que se intensifica en el medio.
 */
export default function CodeFade({
  from,
  to,
  color = "#5798D7",
  head = "#12263F",
}: {
  from: string;
  to: string;
  color?: string;
  head?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const level = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const q = Math.max(0, Math.min(1, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
      level.current = Math.sin(q * Math.PI) * 0.95;
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
  }, []);

  return (
    <div ref={ref} className="codefade" style={{ background: `linear-gradient(180deg, ${from} 0%, ${from} 12%, ${to} 88%, ${to} 100%)` }} aria-hidden="true">
      <BinaryRain level={level} color={color} head={head} />
    </div>
  );
}
