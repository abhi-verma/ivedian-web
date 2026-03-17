import { apiFetch } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await apiFetch("/admin/metrics");
  return NextResponse.json(data);
}
