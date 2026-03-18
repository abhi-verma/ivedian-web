import { NextResponse } from "next/server";

const BASE = process.env.API_BASE_URL!;

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization") ?? "";
  const res = await fetch(`${BASE}/dashboard/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
