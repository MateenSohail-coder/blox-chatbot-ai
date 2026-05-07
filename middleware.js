import { NextResponse } from "next/server";
import { gettoken } from "./libs/cookies";
import { verifytoken } from "./libs/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await gettoken(req);
  const AuthRoute = ["/login", "/signup"];
  const ProtectedRoute = [
    "/dashboard",
    "/dashboard/hitory",
    "/dashboard/settings",
  ];
  const isProtected = ProtectedRoute.some((r) => pathname.startsWith(r));
  const isAuth = AuthRoute.some((r) => pathname.startsWith(r));
  let isvalid = false;
  if (token) {
    try {
      await verifytoken(token);
      isvalid = true;
    } catch {
      isvalid = false;
    }
  }
  if (pathname === "/" && isvalid) {
    return NextResponse.redirect(new URL("/dashboard/Chats", req.url));
  }
  if (isAuth && isvalid) {
    return NextResponse.redirect(new URL("/dashboard/Chats", req.url));
  }
  if (isProtected && !isvalid) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/hitory",
    "/dashboard/settings",
    "/login",
    "/signup",
    "/",
  ],
};
