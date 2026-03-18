import { dashboardFetch } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization") ?? "";
  const data = await dashboardFetch("/dashboard/members", auth);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const auth = req.headers.get("Authorization") ?? "";
  const body = await req.json();
  const data = await dashboardFetch("/dashboard/members", auth, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return NextResponse.json(data, { status: 201 });
}
