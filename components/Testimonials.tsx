"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useData, useT } from "@/lib/i18n";

/**
 * TESTIMONIOS — una impresora de recibos.
 * Al llegar a la sección, la impresora imprime un recibo por testimonio; cada
 * nombre de la lista, a un lado, vuelve a imprimir ese testimonio. Tocando una burbujita se
 * vuelve a imprimir ese testimonio.
 */
const COLORS = ["#B9C255", "#5798D7", "#12263F"];
const PRINT_MS = 1900;
const STAY_MS = 3200;

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const { TESTIMONIALS } = useData();
  const tr = useT();
  const stage = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(-1);
  const [phase, setPhase] = useState<"idle" | "printing" | "done" | "leaving">("idle");
  const auto = useRef(true);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const print = useCallback((i: number) => {
    clear();
    setCur(i);
    setPhase("printing");
    later(() => {
      setPhase("done");
      if (auto.current && i < TESTIMONIALS.length - 1) {
        later(() => {
          setPhase("leaving");
          later(() => print(i + 1), 650);
        }, STAY_MS);
      } else auto.current = false;
    }, PRINT_MS);
  }, []);

  const pick = (i: number) => {
    auto.current = false;
    if (i === cur && phase !== "leaving") return;
    clear();
    if (cur >= 0) {
      setPhase("leaving");
      later(() => print(i), 650);
    } else print(i);
  };

  // Empieza a imprimir cuando la sección entra en pantalla
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      auto.current = false;
      setCur(0);
      setPhase("done");
      return;
    }
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          io.disconnect();
          print(0);
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
    };
  }, [print]);

  const t = cur >= 0 ? TESTIMONIALS[cur] : null;

  return (
    <section id="testimonios" ref={root} className="testimonials testimonials--receipt">
      <div className="wrap rcpt-wrap rcpt-wrap--side rcpt-layout">
        <div className="rcpt-side2">
          <div className="eyebrow reveal">(08) — {tr("Lo que dicen de mí", "What people say")}</div>
          <h2 className="display serif reveal">
            {tr("Testi", "Testi")}
            <span className="it">{tr("monios", "monials")}</span>
          </h2>
          <p className="rcpt-hint">{tr("Toca un nombre para imprimir su testimonio.", "Tap a name to print their testimonial.")}</p>
          <ul className="rcpt-names" aria-label={tr("Elegir testimonio", "Choose a testimonial")}>
            {TESTIMONIALS.map((x, i) => (
              <li key={x.name}>
                <button type="button" className={`rcpt-name ${i === cur ? "is-on" : ""} ${i === cur && phase === "printing" ? "is-busy" : ""}`} onClick={() => pick(i)} aria-pressed={i === cur}>
                  <span className="rcpt-name-dot" style={{ background: COLORS[i % COLORS.length] }} />
                  <b className="serif">{x.name}</b>
                  <span className="rcpt-name-go" aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rcpt-stage" ref={stage}>
            <div className="printer" aria-hidden="true">
              <span className="printer-top" />
              <span className="printer-screen">
                {phase === "printing" ? tr("IMPRIMIENDO…", "PRINTING…") : cur < 0 ? tr("LISTO", "READY") : tr("IMPRESO ✓", "PRINTED ✓")}
              </span>
              <span className={`printer-led ${phase === "printing" ? "is-busy" : ""}`} />
              <span className="printer-brand">LE · print</span>
              <span className="printer-slot" />
            </div>

            <div className="rcpt-clip">
              {t && (
                <article key={`${cur}-${phase === "leaving" ? "out" : "in"}`} className={`rcpt rcpt--${phase}`} aria-live="polite">
                  <div className="rcpt-head">
                    <span>Laura Escobar · {tr("Portafolio", "Portfolio")}</span>
                    <b>{tr("TESTIMONIO N.º", "TESTIMONIAL NO.")} {String(cur + 1).padStart(2, "0")}</b>
                  </div>
                  <div className="rcpt-dots" />
                  <blockquote className="serif">“{t.text}”</blockquote>
                  <div className="rcpt-dots" />
                  <div className="rcpt-who">
                    <b>{t.name}</b>
                    <span>{t.role}</span>
                  </div>
                  <div className="rcpt-dots" />
                  <div className="rcpt-foot">
                    <span className="rcpt-tags">
                      {tr("RECOMENDADA", "RECOMMENDED")}
                      <br />
                      {tr("CONFIABLE", "RELIABLE")}
                      <br />
                      {tr("CONSTANTE", "CONSISTENT")}
                    </span>
                    <span className="rcpt-barcode" />
                  </div>
                  <div className="rcpt-thanks">{tr("¡GRACIAS!", "THANK YOU!")}</div>
                </article>
              )}
            </div>
          </div>

      </div>
    </section>
  );
}
