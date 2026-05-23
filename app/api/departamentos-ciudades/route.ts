import { NextResponse } from "next/server";
import { buildHierarchy } from "@/lib/dane";

const hierarchy = buildHierarchy();

export async function GET() {
  return NextResponse.json(hierarchy);
}
