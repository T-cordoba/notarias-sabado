"use client";

import { useState, useEffect } from "react";
import { Search, Building2, AlertCircle, RefreshCw, ChevronDown } from "lucide-react";
import { fetchNotarias, fetchDepartamentos, proximoSabado } from "@/lib/api";
import type { Notaria, Departamento } from "@/types/notaria";
import NotariaCard from "@/components/NotariaCard";
import SkeletonCard from "@/components/SkeletonCard";

type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
  // ── Filtros (solo state, no disparan fetch) ───────────────────
  const [fecha, setFecha] = useState<string>(proximoSabado);
  const [selectedDept, setSelectedDept] = useState<string>("Antioquia");
  const [selectedCity, setSelectedCity] = useState<string>("medellin");

  // ── Datos ─────────────────────────────────────────────────────
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [notarias, setNotarias] = useState<Notaria[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const ciudadesDelDept =
    departamentos.find((d) => d.nombre === selectedDept)?.ciudades ?? [];

  // ── Carga departamentos al montar (para los dropdowns) ────────
  useEffect(() => {
    fetchDepartamentos()
      .then(setDepartamentos)
      .catch(() => {});
  }, []);

  // ── Único punto de fetch: el botón Buscar ─────────────────────
  const buscar = async () => {
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
  };

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

      {/* ── Filter bar ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-end gap-3">

            {/* Fecha */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                min="2024-01-06"
                step="7"
                onChange={(e) => setFecha(e.target.value)}
                className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Departamento */}
            <div className="flex flex-col gap-1 min-w-[200px]">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Departamento
              </label>
              <div className="relative">
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    setSelectedCity(""); // reset ciudad cuando cambia depto
                  }}
                  className="w-full appearance-none border border-slate-300 rounded-xl px-3 py-2.5 pr-9 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">Todos los departamentos</option>
                  {departamentos.map((d) => (
                    <option key={d.nombre} value={d.nombre}>{d.nombre}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Ciudad */}
            <div className="flex flex-col gap-1 min-w-[200px]">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Ciudad
              </label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedDept || ciudadesDelDept.length === 0}
                  className="w-full appearance-none border border-slate-300 rounded-xl px-3 py-2.5 pr-9 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <option value="">Todas las ciudades</option>
                  {ciudadesDelDept.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.nombre}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Buscar */}
            <button
              onClick={buscar}
              disabled={status === "loading"}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm self-end"
            >
              {status === "loading"
                ? <RefreshCw className="w-4 h-4 animate-spin" />
                : <Search className="w-4 h-4" />}
              Buscar
            </button>

            {/* Contador */}
            {status === "success" && (
              <span className="text-sm text-slate-500 ml-auto self-end pb-2.5">
                <span className="font-semibold text-slate-800">{notarias.length}</span>{" "}
                notaría{notarias.length !== 1 ? "s" : ""}{" "}
                · <span className="font-medium">{formatFecha(fecha)}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Estado inicial */}
        {status === "idle" && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="bg-blue-50 rounded-full p-5 mb-2">
              <Search className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-700">
              Seleccioná los filtros y presioná Buscar
            </h2>
            <p className="text-slate-500 text-sm max-w-sm">
              Podés filtrar por fecha, departamento y ciudad, o buscar todas las notarías del sábado.
            </p>
          </div>
        )}

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
            <h2 className="text-lg font-semibold text-slate-700">
              Sin resultados
            </h2>
            <p className="text-slate-500 text-sm max-w-sm">
              No hay notarías habilitadas para esta fecha con los filtros seleccionados.
            </p>
          </div>
        )}

        {/* Cards */}
        {status === "success" && notarias.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notarias.map((n) => (
              <NotariaCard key={n.codigo_dane || n.nombre} notaria={n} />
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-center text-xs text-slate-400">
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
        </div>
      </footer>
    </div>
  );
}
