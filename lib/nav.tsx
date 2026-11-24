"use client";

import { createContext, useContext } from "react";
import type { SectionId } from "./data";

/** Navegación por escenas: entrar a una sección y volver al inicio (o a la torre). */
export type NavApi = {
  mode: "hero" | "tower";
  scene: SectionId | null;
  /** Abre una sección. `from` es el elemento desde el que "sale" el portal. */
  go: (id: SectionId, from?: Element | null) => void;
  /** Vuelve al inicio / a la torre. */
  home: () => void;
};

export const NavContext = createContext<NavApi>({
  mode: "hero",
  scene: null,
  go: () => {},
  home: () => {},
});

export const useNav = () => useContext(NavContext);
