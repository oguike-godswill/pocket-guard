import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { currentPeriod, parsePeriodKey } from "@/lib/calculations";
import { PlanClient } from "@/components/plan/plan-client";

export const metadata = {
  title: "Monthly plan",
  robots: { index: false, follow: false },
};

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { period } = await searchParams;
  const key = period ?? currentPeriod();
  const { year, month } = parsePeriodKey(key);

  const [plan, expenseTxns] = await Promise.all([
    prisma.monthlyPlan.findUnique({
      where: { userId_month_year: { userId: user.id, year, month } },
      include: { budgetItems: true },
    }),
    prisma.transaction.findMany({
      where: {
        userId: user.id,
        type: "expense",
        date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
    }),
  ]);

  const planData = plan
    ? {
        id: plan.id,
        month: plan.month,
        year: plan.year,
        budgetItems: plan.budgetItems.map((b) => ({
          category: b.category,
          plannedAmount: Number(b.plannedAmount),
        })),
      }
    : null;

  return (
    <PlanClient
      plan={planData}
      expenses={expenseTxns.map((t) => ({
        category: t.category,
        amount: Number(t.amount),
        date: t.date.toISOString(),
      }))}
      currency={user.currency ?? "NGN"}
      year={year}
      month={month}
    />
  );
}
