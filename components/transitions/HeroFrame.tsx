"use client";

import { useRef, type ReactNode } from "react";
import { C } from "@/lib/data";
import { mix, range, smooth, useScrub } from "@/lib/hooks";
import { useMotionOK } from "./useMotionOK";
import BinaryRain from "../fx/BinaryRain";
import { useLang } from "@/lib/i18n";

/**
 * Transición Hero → Sobre mí: al bajar, el hero se encoge en una ventana,
 * aparecen tarjetitas flotando alrededor y la ventana se desvanece en una
 * lluvia de unos y ceros que lleva directo a Sobre mí.
 */
const makeFloats = (en: boolean): { x: number; y: number; fx: number; fy: number; cls: string; body: ReactNode }[] => [
  {
    x: -34, y: -21, fx: -70, fy: -40, cls: "hf-code",
    body: (
      <>
        <span className="hf-code-bar"><i /><i /><i /><em>{en ? "about-me.ts" : "sobre-mi.ts"}</em></span>
        <code>
          <span><b>const</b> {en ? "me" : "yo"} = {"{"}</span>
          <span>&nbsp;&nbsp;{en ? "curious" : "curiosa"}: <u>true</u>,</span>
          <span>&nbsp;&nbsp;{en ? "learns" : "aprende"}: <s>&quot;{en ? "out loud" : "en voz alta"}&quot;</s>,</span>
          <span>&nbsp;&nbsp;{en ? "creates" : "crea"}: <s>&quot;{en ? "every day" : "cada día"}&quot;</s>,</span>
          <span>{"}"};</span>
        </code>
      </>
    ),
  },
  { x: 33, y: -23, fx: 70, fy: -50, cls: "hf-note", body: (<span className="serif it">{en ? <>“If I can explain it,<br />I can build it.”</> : <>“Si lo puedo explicar,<br />lo puedo construir.”</>}</span>) },
  {
    x: -35, y: 23, fx: -80, fy: 40, cls: "hf-commit",
    body: (<><span className="hf-commit-dot" /><span><small>git commit</small><b>{en ? "feat: from idea to product" : "feat: de idea a producto"}</b></span></>),
  },
  {
    x: 34, y: 22, fx: 80, fy: 30, cls: "hf-cursor",
    body: (
      <>
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2l7 19 2.5-7.5L20 11z" fill="#5798D7" stroke="#12263F" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        <span>{en ? "Laura is designing…" : "Laura está diseñando…"}</span>
      </>
    ),
  },
  { x: -14, y: 39, fx: -20, fy: 80, cls: "hf-toast", body: (<><span className="hf-check">✓</span> {en ? "0 errors · build passing" : "0 errores · todo compila"}</>) },
  { x: 16, y: 39, fx: 30, fy: 80, cls: "hf-toggle", body: (<><span>{en ? "Creative mode" : "Modo creativo"}</span><span className="hf-switch"><i /></span></>) },
];

export default function HeroFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const floats = useRef<(HTMLDivElement | null)[]>([]);
  const rain = useRef(0);
  const lite = typeof window !== "undefined" && window.matchMedia("(max-width: 900px), (hover: none)").matches;
  const { lang } = useLang();
  const FLOATS = makeFloats(lang === "en");
  const on = useMotionOK("(max-width: 760px)");

  useScrub(
    ref,
    (p) => {
      const f = frame.current, s = stage.current;
      if (!f || !s) return;
      if (!on) {
        f.style.transform = "";
        f.style.borderRadius = "";
        s.style.background = "";
        return;
      }
      const a = smooth(range(p, 0.06, 0.6));
      const b = smooth(range(p, 0.62, 1));
      const scale = 1 - 0.36 * a - 0.2 * b;
      f.style.transform = `translateY(${(-b * 18).toFixed(2)}vh) scale(${scale.toFixed(4)})`;
      f.style.opacity = String(1 - b);
      if (!lite) f.style.filter = b > 0.01 ? `blur(${(b * 10).toFixed(1)}px)` : "";
      rain.current = smooth(range(p, 0.5, 0.82)) * (1 - 0.45 * range(p, 0.9, 1));
      f.style.borderRadius = `${(a * 36) / scale}px`;
      f.style.boxShadow = a > 0 ? `0 ${40 * a}px ${90 * a}px rgba(18,38,63,${0.28 * a})` : "";
      s.style.background = b > 0 ? mix(C.denim, C.frost, b) : mix(C.frost, C.denim, a);
      floats.current.forEach((el, i) => {
        if (!el) return;
        const d = FLOATS[i];
        const t = smooth(range(p, 0.16 + i * 0.03, 0.46 + i * 0.03));
        const x = d.x + (1 - t) * d.fx + b * d.fx * 0.6;
        const y = d.y + (1 - t) * d.fy - b * 60;
        el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(2)}vw, ${y.toFixed(2)}vh) rotate(${((1 - t) * (i % 2 ? 14 : -14)).toFixed(1)}deg)`;
        el.style.opacity = String(Math.min(t, 1 - b * 1.4));
      });
    },
    () => (on ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hh")) || 74 : 0)
  );

  return (
    <div ref={ref} id="inicio" className={`hf ${on ? "" : "hf--off"}`}>
      <div className="hf-sticky" ref={stage}>
        {on && <BinaryRain level={rain} className="hf-rain" />}
        <div className="hf-frame" ref={frame}>
          {children}
        </div>
        {on &&
          FLOATS.map((d, i) => (
            <div key={i} ref={(el) => { floats.current[i] = el; }} className={`hf-float ${d.cls}`} aria-hidden="true" style={{ opacity: 0 }}>
              {d.body}
            </div>
          ))}
      </div>
    </div>
  );
}
