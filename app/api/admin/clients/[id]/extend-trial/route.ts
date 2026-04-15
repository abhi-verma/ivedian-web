import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data = await apiFetch(`/admin/clients/${id}/extend-trial`, { method: "POST", body: JSON.stringify(body) });
  revalidatePath(`/api/admin/clients/${id}`);
  revalidatePath("/api/admin/clients");
  return NextResponse.json(data);
}
