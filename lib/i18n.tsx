"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as ES from "./data";
import * as EN from "./data.en";

/* =========================================================================
   Idioma del portafolio (español / inglés)
   - El idioma se guarda en el navegador para que se recuerde.
   - useT() devuelve t("texto en español", "text in English").
   - useData() devuelve los datos del portafolio ya traducidos.
   ========================================================================= */

export type Lang = "es" | "en";
const KEY = "le-lang";

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "es", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "en" || saved === "es") setLangState(saved);
    } catch {
      /* almacenamiento bloqueado: se queda en español */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(KEY, l);
    } catch {
      /* sin almacenamiento: solo cambia en esta visita */
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

export function useT() {
  const { lang } = useLang();
  return useCallback(<T,>(es: T, en: T): T => (lang === "en" ? en : es), [lang]);
}

/** Mezcla un arreglo en español con las traducciones (mismo orden). */
function merge<T extends object>(base: readonly T[], over: readonly Partial<T>[]): T[] {
  return base.map((b, i) => ({ ...b, ...(over[i] ?? {}) }));
}

function build(lang: Lang) {
  if (lang === "es") {
    return {
      SITE: ES.SITE,
      NAV: ES.NAV,
      EDUCATION: ES.EDUCATION,
      TECH: ES.TECH,
      PROJECTS: ES.PROJECTS,
      EXPERIENCE_INTRO: ES.EXPERIENCE_INTRO,
      EXPERIENCE_AREAS: ES.EXPERIENCE_AREAS,
      TESTIMONIALS: ES.TESTIMONIALS,
      SECTIONS: ES.SECTIONS as readonly (typeof ES.SECTIONS)[number][],
    };
  }
  return {
    SITE: { ...ES.SITE, ...EN.SITE },
    NAV: merge(ES.NAV, EN.NAV),
    EDUCATION: merge(ES.EDUCATION, EN.EDUCATION as Partial<(typeof ES.EDUCATION)[number]>[]),
    TECH: merge(ES.TECH, EN.TECH),
    PROJECTS: ES.PROJECTS.map((p, i) => ({
      ...p,
      ...EN.PROJECTS[i],
      links: p.links.map((l, k) => ({ ...l, label: EN.PROJECTS[i]?.links?.[k] ?? l.label })),
    })),
    EXPERIENCE_INTRO: EN.EXPERIENCE_INTRO,
    EXPERIENCE_AREAS: merge(ES.EXPERIENCE_AREAS, EN.EXPERIENCE_AREAS),
    TESTIMONIALS: merge(ES.TESTIMONIALS, EN.TESTIMONIALS),
    SECTIONS: ES.SECTIONS.map((s, i) => ({ ...s, label: EN.SECTION_LABELS[i] ?? s.label })) as unknown as readonly (typeof ES.SECTIONS)[number][],
  };
}

const CACHE: Partial<Record<Lang, ReturnType<typeof build>>> = {};

export function useData() {
  const { lang } = useLang();
  return (CACHE[lang] ??= build(lang));
}

/** Interruptor ES / EN */
export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  const next: Lang = lang === "es" ? "en" : "es";
  return (
    <button
      type="button"
      className={`lang-toggle ${lang === "en" ? "is-en" : ""} ${className}`}
      onClick={() => setLang(next)}
      aria-label={lang === "es" ? "Cambiar a inglés" : "Switch to Spanish"}
      title={lang === "es" ? "English" : "Español"}
    >
      <span className="lang-knob" aria-hidden="true" />
      <span className={`lang-opt ${lang === "es" ? "is-on" : ""}`}>ES</span>
      <span className={`lang-opt ${lang === "en" ? "is-on" : ""}`}>EN</span>
    </button>
  );
}
