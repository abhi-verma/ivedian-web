import { apiFetch } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await apiFetch(`/admin/clients/${id}`);
  return NextResponse.json(data);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data = await apiFetch(`/admin/clients/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await apiFetch(`/admin/clients/${id}`, { method: "DELETE" });
  return NextResponse.json(data);
}
