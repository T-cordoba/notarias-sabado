import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notarías Sábado | Supernotariado Colombia",
  description: "Consulta las notarías habilitadas para atención los sábados en Colombia",
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
