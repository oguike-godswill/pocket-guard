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
