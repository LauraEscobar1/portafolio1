"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { C, SECTIONS, type SectionId } from "@/lib/data";
import { LangProvider, LangToggle, useData, useT } from "@/lib/i18n";
import { NavContext, type NavApi } from "@/lib/nav";
import Preloader from "./fx/Preloader";
import Cursor from "./fx/Cursor";
import ScrollFx from "./fx/ScrollFx";
import Header from "./Header";
import TechModal from "./TechModal";
import Hero from "./Hero";
import About from "./About";
import Offscreen from "./Offscreen";
import Education from "./Education";
import StackFly from "./StackFly";
import Projects from "./Projects";
import Experience from "./Experience";
import Testimonials from "./Testimonials";
import Contact from "./Contact";
import Footer from "./Footer";
import HeroFrame from "./transitions/HeroFrame";
import MarqueeCube from "./transitions/MarqueeCube";
import ParticleWord from "./transitions/ParticleWord";
import PathDraw from "./transitions/PathDraw";
import GlowStar from "./transitions/GlowStar";
import CodeFade from "./transitions/CodeFade";
import Seam from "./Seam";
import TowerHub from "./nav/TowerHub";
import SceneView from "./nav/SceneView";
import SceneIntro, { HAS_INTRO } from "./nav/SceneIntro";

const isSection = (id: string): id is SectionId => SECTIONS.some((s) => s.id === id);

/**
 * Raíz del portafolio. No es una página larga: hay un "inicio" (el hero que
 * se abre en tarjetas, o la torre en la otra versión) y desde ahí se entra y
 * se sale de cada sección con un portal animado.
 */
export default function Portfolio({ mode = "hero" }: { mode?: "hero" | "tower" }) {
  return (
    <LangProvider>
      <PortfolioInner mode={mode} />
    </LangProvider>
  );
}

function PortfolioInner({ mode }: { mode: "hero" | "tower" }) {
  const { TECH } = useData();
  const t = useT();
  const [ready, setReady] = useState(false);
  const [sel, setSel] = useState(-1);
  const [scene, setScene] = useState<SectionId | null>(null);
  const [intro, setIntro] = useState<SectionId | null>(null);
  const portal = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const reduced = useRef(false);
  const closeTech = useCallback(() => setSel(-1), []);
  const onReady = useCallback(() => setReady(true), []);
  const endIntro = useCallback(() => setIntro(null), []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.toggle("mode-tower", mode === "tower");
  }, [mode]);

  /** Muestra una escena sin animación (para el botón "atrás" del navegador). */
  const show = useCallback((id: SectionId | null) => {
    setScene(id);
    setIntro(null);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const go = useCallback(
    (id: SectionId, from?: Element | null) => {
      if (busy.current) return;
      const s = SECTIONS.find((x) => x.id === id)!;
      const el = portal.current;
      const enter = () => {
        setScene(id);
        setIntro(!reduced.current && HAS_INTRO[id] ? id : null);
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
      };
      if (!el || reduced.current) {
        enter();
        return;
      }
      busy.current = true;
      const r = from?.getBoundingClientRect() ?? new DOMRect(innerWidth / 2 - 60, innerHeight / 2 - 40, 120, 80);
      el.style.display = "block";
      el.style.background = s.enter;
      el.style.opacity = "1";
      const tilt = mode === "tower" ? 10 : 4;
      const grow = el.animate(
        [
          { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, borderRadius: "22px", transform: "rotate(0deg)" },
          { left: `${r.left - 40}px`, top: `${r.top - 60}px`, width: `${r.width * 1.35}px`, height: `${r.height * 1.35}px`, borderRadius: "26px", transform: `rotate(${tilt}deg)`, offset: 0.35 },
          { left: "0px", top: "0px", width: "100vw", height: "100vh", borderRadius: "0px", transform: "rotate(0deg)" },
        ],
        { duration: 820, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" }
      );
      grow.onfinish = () => {
        enter();
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            const fade = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: "ease-out", fill: "forwards" });
            fade.onfinish = () => {
              el.style.display = "none";
              grow.cancel();
              fade.cancel();
              busy.current = false;
            };
          })
        );
      };
    },
    [mode]
  );

  const home = useCallback(() => {
    if (busy.current) return;
    const el = portal.current;
    const current = scene;
    const leave = () => {
      setScene(null);
      setIntro(null);
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      if (location.hash) history.pushState(null, "", location.pathname + location.search);
    };
    if (!el || reduced.current) {
      leave();
      return;
    }
    busy.current = true;
    const s = SECTIONS.find((x) => x.id === current);
    el.style.display = "block";
    el.style.background = s?.card ?? C.denim;
    el.style.left = "0px";
    el.style.top = "0px";
    el.style.width = "100vw";
    el.style.height = "100vh";
    const cover = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, fill: "forwards" });
    cover.onfinish = () => {
      leave();
      // espera a que el inicio esté pintado para encoger el portal hacia su tarjeta
      window.setTimeout(() => {
        const card = current ? document.querySelector(`[data-card="${current}"]`) : null;
        const r = card?.getBoundingClientRect() ?? new DOMRect(innerWidth / 2 - 60, innerHeight / 2 - 40, 120, 80);
        const shrink = el.animate(
          [
            { left: "0px", top: "0px", width: "100vw", height: "100vh", borderRadius: "0px", opacity: 1, transform: "rotate(0deg)" },
            { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, borderRadius: "22px", opacity: 0.0, transform: `rotate(${mode === "tower" ? -6 : -3}deg)` },
          ],
          { duration: 780, easing: "cubic-bezier(.6,0,.2,1)", fill: "forwards" }
        );
        shrink.onfinish = () => {
          el.style.display = "none";
          cover.cancel();
          shrink.cancel();
          busy.current = false;
        };
      }, 380);
    };
  }, [scene, mode]);

  // Enlaces internos (#seccion) → portal (solo en la torre)
  useEffect(() => {
    if (mode !== "tower") return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      if (id === "inicio" || id === "") {
        e.preventDefault();
        if (scene) home();
        return;
      }
      if (!isSection(id)) return;
      e.preventDefault();
      if (id !== scene) go(id, a);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [go, home, scene, mode]);

  // Atrás / adelante del navegador y enlaces directos (#proyectos)
  useEffect(() => {
    if (mode !== "tower") return;
    const sync = () => {
      const id = location.hash.slice(1);
      show(isSection(id) ? id : null);
    };
    const first = location.hash.slice(1);
    if (isSection(first)) setScene(first);
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [show, mode]);

  const api: NavApi = useMemo(() => ({ mode, scene, go, home }), [mode, scene, go, home]);

  return (
    <NavContext.Provider value={api}>
      <Preloader onDone={onReady} />
      <Cursor />
      <ScrollFx />
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>
        {t("Saltar al contenido", "Skip to content")}
      </a>
      <div className="page">
        {mode === "hero" ? <Header /> : <LangToggle className="lang-toggle--float" />}
        <main id="main" tabIndex={-1}>
          {mode === "hero" ? (
            <>
              <HeroFrame>
                <Hero ready={ready} />
              </HeroFrame>
              <About />
              <Offscreen />
              <MarqueeCube />
              <Education />
              <Seam from="#E6F1FA" to="#5798D7" />
              <StackFly onPick={setSel} />
              <ParticleWord />
              <Projects />
              <PathDraw />
              <Experience />
              <CodeFade from="#FFFFFF" to="#B9C255" color="#5798D7" head="#12263F" />
              <Testimonials />
              <GlowStar />
              <Contact />
            </>
          ) : scene === null ? (
            <TowerHub ready={ready} />
          ) : (
            <SceneView key={scene} id={scene} onPickTech={setSel} />
          )}
        </main>
        {mode === "hero" && <Footer />}
      </div>
      {intro && <SceneIntro key={intro} id={intro} onEnd={endIntro} />}
      <div ref={portal} className="portal" aria-hidden="true" />
      <TechModal tech={sel >= 0 ? TECH[sel] : null} onClose={closeTech} />
    </NavContext.Provider>
  );
}
