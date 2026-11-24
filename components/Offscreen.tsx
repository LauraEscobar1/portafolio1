"use client";

import { Fragment, useRef } from "react";
import { range, smooth, useScrub } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";

/**
 * FUERA DE LA PANTALLA — "del texto a la línea de tiempo".
 * Un párrafo con fotos pequeñitas entre las palabras. Al bajar, cada foto se
 * despega del texto, vuela y cae en su lugar dentro de una línea de tiempo,
 * mientras el texto cierra el hueco que dejó.
 */

type Shot = { src: string; label: string };
type Token = string | Shot;

const TEXT: Token[] = [
  "Fuera de la pantalla",
  { src: "/fuera/musica-fania.jpg", label: "Música" },
  "la música pone el ritmo de mis días,",
  { src: "/fuera/baile-pista.jpg", label: "Baile" },
  "bailo salsa y estilo libre,",
  { src: "/fuera/luna.jpg", label: "Fotografía" },
  "guardo momentos únicos con mi familia",
  { src: "/fuera/volcan-nubes.jpg", label: "Naturaleza" },
  "y la naturaleza y, cuando cae la noche,",
  { src: "/fuera/videojuegos.jpg", label: "Videojuegos" },
  "enciendo la consola para una partida de suspenso. Al final, todo se conecta: el ritmo, la mirada y la curiosidad que llevo a cada línea de código.",
];
const TEXT_EN: Token[] = [
  "Off screen,",
  { src: "/fuera/musica-fania.jpg", label: "Music" },
  "music sets the rhythm of my days,",
  { src: "/fuera/baile-pista.jpg", label: "Dance" },
  "I dance salsa and freestyle,",
  { src: "/fuera/luna.jpg", label: "Photography" },
  "I capture unique moments with my family",
  { src: "/fuera/volcan-nubes.jpg", label: "Nature" },
  "and in nature and, when night falls,",
  { src: "/fuera/videojuegos.jpg", label: "Video games" },
  "I turn on the console for a suspense game. In the end, it all connects: the rhythm, the eye and the curiosity I bring to every line of code.",
];
const SHOTS = TEXT.filter((t): t is Shot => typeof t !== "string");
const COUNT = SHOTS.length;

/* Ventana de cada foto dentro del scroll de la sección */
const START = 0.08;
const END = 0.9;
const STEP = (END - START) / COUNT;
const win = (k: number): [number, number] => [START + k * STEP, START + k * STEP + STEP * 1.35];

const fmt = (s: number) => `00:${String(Math.floor(s)).padStart(2, "0")}.${String(Math.floor((s % 1) * 100)).padStart(2, "0")}`;

export default function Offscreen() {
  const { lang } = useLang();
  const TEXTS = lang === "en" ? TEXT_EN : TEXT;
  const SHOTS_L = TEXTS.filter((t): t is Shot => typeof t !== "string");
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const holes = useRef<(HTMLSpanElement | null)[]>([]);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const flyers = useRef<(HTMLDivElement | null)[]>([]);
  const head = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const text = useRef<HTMLParagraphElement>(null);

  useScrub(
    ref,
    (p) => {
      const st = stage.current;
      if (!st) return;
      const base = st.getBoundingClientRect();

      // 1) Primero se cierran/abren los huecos del texto (cambia el layout)
      const ts = SHOTS.map((_, k) => smooth(range(p, win(k)[0], win(k)[1])));
      ts.forEach((t, k) => {
        const h = holes.current[k];
        if (h) h.style.setProperty("--g", (1 - smooth(range(t, 0.2, 0.75))).toFixed(3));
      });
      if (text.current) text.current.style.setProperty("--in", smooth(range(p, 0, 0.06)).toFixed(3));

      // 2) Luego se mide y se ubica cada foto entre su hueco y su casilla
      ts.forEach((t, k) => {
        const h = holes.current[k], s = slots.current[k], f = flyers.current[k];
        if (!h || !s || !f) return;
        const a = h.getBoundingClientRect();
        const b = s.getBoundingClientRect();
        const size = Math.max(1, a.height * 0.92);
        const ax = a.left - base.left + (a.width - size) / 2;
        const ay = a.top - base.top + (a.height - size) / 2;
        const bx = b.left - base.left, by = b.top - base.top;
        const w = size + (b.width - size) * t;
        const hh = size + (b.height - size) * t;
        const x = ax + (bx - ax) * t;
        const y = ay + (by - ay) * t - Math.sin(t * Math.PI) * base.height * 0.12;
        const rot = Math.sin(t * Math.PI) * (k % 2 ? 8 : -8);
        f.style.width = `${w.toFixed(1)}px`;
        f.style.height = `${hh.toFixed(1)}px`;
        f.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`;
        f.style.borderRadius = `${(8 + 6 * t).toFixed(1)}px`;
        f.style.opacity = String(smooth(range(p, 0, 0.05)));
        f.classList.toggle("is-flying", t > 0.02 && t < 0.98);
        s.classList.toggle("is-filled", t > 0.97);
      });

      // 3) Línea de tiempo: el cabezal avanza
      const q = smooth(range(p, START, END + 0.05));
      if (head.current) head.current.style.left = `${(q * 100).toFixed(2)}%`;
      if (clock.current) clock.current.textContent = fmt(q * 12);
    },
    () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hh")) || 0
  );

  let n = -1;
  return (
    <section id="fuera" ref={ref} className="itl-sec" aria-label={lang === "en" ? "Off screen" : "Fuera de la pantalla"}>
      <div className="itl-sticky" ref={stage}>
        <div className="itl-top wrap">
          <span className="eyebrow">(03) — {lang === "en" ? "Off screen" : "Fuera de la pantalla"}</span>
          <span className="eyebrow itl-hint">{lang === "en" ? "Scroll ↓" : "Desliza ↓"}</span>
        </div>

        <p className="itl-text serif" ref={text}>
          {TEXTS.map((t, i) => {
            if (typeof t === "string") {
              return (
                <Fragment key={i}>
                  {i === 0 ? <span className="it accent">{t}</span> : t}{" "}
                </Fragment>
              );
            }
            n += 1;
            const k = n;
            return (
              <Fragment key={i}>
                <span className="itl-hole" ref={(el) => { holes.current[k] = el; }} aria-hidden="true" />{" "}
              </Fragment>
            );
          })}
        </p>

        <div className="itl-panel" aria-label={lang === "en" ? "Timeline of my hobbies" : "Línea de tiempo de mis pasatiempos"}>
          <div className="itl-bar">
            <span className="itl-play" aria-hidden="true">❚❚</span>
            <span className="itl-clock">
              <span ref={clock}>00:00.00</span> / 00:12.00
            </span>
            <span className="itl-tag">{lang === "en" ? "Off screen" : "Fuera de la pantalla"}</span>
          </div>
          <div className="itl-ruler" aria-hidden="true">
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i}>{i * 2}s</span>
            ))}
            <div className="itl-head" ref={head} />
          </div>
          <div className="itl-track">
            {SHOTS_L.map((s, k) => (
              <div key={k} className="itl-slot">
                <div className="itl-box" ref={(el) => { slots.current[k] = el; }} />
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {SHOTS_L.map((s, k) => (
          <div key={k} className="itl-fly" ref={(el) => { flyers.current[k] = el; }}>
            <img src={s.src} alt={s.label} loading="lazy" draggable={false} />
          </div>
        ))}
      </div>
    </section>
  );
}
