import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";

export const metadata: Metadata = {
  title: "Laura Escobar — La torre",
};

/** Versión alternativa: el inicio es una torre 3D. */
export default function TorrePage() {
  return <Portfolio mode="tower" />;
}
