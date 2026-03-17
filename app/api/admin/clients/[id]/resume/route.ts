import { apiFetch } from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await apiFetch(`/admin/clients/${id}/resume`, { method: "POST" });
  return NextResponse.json(data);
}
