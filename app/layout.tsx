import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notarías Sábado Colombia | Consulta por ciudad y fecha",
  description:
    "Consultá qué notarías atienden los sábados en Colombia por fecha, departamento y ciudad. Datos oficiales del Supernotariado actualizados.",
  keywords: [
    "notarías sábado Colombia",
    "notarías abiertas sábado",
    "notarías Medellín sábado",
    "notarías Bogotá sábado",
    "Supernotariado sábado",
    "notarías fin de semana Colombia",
    "horario notarías sábado",
  ],
  openGraph: {
    title: "Notarías Sábado Colombia | Consulta por ciudad y fecha",
    description:
      "Buscá fácilmente qué notarías atienden el sábado en tu ciudad y departamento. Datos oficiales actualizados del Supernotariado de Colombia.",
    type: "website",
    locale: "es_CO",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Notarías Sábado Colombia — Consulta por ciudad y fecha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Notarías Sábado Colombia | Consulta por ciudad y fecha",
    description:
      "Buscá fácilmente qué notarías atienden el sábado en tu ciudad y departamento. Datos oficiales actualizados del Supernotariado de Colombia.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
