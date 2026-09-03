import { prisma } from "@/lib/prisma";
import type { TransactionType, RecurringFrequency } from "@prisma/client";

export type PeriodKey = string; // "YYYY-MM"

export function periodKey(year: number, month: number): PeriodKey {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function parsePeriodKey(key: PeriodKey): { year: number; month: number } {
  const [year, month] = key.split("-").map(Number);
  return { year, month };
}

export function currentPeriod(): PeriodKey {
  const now = new Date();
  return periodKey(now.getFullYear(), now.getMonth() + 1);
}

export function monthRange(
  year: number,
  month: number
): { start: Date; end: Date } {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 1, 0, 0, 0, 0);
  return { start, end };
}

export async function getDashboardData(
  userId: string,
  key: PeriodKey = currentPeriod()
) {
  const { year, month } = parsePeriodKey(key);
  const { start, end } = monthRange(year, month);

  const [
    user,
    incomes,
    expenseTxns,
    incomeTxns,
    plan,
    bills,
    goals,
    recentTransactions,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.incomeSource.findMany({ where: { userId } }),
    prisma.transaction.findMany({
      where: { userId, type: "expense", date: { gte: start, lt: end } },
    }),
    prisma.transaction.findMany({
      where: { userId, type: "income", date: { gte: start, lt: end } },
    }),
    prisma.monthlyPlan.findUnique({
      where: { userId_month_year: { userId, year, month } },
      include: { budgetItems: true },
    }),
    prisma.bill.findMany({ where: { userId, paid: false } }),
    prisma.savingsGoal.findMany({ where: { userId } }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 6,
    }),
  ]);

  return { user, incomes, expenseTxns, incomeTxns, plan, bills, goals, recentTransactions };
}

export type DashboardInput = Awaited<ReturnType<typeof getDashboardData>>;

function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "object" && "toNumber" in (value as object)) {
    return Number((value as { toNumber: () => number }).toNumber());
  }
  return Number(value);
}

/**
 * Central calculation for Available to Spend:
 * current money + expected income − upcoming bills − planned expenses − savings commitments
 */
export function calculateAvailableToSpend(data: DashboardInput): number {
  const currentMoney = calculateCurrentMoney(data);
  const upcomingBills = calculateTotalUpcomingBills(data);
  const plannedExpenses = calculateTotalPlannedExpenses(data);
  const savingsCommitments = calculateTotalSavingsCommitments(data);
  return currentMoney - upcomingBills - plannedExpenses - savingsCommitments;
}

export function calculateCurrentMoney(data: DashboardInput): number {
  let total = 0;
  for (const t of data.incomeTxns) total += toNumber(t.amount);
  for (const s of data.incomes) total += toNumber(s.amount);
  return total;
}

export function calculateTotalIncome(data: DashboardInput): number {
  let total = 0;
  for (const t of data.incomeTxns) total += toNumber(t.amount);
  for (const s of data.incomes) total += toNumber(s.amount);
  return total;
}

export function calculateTotalPlannedExpenses(data: DashboardInput): number {
  let total = 0;
  for (const item of data.plan?.budgetItems ?? []) {
    total += toNumber(item.plannedAmount);
  }
  return total;
}

export function calculateTotalSavingsCommitments(data: DashboardInput): number {
  let total = 0;
  for (const g of data.goals) {
    const target = toNumber(g.targetAmount);
    const current = toNumber(g.currentAmount);
    if (target > current) total += target - current;
  }
  return total;
}

export function calculateTotalUpcomingBills(data: DashboardInput): number {
  let total = 0;
  for (const b of data.bills) {
    if (!b.paid) total += toNumber(b.amount);
  }
  return total;
}
