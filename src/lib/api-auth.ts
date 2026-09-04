import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-insecure-secret-change-me"
);

export type ApiSession = {
  userId: string;
  email: string;
  name: string;
};

export async function verifyApiAuth(
  request: NextRequest
): Promise<ApiSession | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.userId || typeof payload.userId !== "string") return null;
    return {
      userId: payload.userId,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function requireApiAuth(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { notificationPreference: true },
  });
  if (!user) throw new Error("UNAUTHORIZED");
  return { session, user };
}

export function jsonError(message: string, status: number = 400) {
  return Response.json({ error: message }, { status });
}

export function jsonSuccess(data: Record<string, unknown> = {}) {
  return Response.json({ ok: true, ...data });
}
