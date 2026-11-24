"use client";

import { useState, type PointerEvent } from "react";
import { EDUCATION as EDU_ES } from "@/lib/data";
import { useData, useT } from "@/lib/i18n";
import { pointerIn } from "@/lib/hooks";

function EduCard({ e }: { e: (typeof EDU_ES)[number] }) {
  const t = useT();
  const [m, setM] = useState({ px: 0, py: 0, on: false });
  const onMove = (ev: PointerEvent<HTMLElement>) => setM({ ...pointerIn(ev, ev.currentTarget), on: true });
  const onLeave = () => setM({ px: 0, py: 0, on: false });

  return (
    <div className="edu-wrap reveal">
      <article
        className={`edu-card edu-card--${e.kind}`}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{
          background: e.bg,
          transform: `rotateX(${(-m.py * 6).toFixed(2)}deg) rotateY(${(m.px * 8).toFixed(2)}deg)`,
          ["--sx" as string]: `${(m.px + 0.5) * 100}%`,
          ["--sy" as string]: `${(m.py + 0.5) * 100}%`,
          ["--so" as string]: m.on ? 1 : 0,
        }}
      >
        <span className="edu-spot" aria-hidden="true" />
        <span className="edu-num serif it" aria-hidden="true">
          {e.n}
        </span>

        <div className="edu-top">
          <span className="edu-badge">
            {e.kind === "carrera" && <i className="edu-live" aria-hidden="true" />}
            {e.years}
          </span>
          <span className="edu-icon" aria-hidden="true">
            {e.kind === "carrera" ? (
              <svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 5h9v7H8l-4 3zM11 12h9v7l-4-3h-5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
            )}
          </span>
        </div>

        <div className="edu-body">
          <h3 className="serif">{e.title}</h3>
          <p className="edu-place">{e.place}</p>
          <p className="edu-text">{e.text}</p>

          {"chips" in e && e.chips && (
            <ul className="edu-chips" aria-label={t("Áreas", "Areas")}>
              {e.chips.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          )}

          {"langs" in e && e.langs && (
            <ul className="edu-langs">
              {e.langs.map((l) => (
                <li key={l.name}>
                  <div className="edu-lang-row">
                    <b className="serif">{l.name}</b>
                    <span>{l.level}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </div>
  );
}

export default function Education() {
  const { EDUCATION } = useData();
  const t = useT();
  return (
    <section id="formacion" className="wrap education">
      <div className="section-head">
        <h2 className="display serif reveal">
          {t("Forma", "Educa")}
          <span className="it accent">{t("ción", "tion")}</span>
        </h2>
        <div className="eyebrow reveal">(04) — {t("Estudios", "Studies")}</div>
      </div>
      <div className="edu-grid edu-grid--two">
        {EDUCATION.map((e) => (
          <EduCard key={e.n} e={e} />
        ))}
      </div>
    </section>
  );
}
