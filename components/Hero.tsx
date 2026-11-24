"use client";

import { Fragment, useMemo, useRef, useState, type PointerEvent } from "react";
import { useData, useLang, useT } from "@/lib/i18n";
import { pointerIn, useSectionProgress } from "@/lib/hooks";

/** Divide un texto en palabras con máscara para que suban una a una. */
function Words({ text, start = 0, className = "" }: { text: string; start?: number; className?: string }) {
  return (
    <>
      {text.split(" ").map((w, i, arr) => (
        <Fragment key={i}>
          <span className="word-mask">
            <span className={`word ${className}`} style={{ animationDelay: `${start + i * 0.09}s` }}>
              {w}
            </span>
          </span>
          {i < arr.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/** Borde de papel rasgado (SVG) con semilla fija: igual en servidor y cliente. */
function Torn({ seed, side, fill, lip }: { seed: number; side: "top" | "bottom"; fill: string; lip?: string }) {
  const d = useMemo(() => {
    let a = seed;
    const r = () => ((a = (a * 16807) % 2147483647) / 2147483647);
    const pts: string[] = [];
    const N = 70;
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * 1000;
      const y = 14 + r() * 22 + (i % 3 === 0 ? r() * 10 : 0);
      pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return side === "top" ? `M0 60 L${pts.join(" L")} L1000 60 Z` : `M0 0 L${pts.join(" L")} L1000 0 Z`;
  }, [seed, side]);
  return (
    <svg className={`torn torn--${side}`} viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
      {lip && <path d={d} fill={lip} transform={side === "top" ? "translate(0 -7)" : "translate(0 7)"} />}
      <path d={d} fill={fill} />
    </svg>
  );
}

export default function Hero({ ready }: { ready: boolean }) {
  const { SITE } = useData();
  const t = useT();
  const { lang } = useLang();
  const ref = useRef<HTMLElement>(null);
  const [m, setM] = useState({ px: 0, py: 0 });
  const exit = useSectionProgress(ref, "exit");

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    setM(pointerIn(e, ref.current));
  };
  const onLeave = () => setM({ px: 0, py: 0 });

  return (
    <section
      ref={ref}
      className={`hero hero--paper ${ready ? "is-ready" : ""}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="hero-top">
        <span className="hero-in" style={{ animationDelay: ".1s" }}>
          <span className="dot" aria-hidden="true" />
          {t("Disponible para proyectos", "Open to projects")}
        </span>
        <span className="hero-in" style={{ animationDelay: ".2s" }}>
          {SITE.city}
        </span>
      </div>

      {/* Banda oscura con bordes de papel rasgado */}
      <div className="hero-band" aria-hidden="true">
        <Torn seed={11} side="top" fill="#12263F" lip="#ffffff" />
        <div className="hero-band-fill">
          <div className="hero-band-word" style={{ transform: `translate(${m.px * -30 - exit * 160}px, ${m.py * -8}px)` }}>
            <span>SOFTWARE</span>
          </div>
          <div className="hero-band-stars" style={{ transform: `translate(${m.px * 24}px, ${m.py * 14}px)` }}>
            <span className="star-big">✦</span>
            <span className="star-small">✦</span>
          </div>
          <div className="hero-band-stars hero-band-stars--l" style={{ transform: `translate(${m.px * 24}px, ${m.py * 14}px)` }}>
            <span className="star-small">✦</span>
          </div>
        </div>
      </div>

      {/* Tu foto recortada con borde pistacho */}
      <div
        className="hero-portrait"
        style={{ transform: `translateX(-50%) translate(${m.px * 14}px, ${exit * 60 + m.py * 6}px) rotate(${(m.px * 2).toFixed(2)}deg)` }}
      >
        <img src={SITE.heroPhoto ?? ""} alt={SITE.heroPhotoAlt} width={908} height={1011} />
      </div>

      {/* Papel de abajo, rasgado, con el texto */}
      <div className="hero-paper">
        <Torn seed={29} side="top" fill="#E6F1FA" lip="#ffffff" />
        <div className="hero-paper-in">
          <div className="hero-left">
            <div className="eyebrow hero-in" style={{ animationDelay: ".35s" }}>
              {t("Hola, soy", "Hi, I'm")} {SITE.name} · Universidad Cooperativa de Colombia
            </div>
            <h1 className="hero-title serif">
              {lang === "en" ? (
                <>
                  <Words key="en1" text="Software" start={0.45} className="it accent" /> <Words key="en2" text="engineering" start={0.62} />
                </>
              ) : (
                <>
                  <Words key="es1" text="Ingeniería de" start={0.45} /> <Words key="es2" text="software" start={0.62} className="it accent" />
                </>
              )}
            </h1>
            <div className="hero-ctas hero-in" style={{ animationDelay: ".95s" }}>
              <a className="btn magnetic" href="#contacto">
                {t("Empecemos un proyecto", "Let's build something")} <span aria-hidden="true" className="btn-arrow">→</span>
              </a>
              <a className="btn btn-ghost magnetic" href={SITE.cv} download>
                {t("Descargar CV", "Download CV")}
              </a>
            </div>
          </div>
          <div className="hero-right hero-in" style={{ animationDelay: "1.05s" }}>
            <p>
              {t(
                "Construyo software que se siente simple por fuera y está bien pensado por dentro: código limpio, interfaces claras e ideas que funcionan.",
                "I build software that feels simple on the outside and is well thought out on the inside: clean code, clear interfaces and ideas that work."
              )}
            </p>
            <div className="signature serif it">{SITE.name}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
