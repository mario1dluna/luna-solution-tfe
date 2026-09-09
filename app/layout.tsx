import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luna Solution — Soluciones digitales claras y accesibles",
  description: "SPA académica de servicios de diseño y desarrollo web construida con Luna Interface System.",
  other: {
    "codex-preview": "development",
  },
  openGraph: {
    title: "Luna Solution — Soluciones digitales",
    description: "Diseño, desarrollo y accesibilidad web desde una base coherente y reutilizable.",
    type: "website",
    images: ["https://luna-civic-tfe.mario1dluna.chatgpt.site/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luna Solution — Soluciones digitales",
    description: "Diseño, desarrollo y accesibilidad web desde una base coherente y reutilizable.",
    images: ["https://luna-civic-tfe.mario1dluna.chatgpt.site/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
