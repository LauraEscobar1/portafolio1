"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useData, useT } from "@/lib/i18n";
import HubCard from "./HubCard";

/**
 * VERSIÓN TORRE — el inicio es una torre 3D de noche (azul marino, nunca negro).
 * Alrededor de su tambor giran las tarjetas de las secciones. La rueda, el
 * arrastre o las flechas la hacen girar; al tocar una tarjeta, ésta vuela
 * hacia ti y se abre como la sección.
 */
const DRUM_R = 300;
const CARD_R = 352;

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () =>
      setT(
        new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "2-digit", timeZone: "America/Bogota" }).format(new Date())
      );
    f();
    const id = window.setInterval(f, 20000);
    return () => window.clearInterval(id);
  }, []);
  return t;
}

export default function TowerHub({ ready }: { ready: boolean }) {
  const { SECTIONS, SITE } = useData();
  const t = useT();
  const spin = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const angle = useRef(-12);
  const vel = useRef(0);
  const [scale, setScale] = useState(1);
  const clock = useClock();

  const stars = useMemo(() => {
    let a = 11;
    const r = () => ((a = (a * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: 70 }, () => ({ x: r() * 100, y: r() * 62, s: 1 + r() * 2.2, d: r() * 4 }));
  }, []);

  useEffect(() => {
    const fit = () => setScale(Math.max(0.42, Math.min(1, window.innerHeight / 1120, window.innerWidth / 1050)));
    fit();
    window.addEventListener("resize", fit);
    document.documentElement.classList.add("no-scroll");
    return () => {
      window.removeEventListener("resize", fit);
      document.documentElement.classList.remove("no-scroll");
    };
  }, []);

  // Giro con inercia + giro lento automático
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let idle = 0;
    const tick = (now: number) => {
      const dt = Math.min(50, now - last) / 1000;
      last = now;
      idle += dt;
      vel.current *= 0.93;
      const auto = reduced || idle < 2.5 ? 0 : 5;
      angle.current += vel.current + auto * dt;
      if (spin.current) spin.current.style.transform = `rotateY(${angle.current.toFixed(2)}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const push = (v: number) => {
      vel.current = Math.max(-8, Math.min(8, vel.current + v));
      idle = 0;
    };
    const onWheel = (e: WheelEvent) => push((Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * -0.02);
    let dragX: number | null = null;
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest(".hub-card")) return;
      dragX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (dragX === null) return;
      push((e.clientX - dragX) * 0.05);
      dragX = e.clientX;
    };
    const onUp = () => (dragX = null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") push(4);
      if (e.key === "ArrowRight") push(-4);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const N = SECTIONS.length;
  const drum = Array.from({ length: 24 }, (_, i) => i);
  const band = Array.from({ length: 12 }, (_, i) => i);
  const crown = Array.from({ length: 12 }, (_, i) => i);
  const shaft = Array.from({ length: 12 }, (_, i) => i);
  const seg = (r: number, n: number) => Math.ceil((2 * Math.PI * r) / n) + 2;

  return (
    <div className={`tower ${ready ? "is-ready" : ""}`}>
      <div className="tw-sky" aria-hidden="true">
        {stars.map((s, i) => (
          <i key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${-s.d}s` }} />
        ))}
        <span className="tw-moon" />
        <span className="tw-bokeh b1" />
        <span className="tw-bokeh b2" />
        <span className="tw-bokeh b3" />
        <span className="tw-bokeh b4" />
        <span className="tw-bokeh b5" />
      </div>

      <div className="tw-scene">
        <div className="tw-rig" ref={rig} style={{ transform: `scale(${scale}) rotateX(-7deg)` }}>
          {/* Antena con ondas */}
          <span className="tw-antenna" aria-hidden="true" />
          <span className="tw-tip" aria-hidden="true" />
          {[0, 1, 2].map((k) => (
            <span key={k} className="tw-wave" style={{ animationDelay: `${k * -1.2}s` }} aria-hidden="true" />
          ))}

          <div className="tw-spin" ref={spin}>
            {/* Corona con letrero */}
            <span className="tw-disc tw-disc--crown" aria-hidden="true" />
            {crown.map((i) => (
              <span
                key={i}
                className="tw-crown"
                aria-hidden="true"
                style={{ width: seg(170, 12), marginLeft: -seg(170, 12) / 2, transform: `rotateY(${i * 30}deg) translateZ(170px)` }}
              >
                {i % 2 ? "ESCOBAR" : "LAURA"}
              </span>
            ))}
            <span className="tw-disc tw-disc--cap" aria-hidden="true" />

            {/* Tambor con ventanas */}
            {drum.map((i) => (
              <span
                key={i}
                className="tw-drum"
                aria-hidden="true"
                style={{ width: seg(DRUM_R, 24), marginLeft: -seg(DRUM_R, 24) / 2, transform: `rotateY(${i * 15}deg) translateZ(${DRUM_R}px)`, backgroundPositionX: `${(i * 37) % 90}px` }}
              />
            ))}

            {/* Tarjetas de las secciones */}
            {SECTIONS.map((s, i) => (
              <div key={s.id} className="tw-card" style={{ transform: `rotateY(${(i * 360) / N}deg) translateZ(${CARD_R}px)` }}>
                <HubCard id={s.id} />
              </div>
            ))}

            {/* Cinta con texto */}
            {band.map((i) => (
              <span
                key={i}
                className="tw-band"
                aria-hidden="true"
                style={{ width: seg(322, 12), marginLeft: -seg(322, 12) / 2, transform: `rotateY(${i * 30}deg) translateZ(322px)` }}
              >
                {i % 2 ? t("INGENIERÍA ✦", "ENGINEERING ✦") : "LAURA ESCOBAR ✦"}
              </span>
            ))}
            <span className="tw-disc tw-disc--base" aria-hidden="true" />

            {/* Columna */}
            {shaft.map((i) => (
              <span
                key={i}
                className="tw-shaft"
                aria-hidden="true"
                style={{ width: seg(90, 12), marginLeft: -seg(90, 12) / 2, transform: `rotateY(${i * 30}deg) translateZ(90px)` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="tw-memo" aria-hidden="true">
        <span className="tw-memo-bubble">{t("¡Hola! Bienvenido a mi torre ✦", "Hi! Welcome to my tower ✦")}</span>
        <img src="/memoji-laptop.webp" alt="" width={150} height={186} />
      </div>

      <div className="tw-corner tw-corner--tl">
        <span className="serif tw-logo">
          LE<span className="it">.</span>
        </span>
      </div>
      <div className="tw-corner tw-corner--tr">
        <span className="tw-chip">
          <span className="dot" /> {t("Disponible para proyectos", "Open to projects")}
        </span>
      </div>
      <div className="tw-corner tw-corner--bl">
        <b className="serif">{SITE.name}</b>
        <span>{t("Ingeniería de software", "Software engineering")} · {SITE.city}</span>
      </div>
      <div className="tw-corner tw-corner--br">
        <b>Pasto · {clock}</b>
        <span>{t("Siempre creando", "Always creating")}</span>
      </div>
      <div className="tw-pills" aria-hidden="true">
        <span>{t("Desliza para girar", "Drag to spin")}</span>
        <span>{t("Toca una tarjeta para entrar", "Tap a card to enter")}</span>
      </div>
      <h1 className="sr-only">{SITE.name} — {t("Portafolio", "Portfolio")}</h1>
    </div>
  );
}
