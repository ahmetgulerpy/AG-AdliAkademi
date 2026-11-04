import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/ibm-plex-serif/400.css";
import "@fontsource/ibm-plex-serif/600.css";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { StoreProvider } from "@/components/Store";

export const metadata: Metadata = {
  title: "AG CYBER LAB — Dijital Adli Bilişim Akademisi ve Sanal İnceleme Laboratuvarı",
  description:
    "AG CYBER LAB – DIGITAL FORENSICS ACADEMY & INVESTIGATION ENVIRONMENT. Teorik eğitim, sentetik delil laboratuvarı, delil muhafaza zinciri ve profesyonel adli raporlama.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen">
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
