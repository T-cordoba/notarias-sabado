"use client";

import { useState, useEffect, useCallback } from "react";
import { Building2, AlertCircle, RefreshCw, ChevronDown } from "lucide-react";
import SaturdayPicker from "@/components/SaturdayPicker";
import { fetchNotarias, fetchDepartamentos, proximoSabado } from "@/lib/api";
import type { Notaria, Departamento } from "@/types/notaria";
import NotariaCard from "@/components/NotariaCard";
import SkeletonCard from "@/components/SkeletonCard";

type Status = "loading" | "success" | "error";

export default function Home() {
  const [fecha, setFecha] = useState<string>(proximoSabado);
  const [selectedDept, setSelectedDept] = useState<string>("Antioquia");
  const [selectedCity, setSelectedCity] = useState<string>("medellin");

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [notarias, setNotarias] = useState<Notaria[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const ciudadesDelDept =
    departamentos.find((d) => d.nombre === selectedDept)?.ciudades ?? [];

  useEffect(() => {
    fetchDepartamentos().then(setDepartamentos).catch(() => {});
  }, []);

  const buscar = useCallback(async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetchNotarias(fecha, selectedDept, selectedCity);
      setNotarias(res.notarias);
      setStatus("success");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Error desconocido");
      setStatus("error");
    }
  }, [fecha, selectedDept, selectedCity]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  const formatFecha = (f: string) => {
    const [y, m, d] = f.split("-");
    const meses = ["ene","feb","mar","abr","may","jun",
                   "jul","ago","sep","oct","nov","dic"];
    return `${d} ${meses[parseInt(m) - 1]} ${y}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 rounded-xl p-2.5">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Notarías Sábado</h1>
              <p className="text-blue-200 text-sm">
                Supernotariado de Colombia · Consulta de atención sabatina
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── SEO description ────────────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
          <p className="text-xs text-slate-500 text-center">
            Consulta qué notarías tienen turno sabatino en Colombia — filtra por fecha, departamento y ciudad con datos oficiales del Supernotariado. Herramienta no oficial de uso libre.
          </p>
        </div>
      </div>

      {/* ── Filter bar ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

          {/* Grid: 2 cols mobile, flex row desktop */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end">

            {/* Fecha */}
            <div className="col-span-2 sm:col-auto sm:min-w-[155px] flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Fecha
              </label>
              <SaturdayPicker
                value={fecha}
                min="2024-01-06"
                onChange={setFecha}
              />
            </div>

            {/* Departamento */}
            <div className="flex flex-col gap-1 sm:min-w-[190px]">
              <label htmlFor="select-dept" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Departamento
              </label>
              <div className="relative">
                <select
                  id="select-dept"
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    setSelectedCity("");
                  }}
                  className="w-full appearance-none border border-slate-300 rounded-xl px-3 py-2.5 pr-8 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">Todos</option>
                  {departamentos.map((d) => (
                    <option key={d.nombre} value={d.nombre}>{d.nombre}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Ciudad */}
            <div className="flex flex-col gap-1 sm:min-w-[190px]">
              <label htmlFor="select-city" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Ciudad
              </label>
              <div className="relative">
                <select
                  id="select-city"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedDept || ciudadesDelDept.length === 0}
                  className="w-full appearance-none border border-slate-300 rounded-xl px-3 py-2.5 pr-8 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-[background-color,border-color,opacity] disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <option value="">Todas</option>
                  {ciudadesDelDept.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.nombre}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Indicador / contador */}
            <div className="col-span-2 sm:col-auto sm:ml-auto flex items-center self-end pb-0.5">
              {status === "loading" && (
                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Buscando…
                </span>
              )}
              {status === "success" && (
                <span className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-800">{notarias.length}</span>{" "}
                  notaría{notarias.length !== 1 ? "s" : ""}{" "}
                  · <span className="font-medium">{formatFecha(fecha)}</span>
                </span>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Loading */}
        {status === "loading" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="bg-red-50 text-red-600 rounded-2xl p-5 flex items-start gap-3 max-w-lg w-full">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Error al consultar el servicio</p>
                <p className="text-sm mt-1 text-red-500">{errorMsg}</p>
              </div>
            </div>
            <button
              onClick={buscar}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Intentar de nuevo
            </button>
          </div>
        )}

        {/* Sin resultados */}
        {status === "success" && notarias.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="bg-slate-100 rounded-full p-5 mb-2">
              <Building2 className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-700">Sin resultados</h2>
            <p className="text-slate-500 text-sm max-w-sm">
              No hay notarías con turno programado para el {formatFecha(fecha)}
              {selectedCity ? ` en esta ciudad` : selectedDept ? ` en ${selectedDept}` : ""}.
            </p>
            <p className="text-slate-400 text-xs max-w-sm">
              Intenta con otra fecha, busca en un municipio cercano o consulta el departamento completo.
            </p>
          </div>
        )}

        {/* Cards */}
        {status === "success" && notarias.length > 0 && (
          <div>
          <h2 className="sr-only">Notarías encontradas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notarias.map((n, i) => (
              <div
                key={n.codigo_dane || n.nombre}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
              >
                <NotariaCard notaria={n} />
              </div>
            ))}
          </div>
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-slate-400">
            Datos extraídos de{" "}
            <a
              href="https://www.supernotariado.gov.co/notarias-sabado/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-slate-500"
            >
              supernotariado.gov.co
            </a>{" "}
            · Solo notarías con turno sabatino programado
          </p>
          <p className="text-xs text-slate-300 max-w-md">
            Este sitio no es oficial. Existe porque consultar una notaría un sábado
            no debería ser complicado. Herramienta de uso libre, sin fines comerciales.
          </p>
        </div>
      </footer>
    </div>
  );
}
