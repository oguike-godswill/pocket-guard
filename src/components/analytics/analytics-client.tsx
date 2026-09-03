"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, StatCard } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/money";
import { ArrowRight, BarChart3 } from "lucide-react";

const PIE_COLORS = [
  "#000000",
  "#737373",
  "#a3a3a3",
  "#e5e5e5",
  "#444444",
  "#9ca3af",
];

type MonthlyPoint = { income: number; expense: number; planned: number };

export function AnalyticsClient({
  monthlyLabels,
  monthly,
  byCategory,
  currency,
  totals,
  hasData,
}: {
  monthlyLabels: string[];
  monthly: MonthlyPoint[];
  byCategory: { category: string; amount: number }[];
  currency: string;
  totals: { income: number; expense: number; upcomingBills: number };
  hasData: boolean;
}) {
  const chartData = useMemo(
    () =>
      monthly.map((m, i) => ({
        name: monthlyLabels[i],
        income: Math.round(m.income),
        expense: Math.round(m.expense),
        planned: Math.round(m.planned),
      })),
    [monthly, monthlyLabels]
  );

  const pieData = byCategory.slice(0, 6).map((c) => ({
    name: c.category,
    value: Math.round(c.amount),
  }));

  const savingsRate =
    totals.income > 0
      ? Math.round(
          ((totals.income - totals.expense) / totals.income) * 100
        )
      : 0;

  if (!hasData) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="font-brand text-2xl font-bold text-black">Analytics</h1>
          <p className="mt-1 text-sm text-muted">
            See where your money goes, month by month.
          </p>
        </div>
        <EmptyState
          icon={<BarChart3 className="h-5 w-5" />}
          title="No data yet"
          description="Add a few transactions and you'll see your income, spending and trends here."
          action={
            <Link href="/transactions">
              <span className="inline-flex items-center gap-1 text-sm font-medium text-black hover:underline">
                Go to transactions <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-brand text-2xl font-bold text-black">Analytics</h1>
        <p className="mt-1 text-sm text-muted">
          A clear look at your money over the past six months.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total income" value={formatMoney(totals.income, currency)} tone="positive" />
        <StatCard label="Total expenses" value={formatMoney(totals.expense, currency)} tone="danger" />
        <StatCard
          label="Savings rate"
          value={`${savingsRate}%`}
          hint="of income kept"
          tone={savingsRate >= 20 ? "positive" : savingsRate >= 0 ? "warning" : "danger"}
        />
      </section>

      <Card>
        <h2 className="mb-4 font-brand text-lg font-semibold text-black">
          Income vs expenses
        </h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#737373", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#737373", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip
                formatter={(value, name) => [
                  formatMoney(Number(value ?? 0), currency),
                  String(name),
                ]}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                  fontSize: 13,
                }}
              />
              <Bar dataKey="income" name="Income" fill="#000000" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expense" name="Expenses" fill="#a3a3a3" radius={[3, 3, 0, 0]} />
              <Bar dataKey="planned" name="Planned" fill="#e5e5e5" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-black" /> Income
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-neutral-400" /> Expenses
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-neutral-200" /> Planned
          </span>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-brand text-lg font-semibold text-black">
            Spending this month
          </h2>
          {pieData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No expenses recorded this month yet.
            </p>
          ) : (
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <div className="h-52 w-52 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {pieData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        formatMoney(Number(value ?? 0), currency),
                        String(name),
                      ]}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e5e5e5",
                        fontSize: 13,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="w-full space-y-1.5">
                {pieData.map((c, i) => (
                  <li key={c.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      {c.name}
                    </span>
                    <span className="font-medium text-black tabular">
                      {formatMoney(c.value, currency)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 font-brand text-lg font-semibold text-black">
            Insights
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 rounded-lg bg-soft/60 p-3">
              <span className="mt-0.5 text-base">💡</span>
              <p className="text-muted">
                {totals.income > 0
                  ? `Your savings rate is ${savingsRate}%. ${
                      savingsRate >= 20
                        ? "Great job staying ahead."
                        : savingsRate >= 0
                          ? "Aim for at least 20% to build a buffer."
                          : "You're spending more than you earn this period."
                    }`
                  : "Add income to see your savings rate."}
              </p>
            </li>
            <li className="flex items-start gap-3 rounded-lg bg-soft/60 p-3">
              <span className="mt-0.5 text-base">📅</span>
              <p className="text-muted">
                {totals.upcomingBills > 0
                  ? `You have ${formatMoney(
                      totals.upcomingBills,
                      currency
                    )} in unpaid bills coming up.`
                  : "No unpaid bills — you're all clear."}
              </p>
            </li>
            {byCategory.length > 0 && (
              <li className="flex items-start gap-3 rounded-lg bg-soft/60 p-3">
                <span className="mt-0.5 text-base">🎯</span>
                <p className="text-muted">
                  Your biggest category this month is{" "}
                  <span className="font-medium text-black">
                    {byCategory[0].category}
                  </span>{" "}
                  at {formatMoney(byCategory[0].amount, currency)}.
                </p>
              </li>
            )}
          </ul>
        </Card>
      </div>

      <p className="text-sm text-muted">
        Tip: check your{" "}
        <Link href="/plan" className="font-medium text-black hover:underline">
          monthly plan
        </Link>{" "}
        to compare planned vs actual spending.
      </p>
    </div>
  );
}
