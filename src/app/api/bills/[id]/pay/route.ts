import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireApiAuth(request);
    const { id } = await params;

    const existing = await prisma.bill.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return jsonError("Bill not found", 404);

    const body = await request.json();
    const paid = typeof body.paid === "boolean" ? body.paid : !existing.paid;

    const bill = await prisma.bill.update({
      where: { id },
      data: { paid },
    });

    return Response.json({ ok: true, bill });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}
