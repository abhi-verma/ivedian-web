import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const revalidate = 30;

export async function GET() {
  const data = await apiFetch("/admin/clients");
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const data = await apiFetch("/admin/activate-client", { method: "POST", body: JSON.stringify(body) });
    revalidatePath("/api/admin/clients");
    revalidatePath("/api/admin/metrics");
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("409") ? 409 : 500;
    return NextResponse.json({ detail: message }, { status });
  }
}
