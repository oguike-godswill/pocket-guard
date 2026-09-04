import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { contributionSchema } from "@/lib/validations";

export async function POST(
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
    const parsed = contributionSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Invalid amount");
    }

    const goal = await prisma.savingsGoal.update({
      where: { id },
      data: {
        currentAmount: { increment: parsed.data.amount },
      },
    });

    return Response.json({ ok: true, savingsGoal: goal });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}
