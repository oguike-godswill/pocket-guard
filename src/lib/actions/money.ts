"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { transactionSchema, incomeSourceSchema, savingsGoalSchema, billSchema, contributionSchema } from "@/lib/validations";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function createTransaction(input: {
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  note?: string;
}) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = transactionSchema.safeParse({
    amount: input.amount,
    type: input.type,
    category: input.category,
    date: input.date,
    note: input.note ?? null,
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const { amount, type, category, date, note } = parsed.data;

  await prisma.transaction.create({
    data: {
      userId: user.id,
      amount,
      type,
      category,
      date: new Date(date),
      note: note ?? null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/analytics");
  return { success: true };
}

export async function updateTransaction(
  id: string,
  input: {
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
    note?: string;
  }
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const owned = await prisma.transaction.findFirst({ where: { id, userId: user.id } });
  if (!owned) return { error: "Not found" };

  const parsed = transactionSchema.safeParse({
    amount: input.amount,
    type: input.type,
    category: input.category,
    date: input.date,
    note: input.note ?? null,
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  await prisma.transaction.update({
    where: { id },
    data: {
      amount: parsed.data.amount,
      type: parsed.data.type,
      category: parsed.data.category,
      date: new Date(parsed.data.date),
      note: parsed.data.note ?? null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/analytics");
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const owned = await prisma.transaction.findFirst({ where: { id, userId: user.id } });
  if (!owned) return { error: "Not found" };

  await prisma.transaction.delete({ where: { id } });

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/analytics");
  return { success: true };
}

export async function createIncomeSource(input: {
  name: string;
  amount: number;
  frequency: "weekly" | "monthly" | "yearly";
}) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = incomeSourceSchema.safeParse(input);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  await prisma.incomeSource.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      amount: parsed.data.amount,
      frequency: parsed.data.frequency,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return { success: true };
}

export async function createSavingsGoal(input: {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate?: string;
}) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = savingsGoalSchema.safeParse({
    name: input.name,
    targetAmount: input.targetAmount,
    currentAmount: input.currentAmount ?? 0,
    targetDate: input.targetDate ?? null,
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  await prisma.savingsGoal.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      targetAmount: parsed.data.targetAmount,
      currentAmount: parsed.data.currentAmount,
      targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  return { success: true };
}

export async function addContribution(goalId: string, amount: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const owned = await prisma.savingsGoal.findFirst({
    where: { id: goalId, userId: user.id },
  });
  if (!owned) return { error: "Not found" };

  const parsed = contributionSchema.safeParse({ amount });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  await prisma.savingsGoal.update({
    where: { id: goalId },
    data: { currentAmount: { increment: parsed.data.amount } },
  });

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  return { success: true };
}

export async function updateSavingsGoal(
  id: string,
  input: {
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate?: string;
  }
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const owned = await prisma.savingsGoal.findFirst({ where: { id, userId: user.id } });
  if (!owned) return { error: "Not found" };

  const parsed = savingsGoalSchema.safeParse({
    name: input.name,
    targetAmount: input.targetAmount,
    currentAmount: input.currentAmount,
    targetDate: input.targetDate ?? null,
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  await prisma.savingsGoal.update({
    where: { id },
    data: {
      name: parsed.data.name,
      targetAmount: parsed.data.targetAmount,
      currentAmount: parsed.data.currentAmount,
      targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  return { success: true };
}

export async function deleteSavingsGoal(id: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const owned = await prisma.savingsGoal.findFirst({ where: { id, userId: user.id } });
  if (!owned) return { error: "Not found" };

  await prisma.savingsGoal.delete({ where: { id } });

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  return { success: true };
}

export async function createBill(input: {
  name: string;
  amount: number;
  dueDate: string;
  frequency: "weekly" | "monthly" | "yearly";
}) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = billSchema.safeParse(input);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  await prisma.bill.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      amount: parsed.data.amount,
      dueDate: new Date(parsed.data.dueDate),
      frequency: parsed.data.frequency,
      paid: false,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/bills");
  return { success: true };
}

export async function markBillPaid(id: string, paid: boolean) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const owned = await prisma.bill.findFirst({ where: { id, userId: user.id } });
  if (!owned) return { error: "Not found" };

  await prisma.bill.update({ where: { id }, data: { paid } });

  revalidatePath("/dashboard");
  revalidatePath("/bills");
  return { success: true };
}

export async function updateBill(
  id: string,
  input: {
    name: string;
    amount: number;
    dueDate: string;
    frequency: "weekly" | "monthly" | "yearly";
  }
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const owned = await prisma.bill.findFirst({ where: { id, userId: user.id } });
  if (!owned) return { error: "Not found" };

  const parsed = billSchema.safeParse(input);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  await prisma.bill.update({
    where: { id },
    data: {
      name: parsed.data.name,
      amount: parsed.data.amount,
      dueDate: new Date(parsed.data.dueDate),
      frequency: parsed.data.frequency,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/bills");
  return { success: true };
}

export async function deleteBill(id: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const owned = await prisma.bill.findFirst({ where: { id, userId: user.id } });
  if (!owned) return { error: "Not found" };

  await prisma.bill.delete({ where: { id } });

  revalidatePath("/dashboard");
  revalidatePath("/bills");
  return { success: true };
}
