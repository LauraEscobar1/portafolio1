"use client";

import { useRef } from "react";
import { C } from "@/lib/data";
import { range, useDrive } from "@/lib/hooks";
import { useMotionOK } from "./useMotionOK";
import { useT } from "@/lib/i18n";

/**
 * Transición 3 (Fuera de la pantalla → Formación), estilo "texto gigante + caja 3D":
 * una frase enorme pasa de lado a lado mientras una caja gira en el centro
 * mostrando en cada cara un dato de tu formación.
 */
const WORDS = ["aprender", "programar", "construir", "diseñar", "explicar", "crecer"];
const WORDS_EN = ["learn", "code", "build", "design", "explain", "grow"];

export default function MarqueeCube({ auto, onDone }: { auto?: boolean; onDone?: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const cube = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const on = useMotionOK();
  const t = useT();
  const W = t(WORDS, WORDS_EN);

  useDrive(ref, (p) => {
    const t = text.current;
    if (!t) return;
    const travel = Math.max(0, t.scrollWidth - window.innerWidth * 0.4);
    t.style.transform = `translate3d(${(window.innerWidth * 0.55 - p * (travel + window.innerWidth * 0.3)).toFixed(1)}px, -50%, 0)`;
    if (cube.current) {
      const enter = range(p, 0, 0.15);
      cube.current.style.transform = `translateY(${((1 - enter) * 40 + Math.sin(p * Math.PI * 3) * 10).toFixed(1)}px) rotateX(-12deg) rotateY(${(-25 + p * 450).toFixed(1)}deg)`;
      cube.current.style.opacity = String(enter * (1 - range(p, 0.9, 1)));
    }
    if (veil.current) veil.current.style.opacity = String(range(p, 0.88, 1));
  }, auto ? { duration: 3000, onDone } : undefined);

  if (!on) return null;
  return (
    <section id="viaje-formacion" ref={ref} className={`tr ${auto ? "tr--auto" : ""} tr--cube`} aria-hidden="true">
      <div className="tr-sticky" style={{ background: C.white }}>
        <div ref={text} className="mc-text serif">
          {[...W, ...W].map((w, i) => (
            <span key={i} className={i % 2 ? "it mc-it" : ""}>
              {w} <span className="mc-sep">·</span>{" "}
            </span>
          ))}
        </div>
        <div className="mc-scene">
          <div ref={cube} className="mc-cube" style={{ opacity: 0 }}>
            <div className="mc-face mc-front">
              <small>{t("En curso", "In progress")}</small>
              <b className="serif">{t("5.º", "5th")}</b>
              <span>{t("semestre de Ingeniería de Software", "semester of Software Engineering")}</span>
            </div>
            <div className="mc-face mc-right">
              <small>{t("Universidad", "University")}</small>
              <b className="serif it">UCC</b>
              <span>Cooperativa de Colombia</span>
            </div>
            <div className="mc-face mc-back">
              <small>{t("Proyectos", "Projects")}</small>
              <b className="serif it">{t("Reales", "Real")}</b>
              <span>{t("del aula a producción, con personas reales", "from the classroom to production, with real people")}</span>
            </div>
            <div className="mc-face mc-left">
              <small>{t("Idiomas", "Languages")}</small>
              <b className="serif it">B1</b>
              <span>{t("inglés para leer documentación técnica", "English to read technical documentation")}</span>
            </div>
            <div className="mc-face mc-top" />
            <div className="mc-face mc-bottom" />
          </div>
          <div className="mc-shadow" />
        </div>
        <div ref={veil} className="tr-veil" style={{ background: C.frost, opacity: 0 }} />
      </div>
    </section>
  );
}
