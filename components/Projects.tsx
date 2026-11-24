"use client";

import { useRef } from "react";
import { useData, useT } from "@/lib/i18n";
import { useReducedMotion, useSectionProgress, useViewportWidth } from "@/lib/hooks";

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  const { PROJECTS } = useData();
  const tr = useT();
  const p = useSectionProgress(ref, "sticky");
  const vw = useViewportWidth();
  const reduced = useReducedMotion();
  const NP = PROJECTS.length;
  const PP = p * (NP - 1);
  const active = Math.round(PP);
  const mobile = vw < 900;
  const cardScale = mobile ? Math.min(1, (vw - 40) / 520) * 0.92 : vw < 1200 ? 0.82 : 1;

  const goTo = (k: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const stickyH = Math.min(window.innerHeight, 960);
    const frac = k / (NP - 1);
    window.scrollTo({ top: window.scrollY + r.top + frac * (r.height - stickyH) + 2, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section id="proyectos" ref={ref} className="projects">
      <div className="proj-sticky">
        <div
          className="proj-bgword serif it"
          aria-hidden="true"
          style={{ transform: `translate(-50%, -50%) translateX(${Math.round(-PP * 120 + 240)}px)` }}
        >
          {tr("Proyectos", "Projects")}
        </div>
        <div className="proj-labels">
          <span>(06) — {tr("Proyectos", "Projects")}</span>
          <span aria-live="polite">
            {String(active + 1).padStart(2, "0")} / {String(NP).padStart(2, "0")}
          </span>
        </div>

        <div className="proj-stage" aria-hidden="true">
          {PROJECTS.map((c, k) => {
            const d = k - PP;
            const ad = Math.abs(d);
            const tf = reduced
              ? `translateY(${(d * 400).toFixed(1)}px) scale(${cardScale})`
              : `translateY(${(d * 400 * (mobile ? 0.7 : 1)).toFixed(1)}px) translateZ(${(-ad * 280).toFixed(1)}px) rotateX(${(-d * 32).toFixed(2)}deg) rotateY(${(-14 + d * 6).toFixed(2)}deg) rotateZ(${(d * -9 + (k % 2 ? 3 : -3)).toFixed(2)}deg) scale(${cardScale})`;
            return (
              <div
                key={c.title}
                className="proj-card-pos"
                style={{ zIndex: 100 - Math.round(ad * 10), opacity: Math.max(0, 1 - ad * (mobile ? 0.8 : 0.55)), transform: tf }}
              >
                <div className="floaty proj-float" style={{ animationDelay: `${-k * 1.3}s` }}>
                  <div className="proj-card proj-card--cover" style={{ background: c.bg, color: c.fg }}>
                    <img src={c.image} alt="" draggable={false} />
                    <div className="proj-shine" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="proj-text">
          {PROJECTS.map((t, k) => {
            const on = k === active;
            return (
              <div
                key={t.title}
                className="proj-text-item"
                aria-hidden={!on}
                style={{
                  opacity: on ? 1 : 0,
                  transform: `translateY(${on ? 0 : k < active ? -30 : 30}px)`,
                  pointerEvents: on ? "auto" : "none",
                  visibility: on ? "visible" : "hidden",
                }}
              >
                <div className="proj-text-n">
                  0{k + 1} / 0{NP} · {t.kind} · {t.year}
                </div>
                <h3 className="serif">{t.title}</h3>
                <p>{t.desc}</p>
                <div className="tags">
                  {t.tags.map((tg, i) => (
                    <span key={i} className="tag">
                      {tg}
                    </span>
                  ))}
                </div>
                {t.credit && <div className="proj-credit">{t.credit}</div>}
                <div className="proj-links">
                  {t.links.map((l) => (
                    <a
                      key={l.href}
                      className={`btn magnetic ${l.primary ? "" : "btn-ghost"}`}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      tabIndex={on ? undefined : -1}
                    >
                      {l.label} <span aria-hidden="true">{/\.(apk|exe|dmg)$|releases/.test(l.href) ? "↓" : "↗"}</span>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="proj-chips" role="group" aria-label={tr("Ir a un proyecto", "Go to a project")}>
          {PROJECTS.map((c, k) => {
            const on = k === active;
            return (
              <button
                key={c.title}
                type="button"
                className={`proj-chipbtn ${on ? "is-on" : ""}`}
                aria-pressed={on}
                aria-label={`${tr("Proyecto", "Project")} 0${k + 1}: ${c.title}`}
                onClick={() => goTo(k)}
              >
                <span className="proj-chipbtn-n">0{k + 1}</span>
                <span className="proj-chipbtn-t"> {c.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
