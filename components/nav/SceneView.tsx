"use client";

import { type SectionId } from "@/lib/data";
import { useData, useT } from "@/lib/i18n";
import { useNav } from "@/lib/nav";
import About from "../About";
import Offscreen from "../Offscreen";
import Education from "../Education";
import StackFly from "../StackFly";
import Projects from "../Projects";
import Experience from "../Experience";
import Testimonials from "../Testimonials";
import Contact from "../Contact";
import Footer from "../Footer";
import { CardArt } from "./HubCard";

/** Muestra una sola sección, con la salida al inicio y a las secciones vecinas. */
export default function SceneView({ id, onPickTech }: { id: SectionId; onPickTech: (i: number) => void }) {
  const { go, home, mode } = useNav();
  const { SECTIONS } = useData();
  const t = useT();
  const i = SECTIONS.findIndex((s) => s.id === id);
  const prev = SECTIONS[(i - 1 + SECTIONS.length) % SECTIONS.length];
  const next = SECTIONS[(i + 1) % SECTIONS.length];
  const homeLabel = mode === "tower" ? t("Volver a la torre", "Back to the tower") : t("Volver al inicio", "Back to home");

  return (
    <div className={`scene scene--${id}`} style={{ background: SECTIONS[i].bg }}>
      {mode === "tower" && (
        <div className="tower-bar">
          <button type="button" className="tower-back" onClick={home}>
            ← {homeLabel}
          </button>
          <span className="tower-bar-t serif it">{SECTIONS[i].label}</span>
          <span className="tower-bar-logo serif">
            LE<span className="it">.</span>
          </span>
        </div>
      )}

      {id === "sobre-mi" && <About />}
      {id === "fuera" && <Offscreen />}
      {id === "formacion" && <Education />}
      {id === "stack" && <StackFly onPick={onPickTech} />}
      {id === "proyectos" && <Projects />}
      {id === "experiencia" && <Experience />}
      {id === "testimonios" && <Testimonials />}
      {id === "contacto" && <Contact />}

      <nav className="scene-nav" aria-label={t("Seguir explorando", "Keep exploring")}>
        <button type="button" className="scene-nav-card" onClick={(e) => go(prev.id, e.currentTarget)} style={{ background: prev.card, color: prev.cardFg }}>
          <small>{t("← Anterior", "← Previous")}</small>
          <span className="serif it">{prev.label}</span>
        </button>
        <button type="button" className="scene-nav-home" onClick={home}>
          {homeLabel}
        </button>
        <button type="button" className="scene-nav-card scene-nav-card--next" onClick={(e) => go(next.id, e.currentTarget)} style={{ background: next.card, color: next.cardFg }}>
          <small>{t("Siguiente →", "Next →")}</small>
          <span className="serif it">{next.label}</span>
          <CardArt id={next.id} />
        </button>
      </nav>
      {id === "contacto" && <Footer />}
    </div>
  );
}
