import type { Metadata } from "next";
import { Playfair_Display, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Sebastian D. Pinzon | Data Infrastructure Architect",
  description: "Estrategia y arquitectura de datos de alto rendimiento.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="...">
        <Navbar />
        {children}
      </body>
    </html>
  );
}