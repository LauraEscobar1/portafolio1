"use client";

import { useRef, type CSSProperties } from "react";
import { FLY_SPOTS, TECH as TECH_ES } from "@/lib/data";
import { useData, useT } from "@/lib/i18n";
import { clamp01, easeOut, useReducedMotion, useSectionProgress, useViewportWidth } from "@/lib/hooks";

/** Parte A: las 14 tarjetas vuelan desde el fondo hacia la cámara con el scroll. */
export default function StackFly({ onPick }: { onPick: (i: number) => void }) {
  const { TECH } = useData();
  const tr = useT();
  const ref = useRef<HTMLElement>(null);
  const P = useSectionProgress(ref, "sticky");
  const vw = useViewportWidth();
  const reduced = useReducedMotion();
  const N = TECH.length;

  const k = Math.max(0.36, Math.min(1, vw / 1440)); // escala de posiciones
  const cardScale = vw < 640 ? 0.72 : vw < 1000 ? 0.86 : 1;

  const titleT = clamp01(P / 0.12);
  const subT = clamp01((P - 0.08) / 0.15);

  if (reduced) {
    return (
      <section id="stack" ref={ref} className="stack-a stack-a--static">
        <div className="wrap">
          <div className="stack-labels">
            <span>(05) — Stack</span>
            <span>{tr("Toca una tecnología", "Tap a technology")}</span>
          </div>
          <h2 className="stack-title serif">
            {tr("Lo que", "What I")} <span className="it">{tr("uso", "use")}</span>
          </h2>
          <div className="fly-grid">
            {TECH.map((t, i) => (
              <FlyCard key={t.name} t={t} onClick={() => onPick(i)} />
            ))}
          </div>
          <div className="stack-sub serif it">{tr("para construir.", "to build.")}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="stack" ref={ref} className="stack-a">
      <div className="stack-sticky">
        <div className="stack-labels">
          <span>(05) — Stack</span>
          <span>{tr("Desliza · toca una tecnología", "Scroll · tap a technology")}</span>
        </div>
        <h2
          className="stack-title serif"
          style={{ opacity: titleT, transform: `translateY(${Math.round((1 - easeOut(titleT)) * 40)}px)` }}
        >
          {tr("Lo que", "What I")} <span className="it">{tr("uso", "use")}</span>
        </h2>
        <div
          className="stack-sub serif it"
          aria-hidden="true"
          style={{ opacity: subT, transform: `translateY(${Math.round((1 - easeOut(subT)) * 40)}px)` }}
        >
          {tr("para construir.", "to build.")}
        </div>

        <div className="fly-origin">
          {TECH.map((t, i) => {
            const start = (i / (N - 1)) * 0.6;
            const t0 = clamp01((P - start) / 0.4);
            const z = -2400 + easeOut(t0) * 3000;
            const op = t0 <= 0 || t0 >= 1 ? 0 : t0 < 0.12 ? t0 / 0.12 : t0 > 0.82 ? (1 - t0) / 0.18 : 1;
            const [x, y] = FLY_SPOTS[i];
            const r = ((i % 5) - 2) * 4;
            const visible = op > 0.01;
            return (
              <FlyCard
                key={t.name}
                t={t}
                onClick={() => onPick(i)}
                hidden={!visible}
                style={{
                  opacity: op,
                  visibility: visible ? "visible" : "hidden",
                  transform: `translate3d(${Math.round(x * k)}px, ${Math.round(y * k)}px, ${Math.round(z)}px) rotate(${r}deg) scale(${cardScale})`,
                }}
              />
            );
          })}
        </div>

        <div className="stack-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${P})` }} />
        </div>
      </div>
    </section>
  );
}

function FlyCard({
  t,
  onClick,
  style,
  hidden,
}: {
  t: (typeof TECH_ES)[number];
  onClick: () => void;
  style?: CSSProperties;
  hidden?: boolean;
}) {
  const tr = useT();
  return (
    <button
      type="button"
      className="flycard"
      onClick={onClick}
      aria-label={`${tr("Ver", "View")} ${t.name}`}
      tabIndex={hidden ? -1 : undefined}
      data-cursor={tr("Ver", "View")}
      style={{ background: t.bg, color: t.fg, ...style }}
    >
      <span className="flycard-mono serif" style={{ background: t.chip, color: t.chipFg }}>
        {t.mono}
      </span>
      <span className="flycard-name">{t.name}</span>
      <span className="flycard-cat">{t.cat}</span>
    </button>
  );
}
