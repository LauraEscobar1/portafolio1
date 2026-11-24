"use client";

import { Fragment, useRef, useState, type PointerEvent } from "react";
import { clamp01, easeOut, pointerIn, useReducedMotion, useSectionProgress } from "@/lib/hooks";
import { useData, useT } from "@/lib/i18n";

const LEAD = "Me mueve el punto exacto donde el código se vuelve experiencia.";
const LEAD_EN = "I'm driven by the exact point where code becomes experience.";
const BODY_EN =
  "I'm a fifth-semester Software Engineering student at Universidad Cooperativa de Colombia. I focus on web and mobile app development, interface design and artificial intelligence, and I enjoy every stage: understanding the problem, designing the solution and writing the code that makes it real.";
const BODY =
  "Soy estudiante de Ingeniería de Software en quinto semestre en la Universidad Cooperativa de Colombia. Me enfoco en el desarrollo de aplicaciones web y móviles, el diseño de interfaces y la inteligencia artificial, y disfruto cada etapa: entender el problema, diseñar la solución y escribir el código que la hace real.";

/**
 * SOBRE MÍ — el Memoji de Laura con su portátil, recortado como sticker sobre
 * un arco azul con un aura suave. El texto se enciende palabra por palabra.
 */
export default function About() {
  const sec = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const { SITE } = useData();
  const t = useT();
  const [m, setM] = useState({ px: 0, py: 0 });
  const reduced = useReducedMotion();
  const raw = useSectionProgress(sec, "enter");
  const p = reduced ? 1 : raw;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!card.current) return;
    setM(pointerIn(e, card.current));
  };
  const onLeave = () => setM({ px: 0, py: 0 });

  const layer = (depth: number) => `translate(${m.px * depth}px, ${m.py * depth}px)`;

  // Entrada del retrato
  const e = easeOut(clamp01(p / 0.55));

  // Texto que se enciende palabra por palabra
  const words = t(LEAD, LEAD_EN).split(" ");
  const lit = (i: number) => clamp01((p - 0.35 - (i / words.length) * 0.35) / 0.08);

  return (
    <section id="sobre-mi" ref={sec} className="about wrap">
      <div className="eyebrow reveal">(02) — {t("Sobre mí", "About me")}</div>
      <div className="about-grid">
        <div
          ref={card}
          className="ab-portrait"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          data-cursor={t("Hola", "Hi")}
          style={{ opacity: Math.min(1, e * 1.4), transform: `translateY(${((1 - e) * 60).toFixed(1)}px) scale(${(0.92 + 0.08 * e).toFixed(3)})` }}
        >
          <div className="ab-aura" aria-hidden="true" style={{ transform: layer(-10) }} />
          <div className="ab-memo" style={{ transform: `translateX(-50%) translate(${(m.px * 10).toFixed(1)}px, ${(m.py * 6).toFixed(1)}px) rotate(${(m.px * 2).toFixed(2)}deg)` }}>
            <img src="/memoji-laptop.webp" alt={t("Memoji de Laura Escobar con su portátil", "Laura Escobar's Memoji with her laptop")} width={736} height={912} />
          </div>
        </div>

        <div className="about-copy">
          <p className="about-lead serif">
            {t("Hola, soy", "Hi, I'm")} <span className="it accent">{SITE.name}</span>.{" "}
            {words.map((w, i) => (
              <Fragment key={i}>
                <span
                  className={`lit ${w.startsWith("experiencia") || w.startsWith("experience") ? "lit-mark" : ""} ${w === "código" || w === "code" ? "it" : ""}`}
                  style={{ opacity: 0.18 + 0.82 * lit(i), ["--k" as string]: lit(i) }}
                >
                  {w}
                </span>{" "}
              </Fragment>
            ))}
          </p>
          <p className="about-body reveal">{t(BODY, BODY_EN)}</p>
        </div>
      </div>
    </section>
  );
}
