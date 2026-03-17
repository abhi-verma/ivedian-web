import { apiFetch } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await apiFetch(`/admin/leads/${id}/messages`);
  return NextResponse.json(data);
}
