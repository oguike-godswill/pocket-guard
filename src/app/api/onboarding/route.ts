import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const body = await request.json();

    const {
      incomeSource,
      recurringExpenses,
      savingsGoals,
      bills,
      monthlyPlan,
      notifications,
    } = body as {
      incomeSource?: { name: string; amount: number; frequency: string };
      recurringExpenses?: { name: string; amount: number; type: string; category: string; frequency: string }[];
      savingsGoals?: { name: string; targetAmount: number; currentAmount?: number; targetDate?: string }[];
      bills?: { name: string; amount: number; dueDate: string; frequency: string }[];
      monthlyPlan?: { month: number; year: number; items: { category: string; plannedAmount: number }[] };
      notifications?: { emailDigest: boolean; billReminders: boolean; goalProgress: boolean; weeklySummary: boolean };
    };

    const txs: any[] = [];

    if (incomeSource?.name && incomeSource.amount) {
      txs.push(
        prisma.incomeSource.create({
          data: {
            userId: user.id,
            name: incomeSource.name,
            amount: incomeSource.amount,
            frequency: incomeSource.frequency as any,
          },
        })
      );
    }

    if (recurringExpenses?.length) {
      for (const exp of recurringExpenses) {
        txs.push(
          prisma.recurringTransaction.create({
            data: {
              userId: user.id,
              name: exp.name,
              amount: exp.amount,
              type: exp.type as any,
              category: exp.category,
              frequency: exp.frequency as any,
            },
          })
        );
      }
    }

    if (savingsGoals?.length) {
      for (const g of savingsGoals) {
        txs.push(
          prisma.savingsGoal.create({
            data: {
              userId: user.id,
              name: g.name,
              targetAmount: g.targetAmount,
              currentAmount: g.currentAmount ?? 0,
              targetDate: g.targetDate ? new Date(g.targetDate) : null,
            },
          })
        );
      }
    }

    if (bills?.length) {
      for (const b of bills) {
        txs.push(
          prisma.bill.create({
            data: {
              userId: user.id,
              name: b.name,
              amount: b.amount,
              dueDate: new Date(b.dueDate),
              frequency: b.frequency as any,
            },
          })
        );
      }
    }

    if (monthlyPlan?.items?.length) {
      txs.push(
        prisma.monthlyPlan.create({
          data: {
            userId: user.id,
            year: monthlyPlan.year,
            month: monthlyPlan.month,
            budgetItems: {
              create: monthlyPlan.items
                .filter((i) => i.plannedAmount > 0)
                .map((i) => ({ category: i.category, plannedAmount: i.plannedAmount })),
            },
          },
        })
      );
    }

    if (notifications) {
      txs.push(
        prisma.notificationPreference.create({
          data: { userId: user.id, ...notifications },
        })
      );
    }

    await prisma.$transaction([
      ...txs,
      prisma.user.update({
        where: { id: user.id },
        data: { onboardingCompleted: true },
      }),
    ]);

    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}
