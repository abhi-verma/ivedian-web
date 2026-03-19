import { apiFetch } from "@/lib/api";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  const { id, memberId } = await params;
  try {
    const data = await apiFetch(`/admin/clients/${id}/members/${memberId}`, { method: "DELETE" });
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("404") ? 404 : message.includes("422") ? 422 : 500;
    return NextResponse.json({ detail: message }, { status });
  }
}
