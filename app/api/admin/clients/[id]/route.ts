import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const revalidate = 30;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await apiFetch(`/admin/clients/${id}`);
  return NextResponse.json(data);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data = await apiFetch(`/admin/clients/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  revalidatePath(`/api/admin/clients/${id}`);
  revalidatePath("/api/admin/clients");
  revalidatePath("/api/admin/metrics");
  revalidatePath(`/admin/clients/${id}`);
  revalidatePath("/admin");
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await apiFetch(`/admin/clients/${id}`, { method: "DELETE" });
  revalidatePath(`/api/admin/clients/${id}`);
  revalidatePath("/api/admin/clients");
  revalidatePath("/api/admin/metrics");
  revalidatePath(`/admin/clients/${id}`);
  revalidatePath("/admin");
  return NextResponse.json(data);
}
