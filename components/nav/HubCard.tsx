"use client";

import type { CSSProperties } from "react";
import { type SectionId } from "@/lib/data";
import { useData, useT } from "@/lib/i18n";
import { useNav } from "@/lib/nav";

/** Pequeña ilustración de cada sección para su tarjeta. */
export function CardArt({ id }: { id: SectionId }) {
  const t = useT();
  switch (id) {
    case "sobre-mi":
      return (
        <span className="ca ca-memo">
          <img src="/memoji-laptop.webp" alt="" width={80} height={99} />
          <span className="ca-bubble">{t("¡Hola!", "Hi!")}</span>
        </span>
      );
    case "fuera":
      return (
        <span className="ca ca-photos">
          <img src="/fuera/baile-pista.jpg" alt="" />
          <img src="/fuera/volcan-nubes.jpg" alt="" />
          <img src="/fuera/ilustracion.jpg" alt="" />
        </span>
      );
    case "formacion":
      return (
        <span className="ca ca-edu">
          <b className="serif">UCC</b>
          <span>{t("Ingeniería", "Engineering")}</span>
        </span>
      );
    case "stack":
      return (
        <span className="ca ca-stack">
          <i className="serif">Re</i>
          <i className="serif">TS</i>
          <i className="serif">Kt</i>
        </span>
      );
    case "proyectos":
      return (
        <span className="ca ca-proj">
          <span className="ca-proj-card">
            <i />
            <span className="serif">Solvia</span>
          </span>
        </span>
      );
    case "experiencia":
      return (
        <span className="ca ca-exp">
          <span className="ca-exp-ring">
            <span className="orbit">
              <i />
            </span>
          </span>
        </span>
      );
    case "testimonios":
      return <span className="ca ca-quote serif it">“ ”</span>;
    case "contacto":
      return (
        <span className="ca ca-contact serif">
          {t("Hablemos", "Let's talk")}<span>.</span>
        </span>
      );
  }
}

/** Tarjeta que abre una sección con el portal. */
export default function HubCard({ id, className = "", style }: { id: SectionId; className?: string; style?: CSSProperties }) {
  const { go } = useNav();
  const { SECTIONS } = useData();
  const t = useT();
  const s = SECTIONS.find((x) => x.id === id)!;
  return (
    <button
      type="button"
      className={`hub-card ${className}`}
      data-card={id}
      data-cursor={t("Entrar", "Enter")}
      onClick={(e) => go(id, e.currentTarget)}
      style={{ background: s.card, color: s.cardFg, ...style }}
    >
      <CardArt id={id} />
      <span className="hub-card-label serif it">{s.label}</span>
      <span className="hub-card-go" aria-hidden="true">
        {t("Entrar →", "Enter →")}
      </span>
    </button>
  );
}
