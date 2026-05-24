import { NextResponse } from "next/server";
import { buildHierarchy } from "@/lib/dane";

export const dynamic = "force-static";

const hierarchy = buildHierarchy();

export async function GET() {
  return NextResponse.json(hierarchy, {
    headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
  });
}
