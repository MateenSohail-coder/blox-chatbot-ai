import { gettoken } from "@/libs/cookies";
import { verifytoken } from "@/libs/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = await gettoken(req);
  if (!token) {
    return NextResponse.json({ message: "token not found" }, { status: 401 });
  }
  const data = await verifytoken(token);
  if (!data) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  return NextResponse.json({
    username: data.username,
    userId: data.userid,
    userEmail: data.email,
  });
}
