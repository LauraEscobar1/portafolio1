"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/data";
import { useT } from "@/lib/i18n";

export default function Footer() {
  // El año se calcula en el navegador para que siempre esté al día.
  const [year, setYear] = useState(2026);
  const t = useT();
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="footer">
      <div className="wrap footer-row">
        <span>© {year} {SITE.name}</span>
        <span>{SITE.city}</span>
        <a href="#inicio" className="footer-top">
          {t("Volver arriba", "Back to top")} <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
