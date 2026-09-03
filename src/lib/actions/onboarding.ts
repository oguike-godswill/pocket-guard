"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { currentPeriod } from "@/lib/calculations";

export type OnboardingData = {
  incomeName?: string;
  incomeAmount?: number;
  incomeFrequency?: "weekly" | "monthly" | "yearly";
  recurringExpenses?: {
    name: string;
    amount: number;
    category: string;
    frequency: "weekly" | "monthly" | "yearly";
  }[];
  goals?: {
    name: string;
    targetAmount: number;
    targetDate?: string;
  }[];
  bills?: {
    name: string;
    amount: number;
    dueDate: string;
    frequency: "weekly" | "monthly" | "yearly";
  }[];
  planCategories?: { category: string; plannedAmount: number }[];
  startBalance?: number;
};

export async function completeOnboarding(data: OnboardingData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { year, month } = parseCurrent();

  // Create income source
  if (data.incomeName && data.incomeAmount) {
    await prisma.incomeSource.create({
      data: {
        userId: user.id,
        name: data.incomeName,
        amount: data.incomeAmount,
        frequency: data.incomeFrequency ?? "monthly",
      },
    });
  }

  // Create recurring transactions for recurring expenses
  for (const exp of data.recurringExpenses ?? []) {
    await prisma.recurringTransaction.create({
      data: {
        userId: user.id,
        name: exp.name,
        amount: exp.amount,
        type: "expense",
        category: exp.category,
        frequency: exp.frequency,
      },
    });
  }

  // Create goals
  for (const goal of data.goals ?? []) {
    await prisma.savingsGoal.create({
      data: {
        userId: user.id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: 0,
        targetDate: goal.targetDate ? new Date(goal.targetDate) : null,
      },
    });
  }

  // Create bills
  for (const bill of data.bills ?? []) {
    await prisma.bill.create({
      data: {
        userId: user.id,
        name: bill.name,
        amount: bill.amount,
        dueDate: new Date(bill.dueDate),
        frequency: bill.frequency,
        paid: false,
      },
    });
  }

  // Create the monthly plan with budget items
  const planCategories = data.planCategories ?? [
    { category: "Food", plannedAmount: 0 },
    { category: "Transport", plannedAmount: 0 },
    { category: "Housing", plannedAmount: 0 },
    { category: "Bills", plannedAmount: 0 },
  ];

  const plan = await prisma.monthlyPlan.create({
    data: {
      userId: user.id,
      month,
      year,
      budgetItems: {
        create: planCategories.map((c) => ({
          category: c.category,
          plannedAmount: c.plannedAmount,
        })),
      },
    },
  });

  // Create default notification preferences
  await prisma.notificationPreference.create({
    data: { userId: user.id },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { onboardingCompleted: true },
  });

  redirect("/dashboard");
}

function parseCurrent() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

// Re-export for convenience
export { currentPeriod };
