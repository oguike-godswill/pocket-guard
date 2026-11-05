"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { budgetItemSchema } from "@/lib/validations";

export type PlanActionResult = {
  error?: string;
  success?: boolean;
};

export async function saveMonthlyPlan(
  year: number,
  month: number,
  items: { category: string; plannedAmount: number }[]
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  for (const item of items) {
    const parsed = budgetItemSchema.safeParse(item);
    if (!parsed.success) return { error: "Invalid budget item" };
  }

  const plan = await prisma.monthlyPlan.upsert({
    where: { userId_month_year: { userId: user.id, year, month } },
    update: {},
    create: { userId: user.id, year, month },
    include: { budgetItems: true },
  });

  // Delete existing budget items and recreate
  await prisma.budgetItem.deleteMany({ where: { planId: plan.id } });
  await prisma.budgetItem.createMany({
    data: items
      .filter((i) => i.plannedAmount > 0)
      .map((i) => ({
        planId: plan.id,
        category: i.category,
        plannedAmount: i.plannedAmount,
      })),
  });

  revalidatePath("/dashboard");
  revalidatePath("/plan");
  revalidatePath("/analytics");
  return { success: true };
}

/**
 * Copies the monthly plan budget items from the preceding month into the target month.
 */
export async function copyPreviousMonthPlan(targetYear: number, targetMonth: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  // Calculate prior month
  const prevDate = new Date(targetYear, targetMonth - 2, 1);
  const prevYear = prevDate.getFullYear();
  const prevMonth = prevDate.getMonth() + 1;

  const previousPlan = await prisma.monthlyPlan.findUnique({
    where: {
      userId_month_year: {
        userId: user.id,
        year: prevYear,
        month: prevMonth,
      },
    },
    include: { budgetItems: true },
  });

  if (!previousPlan || previousPlan.budgetItems.length === 0) {
    return { error: `No previous budget found for ${prevYear}-${String(prevMonth).padStart(2, "0")}` };
  }

  const items = previousPlan.budgetItems.map((b) => ({
    category: b.category,
    plannedAmount: Number(b.plannedAmount),
  }));

  return saveMonthlyPlan(targetYear, targetMonth, items);
}

/**
 * Calculates average monthly spending by category over the last 3 months
 * and applies or suggests it as a smart starting budget.
 */
export async function generateSmartBudgetFromHistory(targetYear: number, targetMonth: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  // Look back 3 calendar months
  const threeMonthsAgo = new Date(targetYear, targetMonth - 4, 1);
  const currentMonthStart = new Date(targetYear, targetMonth - 1, 1);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      type: "expense",
      date: {
        gte: threeMonthsAgo,
        lt: currentMonthStart,
      },
    },
  });

  if (transactions.length === 0) {
    return { error: "Not enough historical transaction data over the past 3 months to generate recommendations." };
  }

  // Aggregate category sums
  const categoryTotals = new Map<string, number>();
  for (const t of transactions) {
    categoryTotals.set(
      t.category,
      (categoryTotals.get(t.category) ?? 0) + Number(t.amount)
    );
  }

  // Average over 3 months rounded up to nearest 100 for a safety buffer
  const items = Array.from(categoryTotals.entries()).map(([category, sum]) => {
    const rawAvg = sum / 3;
    const rounded = Math.ceil(rawAvg / 100) * 100;
    return {
      category,
      plannedAmount: Math.max(rounded, 1000),
    };
  });

  return saveMonthlyPlan(targetYear, targetMonth, items);
}

export async function deleteMonthlyPlan(year: number, month: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  await prisma.monthlyPlan.deleteMany({
    where: { userId: user.id, year, month },
  });

  revalidatePath("/dashboard");
  revalidatePath("/plan");
  revalidatePath("/analytics");
  return { success: true };
}
