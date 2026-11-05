import { prisma } from "@/lib/prisma";

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
      orderBy: { date: "desc" },
    }),
    prisma.transaction.findMany({
      where: { userId, type: "income", date: { gte: start, lt: end } },
      orderBy: { date: "desc" },
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

  return { user, incomes, expenseTxns, incomeTxns, plan, bills, goals, recentTransactions, year, month };
}

export type DashboardInput = Awaited<ReturnType<typeof getDashboardData>>;

export function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "object" && "toNumber" in (value as object)) {
    return Number((value as { toNumber: () => number }).toNumber());
  }
  return Number(value);
}

/**
 * Total expected/received income for the month.
 * If actual income transactions exist, they are counted. If expected income sources
 * exceed logged transactions (or no income logged yet), the larger realistic expectation is used,
 * preventing double-counting identical salary or income streams.
 */
export function calculateEffectiveIncome(data: DashboardInput): number {
  const loggedIncome = data.incomeTxns.reduce((s, t) => s + toNumber(t.amount), 0);
  const expectedMonthlyIncome = data.incomes.reduce((s, src) => {
    const amt = toNumber(src.amount);
    if (src.frequency === "weekly") return s + amt * 4.33;
    if (src.frequency === "yearly") return s + amt / 12;
    return s + amt;
  }, 0);

  return Math.max(loggedIncome, expectedMonthlyIncome);
}

/**
 * Total spent so far this month
 */
export function calculateActualExpenses(data: DashboardInput): number {
  return data.expenseTxns.reduce((s, t) => s + toNumber(t.amount), 0);
}

/**
 * Total remaining unpaid bills
 */
export function calculateTotalUpcomingBills(data: DashboardInput): number {
  return data.bills.reduce((s, b) => (b.paid ? s : s + toNumber(b.amount)), 0);
}

/**
 * Monthly savings goal target commitment.
 * Calculates what should be contributed *this month* across all active goals,
 * either by targetDate horizon (months remaining) or an even amortized contribution.
 */
export function calculateMonthlySavingsCommitment(data: DashboardInput): number {
  const now = new Date();
  let totalMonthlyTarget = 0;

  for (const g of data.goals) {
    const target = toNumber(g.targetAmount);
    const current = toNumber(g.currentAmount);
    const remaining = Math.max(0, target - current);
    if (remaining <= 0) continue;

    if (g.targetDate) {
      const targetDate = new Date(g.targetDate);
      const monthsLeft =
        (targetDate.getFullYear() - now.getFullYear()) * 12 +
        (targetDate.getMonth() - now.getMonth());
      const effectiveMonths = Math.max(1, monthsLeft);
      totalMonthlyTarget += remaining / effectiveMonths;
    } else {
      // If no deadline, default to steady 10-month progress allocation or remaining
      totalMonthlyTarget += Math.min(remaining, remaining / 10);
    }
  }

  return Math.round(totalMonthlyTarget * 100) / 100;
}

/**
 * Total planned envelope amount for this period
 */
export function calculateTotalPlannedExpenses(data: DashboardInput): number {
  return (data.plan?.budgetItems ?? []).reduce(
    (s, item) => s + toNumber(item.plannedAmount),
    0
  );
}

/**
 * Category-by-category remaining budget accounting for overspending:
 * Remaining envelope = Max(Planned - Spent, 0)
 * Overspent amount = Max(Spent - Planned, 0)
 */
export function calculateBudgetStatus(data: DashboardInput) {
  const spentByCategory = new Map<string, number>();
  for (const t of data.expenseTxns) {
    spentByCategory.set(
      t.category,
      (spentByCategory.get(t.category) ?? 0) + toNumber(t.amount)
    );
  }

  let totalPlanned = 0;
  let totalRemainingPlanned = 0;
  let totalOverspent = 0;

  for (const item of data.plan?.budgetItems ?? []) {
    const planned = toNumber(item.plannedAmount);
    const spent = spentByCategory.get(item.category) ?? 0;
    totalPlanned += planned;

    if (spent > planned) {
      totalOverspent += spent - planned;
    } else {
      totalRemainingPlanned += planned - spent;
    }
  }

  return {
    spentByCategory,
    totalPlanned,
    totalRemainingPlanned,
    totalOverspent,
  };
}

/**
 * Central Elevated Available to Spend:
 * Effective Monthly Inflow
 *  - Actual Outflow (logged expenses)
 *  - Unpaid upcoming bills
 *  - Remaining unspent budgeted envelopes
 *  - Monthly savings commitment
 */
export function calculateAvailableToSpend(data: DashboardInput): number {
  const effectiveIncome = calculateEffectiveIncome(data);
  const actualExpenses = calculateActualExpenses(data);
  const upcomingBills = calculateTotalUpcomingBills(data);
  const monthlySavings = calculateMonthlySavingsCommitment(data);
  const budgetStatus = calculateBudgetStatus(data);

  // If a plan exists, we reserve the remaining unspent budget
  const reservedForPlan = data.plan
    ? budgetStatus.totalRemainingPlanned
    : 0;

  return (
    effectiveIncome -
    actualExpenses -
    upcomingBills -
    reservedForPlan -
    monthlySavings
  );
}

/**
 * Calculate Safe-to-Spend Daily Burn Rate
 */
export function calculateDailySafeToSpend(
  available: number,
  year: number,
  month: number
): { dailyAmount: number; daysRemaining: number; totalDays: number } {
  const now = new Date();
  const isCurrentMonth =
    now.getFullYear() === year && now.getMonth() + 1 === month;

  const totalDays = new Date(year, month, 0).getDate();
  const currentDay = isCurrentMonth ? now.getDate() : 1;
  const daysRemaining = isCurrentMonth
    ? Math.max(1, totalDays - currentDay + 1)
    : totalDays;

  const dailyAmount = available > 0 ? available / daysRemaining : 0;

  return {
    dailyAmount: Math.round(dailyAmount * 100) / 100,
    daysRemaining,
    totalDays,
  };
}
