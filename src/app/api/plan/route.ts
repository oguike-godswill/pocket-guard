import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { budgetItemSchema } from "@/lib/validations";

const planItemSchema = budgetItemSchema;

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const url = new URL(request.url);
    const year = parseInt(url.searchParams.get("year") ?? String(new Date().getFullYear()));
    const month = parseInt(url.searchParams.get("month") ?? String(new Date().getMonth() + 1));

    const plan = await prisma.monthlyPlan.findUnique({
      where: { userId_month_year: { userId: user.id, year, month } },
      include: { budgetItems: true },
    });

    return Response.json({ plan: plan ?? null });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const body = await request.json();
    const { year, month, items } = body as {
      year: number;
      month: number;
      items: { category: string; plannedAmount: number }[];
    };

    if (!year || !month || !Array.isArray(items)) {
      return jsonError("year, month, and items[] are required");
    }

    for (const item of items) {
      const parsed = planItemSchema.safeParse(item);
      if (!parsed.success) {
        return jsonError(`Invalid budget item: ${parsed.error.flatten().fieldErrors.category?.[0] ?? "unknown"}`);
      }
    }

    const plan = await prisma.monthlyPlan.upsert({
      where: { userId_month_year: { userId: user.id, year, month } },
      create: {
        userId: user.id,
        year,
        month,
        budgetItems: {
          create: items
            .filter((i) => i.plannedAmount > 0)
            .map((i) => ({ category: i.category, plannedAmount: i.plannedAmount })),
        },
      },
      update: {
        budgetItems: {
          deleteMany: {},
          create: items
            .filter((i) => i.plannedAmount > 0)
            .map((i) => ({ category: i.category, plannedAmount: i.plannedAmount })),
        },
      },
      include: { budgetItems: true },
    });

    return Response.json({ ok: true, plan });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const url = new URL(request.url);
    const year = parseInt(url.searchParams.get("year") ?? "0");
    const month = parseInt(url.searchParams.get("month") ?? "0");

    if (!year || !month) return jsonError("year and month query params required");

    const existing = await prisma.monthlyPlan.findFirst({
      where: { userId: user.id, year, month },
    });
    if (!existing) return jsonError("Plan not found", 404);

    await prisma.monthlyPlan.delete({
      where: { userId_month_year: { userId: user.id, year, month } },
    });

    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}
