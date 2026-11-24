"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

/**
 * Lluvia de unos y ceros (canvas). La intensidad se controla desde fuera con
 * `level.current` (0…1) para que una transición de scroll la suba y la baje
 * sin re-renderizar React. Solo se anima cuando está a la vista.
 */
export default function BinaryRain({
  level,
  color = "#5798D7",
  head = "#12263F",
  className = "",
}: {
  level: MutableRefObject<number>;
  color?: string;
  head?: string;
  className?: string;
}) {
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, fs = 16, cols = 0, rows = 0;
    let ys: Float32Array, sp: Float32Array, ln: Uint8Array, grid: Uint8Array;
    let raf = 0, last = 0, visible = false;

    const setup = () => {
      const r = canvas.getBoundingClientRect();
      const lite = window.matchMedia("(max-width: 900px), (hover: none)").matches;
      const dpr = lite ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fs = w < 600 ? 16 : 16;
      cols = Math.ceil(w / fs);
      rows = Math.ceil(h / fs) + 1;
      ys = new Float32Array(cols);
      sp = new Float32Array(cols);
      ln = new Uint8Array(cols);
      grid = new Uint8Array(cols * rows);
      for (let i = 0; i < cols; i++) {
        ys[i] = Math.random() * (rows + 20) - 20;
        sp[i] = 8 + Math.random() * 16; // celdas por segundo
        ln[i] = 6 + Math.floor(Math.random() * 16);
      }
      for (let i = 0; i < grid.length; i++) grid[i] = Math.random() < 0.5 ? 0 : 1;
    };

    const lite = window.matchMedia("(max-width: 900px), (hover: none)").matches;
    const draw = (now: number) => {
      raf = 0;
      if (lite && last && now - last < 32) {
        if (visible) raf = requestAnimationFrame(draw);
        return;
      }
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      const A = Math.max(0, Math.min(1, level.current));
      ctx.clearRect(0, 0, w, h);
      if (A > 0.005) {
        ctx.font = `600 ${fs}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        for (let c = 0; c < cols; c++) {
          if (!reduced) ys[c] += sp[c] * dt;
          if (ys[c] - ln[c] > rows) {
            ys[c] = -Math.random() * 12;
            sp[c] = 8 + Math.random() * 16;
            ln[c] = 6 + Math.floor(Math.random() * 16);
          }
          const hy = Math.floor(ys[c]);
          const x = c * fs + fs / 2;
          for (let k = 0; k < ln[c]; k++) {
            const y = hy - k;
            if (y < 0 || y >= rows) continue;
            const idx = c * rows + y;
            if (Math.random() < 0.02) grid[idx] ^= 1;
            ctx.globalAlpha = A * (k === 0 ? 1 : 0.85 * (1 - k / ln[c]));
            ctx.fillStyle = k === 0 ? head : color;
            ctx.fillText(grid[idx] ? "1" : "0", x, y * fs);
          }
        }
        ctx.globalAlpha = 1;
      }
      if (visible) raf = requestAnimationFrame(draw);
    };

    setup();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = 0;
        raf = requestAnimationFrame(draw);
      }
    });
    io.observe(canvas);
    const onResize = () => setup();
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [level, color, head]);

  return <canvas ref={cv} className={`brain ${className}`} aria-hidden="true" />;
}
