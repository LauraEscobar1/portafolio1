"use client";

import { useRef } from "react";
import { useData, useT } from "@/lib/i18n";
import { clamp01, easeOut, useReducedMotion, useSectionProgress } from "@/lib/hooks";

/**
 * Experiencia: un resumen general de lo que sabes hacer (por áreas y
 * tecnologías).
 */
export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const { EXPERIENCE_AREAS, EXPERIENCE_INTRO } = useData();
  const tt = useT();
  const t = tt;
  const reduced = useReducedMotion();
  const lite = typeof window !== "undefined" && window.matchMedia("(max-width: 900px), (hover: none)").matches;
  const raw = useSectionProgress(ref, "enter");
  const E = reduced ? 1 : raw;

  const a = clamp01(E / 0.35);
  const g = clamp01((E - 0.3) / 0.25);
  const rise = (t: number) => ({
    opacity: t,
    transform: `translateY(${Math.round((1 - easeOut(t)) * 40)}px)`,
  });

  return (
    <section id="experiencia" ref={ref} className="experience">
      <div className="wrap">
        <div className="eyebrow center" style={{ opacity: a }}>
          (07) — {t("Experiencia", "Experience")}
        </div>
        <h2 className="exp-title serif">
          <span
            className="exp-glow it"
            style={{
              opacity: g,
              filter: lite ? undefined : `blur(${((1 - g) * 14).toFixed(1)}px)`,
              textShadow: `0 0 ${Math.round(g * 40)}px rgba(185,194,85,.9)`,
              letterSpacing: `${(-0.03 + (1 - g) * 0.12).toFixed(3)}em`,
            }}
          >
            {t("Experiencia", "Experience")}
          </span>{" "}
          <span className="exp-sub" style={{ opacity: a }}>
            {t("en cada capa", "in every layer")}
          </span>
        </h2>
        <p className="exp-intro" style={{ opacity: a }}>
          {EXPERIENCE_INTRO}
        </p>

        <ol className="exp-areas">
          {EXPERIENCE_AREAS.map((x, k) => {
            const t = clamp01((E - 0.45 - k * 0.05) / 0.25);
            return (
              <li key={x.title} className="exp-area" style={rise(t)}>
                <span className="exp-area-n serif it">{String(k + 1).padStart(2, "0")}</span>
                <div className="exp-area-main">
                  <h3 className="serif">{x.title}</h3>
                  <p>{x.text}</p>
                </div>
                <ul className="exp-tools" aria-label={tt("Tecnologías", "Technologies")}>
                  {x.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>

      </div>
    </section>
  );
}
