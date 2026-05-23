"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface Props {
  value: string;
  onChange: (date: string) => void;
  min?: string;
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
               "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS  = ["Do","Lu","Ma","Mi","Ju","Vi","Sá"];

function toDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function toStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function formatDisplay(s: string) {
  const [y, m, d] = s.split("-");
  const mes = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"][+m-1];
  return `${d} ${mes} ${y}`;
}

const CLOSE_MS = 150;

export default function SaturdayPicker({ value, onChange, min }: Props) {
  const [open, setOpen]         = useState(false);
  const [closing, setClosing]   = useState(false);
  const [viewYear, setViewY]    = useState(() => toDate(value).getFullYear());
  const [viewMonth, setViewM]   = useState(() => toDate(value).getMonth());
  const ref      = useRef<HTMLDivElement>(null);
  const closeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minDate  = min ? toDate(min) : null;

  const close = useCallback(() => {
    setClosing(true);
    closeRef.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, CLOSE_MS);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", fn);
    return () => {
      document.removeEventListener("mousedown", fn);
      if (closeRef.current) clearTimeout(closeRef.current);
    };
  }, [close]);

  const openCalendar = () => {
    if (open && !closing) { close(); return; }
    if (closeRef.current) clearTimeout(closeRef.current);
    const sel = toDate(value);
    setViewY(sel.getFullYear());
    setViewM(sel.getMonth());
    setClosing(false);
    setOpen(true);
  };

  const selectAndClose = (dateStr: string) => {
    onChange(dateStr);
    close();
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewM(11); setViewY(y => y - 1); }
    else setViewM(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewM(0); setViewY(y => y + 1); }
    else setViewM(m => m + 1);
  };

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay  = new Date(viewYear, viewMonth + 1, 0);
  const cells: (Date | null)[] = Array(firstDay.getDay()).fill(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(viewYear, viewMonth, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const todayStr = toStr(new Date());

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={openCalendar}
        className="flex items-center justify-between w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      >
        <span>{formatDisplay(value)}</span>
        <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {open && (
        <div
          className={`absolute top-full mt-2 left-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 w-80 origin-top ${
            closing ? "animate-fade-down-out" : "animate-fade-up"
          }`}
        >
          {/* Navegación mes */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <span className="text-sm font-semibold text-slate-800">
              {MESES[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Cabecera días */}
          <div className="grid grid-cols-7 mb-1">
            {DIAS.map((label, i) => (
              <div key={label} className={`text-center text-xs font-semibold py-1 ${i === 6 ? "text-blue-600" : "text-slate-400"}`}>
                {label}
              </div>
            ))}
          </div>

          {/* Celdas */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((date, i) => {
              if (!date) return <div key={i} />;
              const isSat      = date.getDay() === 6;
              const dateStr    = toStr(date);
              const isSelected = dateStr === value;
              const isDisabled = !isSat || (minDate ? date < minDate : false);
              const isToday    = dateStr === todayStr;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => selectAndClose(dateStr)}
                  className={[
                    "text-xs h-9 w-full rounded-lg font-medium transition",
                    isSelected
                      ? "bg-blue-600 text-white shadow-sm"
                      : isSat
                        ? "text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                        : "text-slate-200 cursor-default",
                    isToday && !isSelected ? "ring-1 ring-blue-400" : "",
                  ].join(" ")}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Atajo */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const daysToAdd = today.getDay() === 6 ? 0 : (6 - today.getDay() + 7) % 7;
                const sat = new Date(today);
                sat.setDate(today.getDate() + daysToAdd);
                selectAndClose(toStr(sat));
              }}
              className="w-full text-xs text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition rounded-lg py-2"
            >
              Seleccionar sábado más cercano
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
