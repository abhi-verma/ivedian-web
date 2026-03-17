import { apiFetch } from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data = await apiFetch(`/admin/clients/${id}/extend-trial`, { method: "POST", body: JSON.stringify(body) });
  return NextResponse.json(data);
}
