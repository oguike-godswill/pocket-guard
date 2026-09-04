import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { savingsGoalSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const goals = await prisma.savingsGoal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return Response.json({ savingsGoals: goals });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const body = await request.json();
    const parsed = savingsGoalSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.flatten().fieldErrors.name?.[0] ?? "Invalid input");
    }

    const goal = await prisma.savingsGoal.create({
      data: {
        userId: user.id,
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
