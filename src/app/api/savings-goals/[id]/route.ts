import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { savingsGoalSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireApiAuth(request);
    const { id } = await params;

    const existing = await prisma.savingsGoal.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return jsonError("Goal not found", 404);

    const body = await request.json();
    const parsed = savingsGoalSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.flatten().fieldErrors.name?.[0] ?? "Invalid input");
    }

    const goal = await prisma.savingsGoal.update({
      where: { id },
      data: {
        name: parsed.data.name,
        targetAmount: parsed.data.targetAmount,
        currentAmount: parsed.data.currentAmount ?? 0,
        targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : null,
      },
    });

    return Response.json({ ok: true, savingsGoal: goal });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireApiAuth(request);
    const { id } = await params;

    const existing = await prisma.savingsGoal.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return jsonError("Goal not found", 404);

    await prisma.savingsGoal.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}
