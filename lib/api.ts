import type { NotariasResponse, Departamento } from "@/types/notaria";

const BASE = "/api";

export async function fetchNotarias(
  fecha: string,
  departamento = "",
  ciudad = ""
): Promise<NotariasResponse> {
  const params = new URLSearchParams({ fecha });
  if (departamento) params.set("departamento", departamento);
  if (ciudad) params.set("ciudad", ciudad);

  const res = await fetch(`${BASE}/notarias?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `Error ${res.status}`);
  }
  return res.json();
}

export async function fetchDepartamentos(): Promise<Departamento[]> {
  const res = await fetch(`${BASE}/departamentos-ciudades`);
  if (!res.ok) throw new Error("No se pudo cargar la lista de departamentos");
  return res.json();
}

/** Calcula el próximo sábado (o hoy si es sábado) en formato YYYY-MM-DD. */
export function proximoSabado(): string {
  const today = new Date();
  const day = today.getDay(); // 0=Dom 6=Sáb
  const daysToAdd = day === 6 ? 0 : (6 - day + 7) % 7;
  const sat = new Date(today);
  sat.setDate(today.getDate() + daysToAdd);
  return sat.toISOString().split("T")[0];
}
