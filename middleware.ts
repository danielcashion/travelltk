import { auth } from "@/lib/auth";
import { isAuthConfigured } from "@/lib/config";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = [
  "/account",
  "/checkout",
  "/booking-confirmation",
  "/creator-studio",
  "/admin",
];

export default auth((request) => {
  if (!isAuthConfigured) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtected && !request.auth) {
    const login = new URL("/login", request.nextUrl.origin);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/account/:path*",
    "/checkout/:path*",
    "/booking-confirmation/:path*",
    "/creator-studio/:path*",
    "/admin/:path*",
  ],
};
