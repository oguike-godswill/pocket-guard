import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { notificationPreferencesSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    return Response.json({ notifications: user.notificationPreference });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const body = await request.json();
    const parsed = notificationPreferencesSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Invalid input");
    }

    const prefs = await prisma.notificationPreference.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...parsed.data },
      update: parsed.data,
    });

    return Response.json({ ok: true, notifications: prefs });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}
