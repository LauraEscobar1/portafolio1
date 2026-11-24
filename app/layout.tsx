import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Didact_Gothic } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-bodoni",
  display: "swap",
});




const didact = Didact_Gothic({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-didact",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Laura Escobar — Ingeniería de software",
  description:
    "Portafolio de Laura Escobar, estudiante de Ingeniería de Software en Pasto, Colombia. Web, móvil, diseño de interfaces e inteligencia artificial.",
};

export const viewport: Viewport = {
  themeColor: "#E6F1FA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${bodoni.variable} ${didact.variable}`}>
      <body>{children}</body>
    </html>
  );
}
