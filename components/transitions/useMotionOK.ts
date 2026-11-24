"use client";

import { useEffect, useState } from "react";

/** false si el usuario pidió reducir el movimiento (o si coincide `extraQuery`). */
export function useMotionOK(extraQuery?: string) {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    const q = "(prefers-reduced-motion: reduce)" + (extraQuery ? `, ${extraQuery}` : "");
    const m = window.matchMedia(q);
    const update = () => setOk(!m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, [extraQuery]);
  return ok;
}
