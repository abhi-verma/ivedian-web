import { apiFetch } from "@/lib/api";
import { NextResponse } from "next/server";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await apiFetch(`/admin/clients/${id}`, { method: "DELETE" });
  return NextResponse.json(data);
}
