import { dashboardFetch } from "@/lib/api";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const { memberId } = await params;
  const auth = req.headers.get("Authorization") ?? "";
  const data = await dashboardFetch(`/dashboard/members/${memberId}`, auth, {
    method: "DELETE",
  });
  return NextResponse.json(data);
}
