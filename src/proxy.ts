import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "pocketguard_session";
const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-insecure-secret-change-me"
);

const AUTH_PATHS = ["/login", "/register", "/forgot-password"];
const PROTECTED_PATHS = [
  "/dashboard",
  "/plan",
  "/goals",
  "/bills",
  "/analytics",
  "/settings",
  "/transactions",
  "/onboarding",
];

async function hasSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await hasSession(request);

  if (!session && PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/plan/:path*",
    "/goals/:path*",
    "/bills/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/transactions/:path*",
    "/onboarding/:path*",
    "/login/:path*",
    "/register/:path*",
    "/forgot-password/:path*",
  ],
};
