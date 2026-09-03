import { NextResponse } from "next/server";
import { getSessionToken, destroySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  await destroySession();
  const res = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
  res.cookies.delete("pocketguard_session");
  return res;
}
