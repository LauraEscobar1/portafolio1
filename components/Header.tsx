"use client";

import { useEffect, useState } from "react";
import { LangToggle, useData, useT } from "@/lib/i18n";
import { useNav } from "@/lib/nav";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { scene } = useNav();
  const { NAV, SITE } = useData();
  const t = useT();
  const active = scene ?? "";

  // Cierra el menú móvil con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <nav className="nav" aria-label={t("Principal", "Main")}>
        <a href="#inicio" className="logo serif" aria-label={t("Laura Escobar, inicio", "Laura Escobar, home")}>
          LE<span className="it">.</span>
        </a>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((o) => !o)}
        >
          <span>{open ? t("Cerrar", "Close") : t("Menú", "Menu")}</span>
          <span className={`burger ${open ? "is-open" : ""}`} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>

        <ul id="nav-links" className={`nav-links ${open ? "is-open" : ""}`}>
          {NAV.map((n, i) => (
            <li key={n.id} style={{ ["--i" as string]: i }}>
              <a
                className={`navlink ${active === n.id ? "is-active" : ""}`}
                href={`#${n.id}`}
                aria-current={active === n.id ? "true" : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="navlink-roll">
                  <span data-text={n.label}>{n.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <LangToggle />
        <a className="btn btn-sm btn-ghost magnetic nav-cv" href={SITE.cv} download>
          CV
        </a>
        <a className="btn btn-sm magnetic" href="#contacto">
          {t("Contacto", "Contact")}
        </a>
      </nav>
      <div className="scroll-bar" aria-hidden="true" />
    </header>
  );
}
