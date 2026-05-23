import type { Metadata } from "next";
import "./globals.css";

const desc =
  "Herramienta no oficial que mejora la consulta de notarías con turno sabatino en Colombia. Filtrá por ciudad — función ausente en el sitio oficial — con una interfaz moderna, intuitiva y optimizada para móvil. Datos directos del Supernotariado.";

export const metadata: Metadata = {
  title: "Notarías Sábado Colombia | Consulta por ciudad y fecha",
  description: desc,
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
    description: desc,
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
    description: desc,
    images: ["/og.png"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Notarías Sábado Colombia",
  url: "https://notarias-sabado.vercel.app",
  description: desc,
  applicationCategory: "GovernmentService",
  operatingSystem: "All",
  inLanguage: "es-CO",
  offers: { "@type": "Offer", price: "0", priceCurrency: "COP" },
  provider: {
    "@type": "Organization",
    name: "Supernotariado de Colombia",
    url: "https://www.supernotariado.gov.co",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
