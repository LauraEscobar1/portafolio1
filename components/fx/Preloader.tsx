"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useT } from "@/lib/i18n";

/**
 * Intro: una caricatura en blanco y negro de una muñeca (pelo por los hombros,
 * flequillo y camisa con corbata) se dibuja con líneas que brillan, junto a
 * "made by Laura". Las letras se rellenan, todo brilla un momento y se
 * desvanece para mostrar el portafolio.
 * Con movimiento reducido no se muestra.
 */

/* Caricatura en blanco y negro, dibujada a mano: cada trazo con su retraso (s) */
const LINES: { d: string; delay: number; cls?: string }[] = [
  // pelo: contorno con las puntas hacia afuera
  { d: "M57 16 C38 15 21 29 19 52 C17 67 15 83 22 95 C25 100 32 101 36 96", delay: 0 },
  { d: "M64 15 C86 16 101 31 102 53 C103 68 105 83 98 95 C95 100 88 100 85 95", delay: 0.08 },
  // pelo a los lados de la cara
  { d: "M30 58 C26 70 29 84 34 92", delay: 0.3 },
  { d: "M90 58 C94 70 91 84 86 92", delay: 0.34 },
  // flequillo
  { d: "M57 29 C49 44 39 52 25 56", delay: 0.42 },
  { d: "M63 29 C68 44 78 52 95 56", delay: 0.46 },
  { d: "M55 31 C53 39 55 46 59 51", delay: 0.54 },
  { d: "M60 30 C59 37 61 44 65 49", delay: 0.58 },
  // cara
  { d: "M33 60 C32 75 43 83 60 83 C77 83 88 75 87 60", delay: 0.62 },
  // ojos, nariz y boca
  { d: "M47 61 L47 66", delay: 0.85, cls: "dl-dot" },
  { d: "M73 61 L73 66", delay: 0.88, cls: "dl-dot" },
  { d: "M60 68 L60.4 68.2", delay: 0.92, cls: "dl-dot" },
  { d: "M56 74 L63 74", delay: 0.96 },
  // cuello, cuello de camisa y corbata
  { d: "M54 83 L54 89 M66 83 L66 89", delay: 1.0 },
  { d: "M54 89 L47 97 L56 101 L60 93 L64 101 L73 97 L66 89", delay: 1.05 },
  { d: "M58 97 L64 118 M62 97 L56 118", delay: 1.15 },
  // hombros
  { d: "M48 95 C40 99 34 107 31 119", delay: 1.12 },
  { d: "M72 95 C80 99 86 107 89 119", delay: 1.14 },
];

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"draw" | "fill" | "out" | "gone">("draw");
  const t = useT();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("gone");
      onDone();
      return;
    }
    document.documentElement.classList.add("is-loading");
    const timers: number[] = [];
    let fontsReady = false;
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    (fonts ? fonts.ready : Promise.resolve()).then(() => (fontsReady = true));
    const start = performance.now();

    const finish = () => {
      setPhase("out");
      onDone();
      document.documentElement.classList.remove("is-loading");
      timers.push(window.setTimeout(() => setPhase("gone"), 900));
    };
    timers.push(window.setTimeout(() => setPhase("fill"), 1900));
    const waitOut = () => {
      if (fontsReady || performance.now() - start > 4200) finish();
      else timers.push(window.setTimeout(waitOut, 120));
    };
    timers.push(window.setTimeout(waitOut, 3100));

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      document.documentElement.classList.remove("is-loading");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`dl dl--${phase}`} aria-hidden="true">
      <svg className="dl-art" viewBox="0 0 430 140" role="presentation">
        <defs>
          <filter id="dl-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform="translate(4 2) scale(1.12)" filter="url(#dl-glow)">
          {/* trazos que se dibujan */}
          {LINES.map((l, i) => (
            <path
              key={i}
              d={l.d}
              pathLength={1}
              className={`dl-line ${l.cls ?? ""}`}
              style={{ ["--d" as string]: `${l.delay}s` } as CSSProperties}
            />
          ))}
        </g>

        <text x="156" y="46" className="dl-made">made by</text>
        <text x="150" y="122" className="dl-name">Laura</text>
      </svg>
      <span className="dl-sub">Laura Escobar · {t("Portafolio", "Portfolio")}</span>
    </div>
  );
}
