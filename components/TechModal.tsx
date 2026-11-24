"use client";

import { useEffect, useRef } from "react";
import type { Tech } from "@/lib/data";
import { useT } from "@/lib/i18n";

/** Modal con la descripción de una tecnología. Se cierra con ✕, Escape o clic fuera. */
export default function TechModal({ tech, onClose }: { tech: Tech | null; onClose: () => void }) {
  const t = useT();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!tech) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // Mantiene el foco dentro del modal
        const box = closeBtn.current?.closest("[role=dialog]");
        const items = box ? Array.from(box.querySelectorAll<HTMLElement>("button, a[href]")) : [];
        if (items.length <= 1) {
          e.preventDefault();
          closeBtn.current?.focus();
        }
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lastFocus.current?.focus?.({ preventScroll: true });
    };
  }, [tech, onClose]);

  if (!tech) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tech-modal-title"
        className="modal pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-top">
          <span className="modal-mono serif" style={{ background: tech.chip, color: tech.chipFg }}>
            {tech.mono}
          </span>
          <button ref={closeBtn} type="button" className="modal-close" onClick={onClose} aria-label={t("Cerrar", "Close")}>
            ✕
          </button>
        </div>
        <div className="modal-cat">{tech.cat}</div>
        <h3 id="tech-modal-title" className="modal-title serif">
          {tech.name}
        </h3>
        <p className="modal-desc">{tech.desc}</p>
        <div className="modal-usage">
          <div className="modal-usage-label">{t("Cómo la uso", "How I use it")}</div>
          <p>{tech.usage}</p>
        </div>
      </div>
    </div>
  );
}
