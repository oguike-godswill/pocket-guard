import Link from "next/link";
import { redirect } from "next/navigation";
import {
  TrendingUp,
  Receipt,
  CalendarRange,
  PiggyBank,
  ArrowRightCircle,
  Plus,
  AlertTriangle,
  Wallet,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import {
  getDashboardData,
  currentPeriod,
  calculateAvailableToSpend,
  calculateEffectiveIncome,
  calculateMonthlySavingsCommitment,
  calculateTotalUpcomingBills,
  calculateBudgetStatus,
  calculateDailySafeToSpend,
} from "@/lib/calculations";
import { formatMoney } from "@/lib/money";
import { StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { DashboardQuickActions } from "@/components/app/dashboard-quick-actions";
import { CategoryChip } from "@/components/ui/category-chip";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { period } = await searchParams;
  const key = period ?? currentPeriod();
  const data = await getDashboardData(user.id, key);

  const available = calculateAvailableToSpend(data);
  const currency = data.user?.currency ?? "NGN";
  const dailyMetrics = calculateDailySafeToSpend(available, data.year, data.month);

  const effectiveIncome = calculateEffectiveIncome(data);
  const budgetStatus = calculateBudgetStatus(data);
  const totalPlanned = budgetStatus.totalPlanned;
  const totalBills = calculateTotalUpcomingBills(data);
  const monthlySavingsGoal = calculateMonthlySavingsCommitment(data);

  const spentByCategory = new Map<string, number>();
  for (const t of data.expenseTxns) {
    spentByCategory.set(
      t.category,
      (spentByCategory.get(t.category) ?? 0) + Number(t.amount)
    );
  }
  const categoryRows = [...spentByCategory.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-brand text-2xl font-bold text-black">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted">Here's your money at a glance.</p>
        </div>
        <DashboardQuickActions />
      </div>

      {/* Available to Spend hero */}
      <section className="relative overflow-hidden rounded-2xl bg-black p-6 text-white sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-sm font-medium uppercase tracking-wider text-white/70">Safe-to-Spend Balance</p>
            </div>
            <p className="mt-2 font-brand text-4xl font-bold tracking-tight tabular sm:text-6xl">
              {formatMoney(available, currency)}
            </p>
            <p className="mt-2 text-sm text-white/70">
              {available >= 0
                ? "Safe after bills, monthly savings commitments & envelopes."
                : "Your commitments exceed available funds — adjust your plan."}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm sm:min-w-[220px]">
            <p className="text-xs font-medium uppercase tracking-wider text-white/60">Daily Spending Pace</p>
            <p className="mt-1 font-brand text-2xl font-bold tabular text-white">
              {formatMoney(dailyMetrics.dailyAmount, currency)}
              <span className="text-xs font-normal text-white/60"> / day</span>
            </p>
            <p className="mt-1 text-xs text-white/60">
              {dailyMetrics.daysRemaining} days remaining this month
            </p>
          </div>
        </div>
        <div className="absolute right-6 top-6 hidden lg:block" aria-hidden="true">
          <TrendingUp className="h-12 w-12 text-white/10" />
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Effective income"
          value={formatMoney(effectiveIncome, currency)}
          tone="positive"
        />
        <StatCard
          label="Planned expenses"
          value={formatMoney(totalPlanned, currency)}
          hint={data.plan ? `${data.plan.budgetItems.length} categories` : "No plan yet"}
        />
        <StatCard
          label="Monthly savings target"
          value={formatMoney(monthlySavingsGoal, currency)}
          hint={data.goals.length ? `${data.goals.length} active goals` : "No goals yet"}
        />
        <StatCard
          label="Upcoming bills"
          value={formatMoney(totalBills, currency)}
          hint={data.bills.length ? `${data.bills.length} unpaid` : "No bills"}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent transactions */}
        <section className="lg:col-span-2">
          <Card className="h-full">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-brand text-lg font-semibold text-black">
                Recent transactions
              </h2>
              <Link
                href="/transactions"
                className="text-sm font-medium text-muted hover:text-black"
              >
                View all
              </Link>
            </div>
            {data.recentTransactions.length === 0 ? (
              <EmptyState
                icon={<Receipt className="h-5 w-5" />}
                title="No transactions yet"
                description="Add your first income or expense to start tracking where your money goes."
              />
            ) : (
              <ul className="divide-y divide-border">
                {data.recentTransactions.slice(0, 5).map((t) => (
                  <li key={t.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          t.type === "income"
                            ? "bg-positive-soft text-positive"
                            : "bg-soft text-black"
                        }`}
                      >
                        {t.type === "income" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <Receipt className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">
                          {t.note || t.category}
                        </p>
                        <p className="text-xs text-muted">
                          {t.category} ·{" "}
                          {new Date(t.date).toLocaleDateString("en-NG", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium tabular ${
                        t.type === "income" ? "text-positive" : "text-black"
                      }`}
                    >
                      {t.type === "income" ? "+" : "−"}
                      {formatMoney(t.amount, currency)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        {/* Spending by category */}
        <section>
          <Card className="h-full">
            <h2 className="mb-4 font-brand text-lg font-semibold text-black">
              Spending by category
            </h2>
            {categoryRows.length === 0 ? (
              <EmptyState
                icon={<Wallet className="h-5 w-5" />}
                title="No spending this period"
                description="Expenses you add will appear here by category."
              />
            ) : (
              <ul className="space-y-3">
                {categoryRows.slice(0, 5).map(([cat, amt]) => {
                  const pct =
                    totalPlanned > 0
                      ? Math.min(100, Math.round((amt / totalPlanned) * 100))
                      : 0;
                  return (
                    <li key={cat}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <CategoryChip name={cat} />
                        <span className="tabular text-muted">
                          {formatMoney(amt, currency)}
                        </span>
                      </div>
                      {totalPlanned > 0 && (
                        <Progress
                          value={pct}
                          tone={pct > 100 ? "danger" : "default"}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </section>
      </div>

      {/* Savings goals progress */}
      <section>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-brand text-lg font-semibold text-black">
              Savings goals
            </h2>
            <Link href="/goals" className="text-sm font-medium text-muted hover:text-black">
              View all
            </Link>
          </div>
          {data.goals.length === 0 ? (
            <EmptyState
              icon={<PiggyBank className="h-5 w-5" />}
              title="No savings goals yet"
              description="Create a savings goal to track progress toward what matters."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.goals.slice(0, 3).map((g) => {
                const pct =
                  Number(g.targetAmount) > 0
                    ? Math.round(
                        (Number(g.currentAmount) / Number(g.targetAmount)) * 100
                      )
                    : 0;
                return (
                  <div key={g.id} className="rounded-xl border border-border bg-soft/50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-black">{g.name}</p>
                      <Badge tone={pct >= 100 ? "positive" : pct > 0 ? "warning" : "neutral"}>
                        {pct}%
                      </Badge>
                    </div>
                    <Progress value={pct} className="mt-3" />
                    <div className="mt-2 flex justify-between text-xs text-muted">
                      <span className="tabular">
                        {formatMoney(Number(g.currentAmount), currency)}
                      </span>
                      <span className="tabular">
                        {formatMoney(Number(g.targetAmount), currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </section>

      {/* Quick action strip */}
      <section className="rounded-2xl border border-border bg-white p-5">
        <h2 className="mb-4 font-brand text-lg font-semibold text-black">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: TrendingUp, label: "Add income", href: "/transactions?type=income" },
            { icon: Receipt, label: "Add expense", href: "/transactions" },
            { icon: ArrowRightCircle, label: "Add bill", href: "/bills" },
            { icon: PiggyBank, label: "Add goal", href: "/goals" },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-colors hover:bg-soft"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
                <a.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-black">{a.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
