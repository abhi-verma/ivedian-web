import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await apiFetch(`/admin/clients/${id}/pause`, { method: "POST" });
  revalidatePath(`/api/admin/clients/${id}`);
  revalidatePath("/api/admin/clients");
  revalidatePath("/api/admin/metrics");
  revalidatePath(`/admin/clients/${id}`);
  revalidatePath("/admin");
  return NextResponse.json(data);
}
