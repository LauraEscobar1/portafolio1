"use client";

import { useEffect, useState } from "react";
import type { SectionId } from "@/lib/data";
import MarqueeCube from "../transitions/MarqueeCube";
import ParticleWord from "../transitions/ParticleWord";
import PathDraw from "../transitions/PathDraw";
import FrameGrow from "../transitions/FrameGrow";
import GlowStar from "../transitions/GlowStar";

/** Secciones que tienen animación de entrada propia. */
export const HAS_INTRO: Partial<Record<SectionId, true>> = {
  formacion: true,
  proyectos: true,
  experiencia: true,
  testimonios: true,
  contacto: true,
};

/**
 * Animación de entrada de una sección: se reproduce sola encima de la
 * sección y al terminar se desvanece. Un clic la salta.
 */
export default function SceneIntro({ id, onEnd }: { id: SectionId; onEnd: () => void }) {
  const [out, setOut] = useState(false);
  const finish = () => setOut(true);

  useEffect(() => {
    if (!out) return;
    const t = window.setTimeout(onEnd, 550);
    return () => window.clearTimeout(t);
  }, [out, onEnd]);

  useEffect(() => {
    document.documentElement.classList.add("no-scroll");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("no-scroll");
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const props = { auto: true, onDone: finish };
  return (
    <div className={`intro ${out ? "is-out" : ""}`} onClick={finish}>
      {id === "formacion" && <MarqueeCube {...props} />}
      {id === "proyectos" && <ParticleWord {...props} />}
      {id === "experiencia" && <PathDraw {...props} />}
      {id === "testimonios" && <FrameGrow {...props} />}
      {id === "contacto" && <GlowStar {...props} />}
      <button type="button" className="intro-skip" onClick={finish}>
        Saltar ›
      </button>
    </div>
  );
}
