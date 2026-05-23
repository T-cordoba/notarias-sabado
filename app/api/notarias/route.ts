import { NextRequest, NextResponse } from "next/server";
import { scrapeNotarias, filterByDepartamento, filterByCiudad } from "@/lib/scraper";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const fecha = params.get("fecha");
  const departamento = params.get("departamento") ?? "";
  const ciudad = params.get("ciudad") ?? "";

  if (!fecha) {
    return NextResponse.json({ error: "Parámetro fecha requerido" }, { status: 422 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return NextResponse.json({ error: "Formato de fecha inválido. Use YYYY-MM-DD" }, { status: 422 });
  }

  try {
    let notarias = await scrapeNotarias(fecha);
    if (departamento) notarias = filterByDepartamento(notarias, departamento);
    if (ciudad) notarias = filterByCiudad(notarias, ciudad);

    return NextResponse.json({ fecha, total: notarias.length, notarias });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error desconocido" },
      { status: 502 }
    );
  }
}
