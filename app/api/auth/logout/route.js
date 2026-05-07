import { NextResponse } from "next/server";
export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("practice", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
