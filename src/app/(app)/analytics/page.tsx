import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AnalyticsClient } from "@/components/analytics/analytics-client";

export const metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Past 6 complete months (including current)
  const now = new Date();
  const months: { start: Date; end: Date; label: string; month: number; year: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      start: new Date(d.getFullYear(), d.getMonth(), 1),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 1),
      label: d.toLocaleDateString("en-NG", { month: "short" }),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    });
  }

  const [txns, plans, bills] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "asc" },
    }),
    prisma.monthlyPlan.findMany({
      where: { userId: user.id },
      include: { budgetItems: true },
    }),
    prisma.bill.findMany({ where: { userId: user.id } }),
  ]);

  const monthLabels = months.map((m) => `${m.label} ${String(m.year).slice(2)}`);

  // Monthly series: income, expenses, planned
  const monthly = months.map((m) => {
    let income = 0;
    let expense = 0;
    for (const t of txns) {
      const dd = new Date(t.date);
      if (dd >= m.start && dd < m.end) {
        if (t.type === "income") income += Number(t.amount);
        else expense += Number(t.amount);
      }
    }
    const plan = plans.find(
      (p) => p.year === m.year && p.month === m.month
    );
    const planned = plan
      ? plan.budgetItems.reduce((s, b) => s + Number(b.plannedAmount), 0)
      : 0;
    return { income, expense, planned };
  });

  // Current month expense by category
  const cur = months[months.length - 1];
  const catMap = new Map<string, number>();
  for (const t of txns) {
    const dd = new Date(t.date);
    if (t.type === "expense" && dd >= cur.start && dd < cur.end) {
      catMap.set(t.category, (catMap.get(t.category) ?? 0) + Number(t.amount));
    }
  }
  const byCategory = [...catMap.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const income = txns
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);
  const expense = txns
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);
  const upcomingBills = bills
    .filter((b) => !b.paid)
    .reduce((s, b) => s + Number(b.amount), 0);

  return (
    <AnalyticsClient
      monthlyLabels={monthLabels}
      monthly={monthly}
      byCategory={byCategory}
      currency={user.currency ?? "NGN"}
      totals={{ income, expense, upcomingBills }}
      hasData={txns.length > 0}
    />
  );
}
