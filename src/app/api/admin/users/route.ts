import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAllUsers } from "@/lib/firestore-api";

export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (err) {
    console.error("[admin/users]", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
