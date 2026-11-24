"use client";

import { useEffect, useRef, useState } from "react";
import { C } from "@/lib/data";
import { range, useDrive } from "@/lib/hooks";
import { useMotionOK } from "./useMotionOK";
import { useLang } from "@/lib/i18n";

/**
 * Transición 5 (Proyectos → Experiencia), estilo "línea que se dibuja":
 * una línea gruesa recorre la pantalla mientras bajas y va encendiendo
 * los pasos de cómo trabajas (tomados de tu texto de "Sobre mí").
 */
const D =
  "M 260 -80 C 260 260, 1180 180, 1180 560 S 260 820, 300 1180 S 1220 1420, 1160 1780 S 380 2060, 720 2520";
const STEPS = [
  { f: 0.2, t: "Entender", s: "el problema" },
  { f: 0.44, t: "Diseñar", s: "la solución" },
  { f: 0.67, t: "Construir", s: "el código que la hace real" },
  { f: 0.88, t: "Explicar", s: "con claridad, aprender en voz alta" },
];
const STEPS_EN = [
  { t: "Understand", s: "the problem" },
  { t: "Design", s: "the solution" },
  { t: "Build", s: "the code that makes it real" },
  { t: "Explain", s: "clearly, learning out loud" },
];

export default function PathDraw({ auto, onDone }: { auto?: boolean; onDone?: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const main = useRef<SVGPathElement>(null);
  const tint = useRef<HTMLDivElement>(null);
  const len = useRef(1);
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  const nodes = useRef<(SVGGElement | null)[]>([]);
  const on = useMotionOK();
  const { lang } = useLang();
  const label = (i: number) => (lang === "en" ? STEPS_EN[i] : STEPS[i]);

  useEffect(() => {
    if (!on || !main.current) return;
    len.current = main.current.getTotalLength();
    setPts(STEPS.map((s) => {
      const q = main.current!.getPointAtLength(len.current * s.f);
      return { x: q.x, y: q.y };
    }));
  }, [on]);

  useDrive(ref, (p) => {
    const path = main.current, el = svg.current;
    if (!path || !el) return;
    const d = range(p, 0.02, 0.96);
    const L = len.current;
    path.style.strokeDasharray = `${L}`;
    path.style.strokeDashoffset = `${L * (1 - d)}`;
    const head = path.getPointAtLength(L * d);
    const k = el.clientWidth / 1440;
    const vh = window.innerHeight;
    const maxShift = 2400 * k - vh;
    const shift = Math.max(0, Math.min(maxShift, head.y * k - vh * 0.72));
    el.style.transform = `translate3d(0, ${(-shift).toFixed(1)}px, 0)`;
    nodes.current.forEach((n, i) => n?.classList.toggle("is-on", d >= STEPS[i].f - 0.005));
    if (tint.current) tint.current.style.opacity = String(1 - range(p, 0, 0.2));
  }, auto ? { duration: 3400, onDone } : undefined);

  if (!on) return null;
  return (
    <section id="viaje-experiencia" ref={ref} className={`tr ${auto ? "tr--auto" : ""} tr--path`} aria-hidden="true">
      <div className="tr-sticky" style={{ background: C.white }}>
        <div ref={tint} className="tr-veil" style={{ background: C.frost }} />
        <svg ref={svg} className="pd-svg" viewBox="0 0 1440 2400" preserveAspectRatio="xMidYMin meet">
          <path d={D} className="pd-ghost" />
          <path d={D} className="pd-echo" transform="translate(22 14)" />
          <path ref={main} d={D} className="pd-main" />
          {pts.map((q, i) => {
            const right = q.x < 720;
            return (
              <g key={i} ref={(el) => { nodes.current[i] = el; }} className="pd-node">
                <circle cx={q.x} cy={q.y} r="30" />
                <text x={q.x} y={q.y + 8} textAnchor="middle" className="pd-num">
                  0{i + 1}
                </text>
                <g className="pd-label" transform={`translate(${q.x + (right ? 70 : -70)} ${q.y - 6})`}>
                  <text textAnchor={right ? "start" : "end"} className="pd-t serif">
                    {label(i).t}
                  </text>
                  <text textAnchor={right ? "start" : "end"} y="48" className="pd-s">
                    {label(i).s}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
