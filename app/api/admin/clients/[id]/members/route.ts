import { apiFetch } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await apiFetch(`/admin/clients/${id}/members`);
  return NextResponse.json(data);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data = await apiFetch(`/admin/clients/${id}/members`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return NextResponse.json(data, { status: 201 });
}
