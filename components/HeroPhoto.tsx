import type { ReactNode } from "react";

/**
 * Marco en arco para tu foto del hero.
 *  - Sin `src`: muestra el placeholder.
 *  - Con `src`: muestra tu PNG sin fondo, apoyado en la base del arco.
 *  - `frame`: cualquier decoración extra (un SVG, otro PNG…) que se pinta
 *    por encima del arco. Ideal para tu marco decorativo.
 */
export default function HeroPhoto({
  src,
  alt = "Laura Escobar",
  frame,
  glareX = 50,
  glareY = 30,
}: {
  src?: string | null;
  alt?: string;
  frame?: ReactNode;
  glareX?: number;
  glareY?: number;
}) {
  return (
    <div className="hero-photo">
      <div className="hero-photo-arch">
        <span className="hero-photo-sun" aria-hidden="true" />
        <span className="hero-photo-hill" aria-hidden="true" />
        {src ? (
          <img className="hero-photo-img hero-photo-img--cover" src={src} alt={alt} />
        ) : (
          <span className="hero-photo-ph">[Tu foto sin fondo (PNG)]</span>
        )}
        <span
          className="hero-photo-glare"
          aria-hidden="true"
          style={{ background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,.38), rgba(255,255,255,0) 55%)` }}
        />
      </div>
      {frame ? <div className="hero-photo-frame">{frame}</div> : null}
    </div>
  );
}
