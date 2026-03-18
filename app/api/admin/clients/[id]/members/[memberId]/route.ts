import { apiFetch } from "@/lib/api";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  const { id, memberId } = await params;
  const data = await apiFetch(`/admin/clients/${id}/members/${memberId}`, { method: "DELETE" });
  return NextResponse.json(data);
}
