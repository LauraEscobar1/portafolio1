"use client";

import { useEffect, useRef } from "react";
import { C } from "@/lib/data";
import { mix, range, smooth, useDrive } from "@/lib/hooks";
import { useMotionOK } from "./useMotionOK";
import { useT } from "@/lib/i18n";

/**
 * Transición 4 (Stack → Proyectos), estilo "partículas":
 * miles de puntos dispersos se juntan hasta formar la palabra "Proyectos",
 * y luego estallan hacia la cámara mientras el fondo pasa de denim a frost.
 */
type Pt = { sx: number; sy: number; tx: number; ty: number; ex: number; ey: number; d: number; c: number };

export default function ParticleWord({ auto, onDone, word: wordProp }: { auto?: boolean; onDone?: () => void; word?: string }) {
  const tr = useT();
  const word = wordProp ?? tr("Proyectos", "Projects");
  const ref = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const pts = useRef<Pt[]>([]);
  const last = useRef(0);
  const on = useMotionOK();

  const draw = (p: number) => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const W = cv.width, H = cv.height;
    const bgT = smooth(range(p, 0.58, 0.95));
    ctx.fillStyle = mix(C.denim, C.frost, bgT);
    ctx.fillRect(0, 0, W, H);
    const g = smooth(range(p, 0.04, 0.48));
    const e = smooth(range(p, 0.62, 1));
    const unit = Math.min(W * 0.42, H * 0.9);
    const cols = [mix(C.frost, C.navy, bgT), C.pistachio, mix(C.navy, C.denim, bgT)];
    const dpr = W / (cv.clientWidth || W);
    for (let c = 0; c < 3; c++) {
      ctx.fillStyle = cols[c];
      ctx.globalAlpha = Math.max(0, 1 - e * 1.05);
      ctx.beginPath();
      for (const q of pts.current) {
        if (q.c !== c) continue;
        const wob = (1 - g) * 0.02 * Math.sin(p * 30 + q.d * 20);
        let x = q.sx + (q.tx - q.sx) * g + wob;
        let y = q.sy + (q.ty - q.sy) * g;
        const k = 1 + e * (1.5 + q.d * 4);
        x = x * k + q.ex * e * 0.6;
        y = y * k + q.ey * e * 0.6;
        const r = (1.9 + q.d * 1.5 + e * q.d * 5) * dpr;
        ctx.rect(W / 2 + x * unit - r / 2, H / 2 + y * unit - r / 2, r, r);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  // Muestrea la palabra en un canvas oculto
  useEffect(() => {
    if (!on) return;
    const build = () => {
      const off = document.createElement("canvas");
      off.width = 1400;
      off.height = 420;
      const o = off.getContext("2d");
      if (!o) return;
      const family = getComputedStyle(document.body).getPropertyValue("--serif") || '"Bodoni Moda", serif';
      o.font = `italic 500 300px ${family}`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      let size = 300;
      while (o.measureText(word).width > 1300 && size > 80) {
        size -= 10;
        o.font = `italic 500 ${size}px ${family}`;
      }
      o.fillStyle = "#000";
      o.fillText(word, 700, 215);
      const data = o.getImageData(0, 0, 1400, 420).data;
      const step = window.innerWidth < 760 ? 10 : window.matchMedia("(hover: none)").matches ? 9 : 5;
      const out: Pt[] = [];
      let seed = 7;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let y = 0; y < 420; y += step)
        for (let x = 0; x < 1400; x += step)
          if (data[(y * 1400 + x) * 4 + 3] > 120) {
            const a = rnd() * Math.PI * 2, rad = 0.6 + rnd() * 1.4;
            out.push({
              tx: (x - 700) / 700,
              ty: (y - 215) / 700,
              sx: Math.cos(a) * rad * 1.6,
              sy: Math.sin(a) * rad,
              ex: Math.cos(a) * (0.5 + rnd()),
              ey: Math.sin(a) * (0.5 + rnd()),
              d: rnd(),
              c: rnd() < 0.62 ? 0 : rnd() < 0.5 ? 1 : 2,
            });
          }
      pts.current = out;
      draw(last.current);
    };
    const size = () => {
      const cv = canvas.current;
      if (!cv) return;
      const dpr = window.matchMedia("(max-width: 900px), (hover: none)").matches ? 1 : Math.min(1.5, window.devicePixelRatio || 1);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      draw(last.current);
    };
    size();
    build();
    document.fonts?.ready.then(build);
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, word]);

  useDrive(ref, (p) => {
    last.current = p;
    draw(p);
  }, auto ? { duration: 3000, onDone } : undefined);

  if (!on) return null;
  return (
    <section id="viaje-proyectos" ref={ref} className={`tr ${auto ? "tr--auto" : ""} tr--particles`} aria-hidden="true">
      <div className="tr-sticky">
        <canvas ref={canvas} className="pw-canvas" />
      </div>
    </section>
  );
}
