import { useMemo } from "react";

/** Costura de papel rasgado entre dos secciones de distinto color. */
export default function Seam({ from, to, seed = 7 }: { from: string; to: string; seed?: number }) {
  const d = useMemo(() => {
    let a = seed;
    const r = () => ((a = (a * 16807) % 2147483647) / 2147483647);
    const pts: string[] = [];
    for (let i = 0; i <= 70; i++) pts.push(`${((i / 70) * 1000).toFixed(1)} ${(12 + r() * 20 + (i % 3 === 0 ? r() * 8 : 0)).toFixed(1)}`);
    return `M0 60 L${pts.join(" L")} L1000 60 Z`;
  }, [seed]);
  return (
    <div className="seam" style={{ background: from }} aria-hidden="true">
      <svg viewBox="0 0 1000 60" preserveAspectRatio="none">
        <path d={d} fill="#ffffff" transform="translate(0 -6)" />
        <path d={d} fill={to} />
      </svg>
    </div>
  );
}
