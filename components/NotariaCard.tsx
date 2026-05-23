"use client";

import { MapPin, Phone, Mail, Clock, Navigation, Building2 } from "lucide-react";
import type { Notaria } from "@/types/notaria";

interface Props {
  notaria: Notaria;
}

export default function NotariaCard({ notaria }: Props) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-white font-bold text-base leading-snug flex-1">
            {notaria.nombre}
          </h3>
          {notaria.departamento && (
            <span className="shrink-0 bg-white/20 text-white/90 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
              {notaria.departamento}
            </span>
          )}
        </div>
        <p className="text-blue-200 text-xs mt-1.5 font-mono">
          DANE: {notaria.codigo_dane}
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-4 space-y-3">
        {notaria.direccion && (
          <Row icon={<MapPin className="w-4 h-4" />}>
            {notaria.direccion}
          </Row>
        )}

        {notaria.telefono && (
          <Row icon={<Phone className="w-4 h-4" />}>
            {notaria.telefono}
          </Row>
        )}

        {notaria.correo && (
          <Row icon={<Mail className="w-4 h-4" />}>
            <a
              href={`mailto:${notaria.correo}`}
              className="text-blue-600 hover:text-blue-800 hover:underline break-all"
            >
              {notaria.correo}
            </a>
          </Row>
        )}

        {notaria.horario && (
          <Row icon={<Clock className="w-4 h-4" />}>
            <span className="leading-relaxed">{notaria.horario}</span>
          </Row>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 pt-1">
        {notaria.maps_url ? (
          <a
            href={notaria.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Ver ubicación en Maps
          </a>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full bg-slate-100 text-slate-400 text-sm py-2.5 rounded-xl cursor-not-allowed select-none">
            <Navigation className="w-4 h-4" />
            Ubicación no disponible
          </div>
        )}
      </div>
    </article>
  );
}

function Row({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2.5">
      <span className="text-slate-400 shrink-0 mt-0.5">{icon}</span>
      <p className="text-sm text-slate-700">{children}</p>
    </div>
  );
}
