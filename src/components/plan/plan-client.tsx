"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, AlertTriangle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, StatCard } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { MonthNav } from "@/components/app/month-nav";
import { useToast } from "@/components/ui/toast";
import { saveMonthlyPlan } from "@/lib/actions/plan";
import { formatMoney } from "@/lib/money";
import { EXPENSE_CATEGORIES } from "@/lib/categories";

type PlanBudgetItem = { category: string; plannedAmount: number };
type Expense = { category: string; amount: number; date: string };

const SUGGESTED = EXPENSE_CATEGORIES.map((c) => c.name);

export function PlanClient({
  plan,
  expenses,
  currency,
  year,
  month,
}: {
  plan: {
    id: string;
    month: number;
    year: number;
    budgetItems: PlanBudgetItem[];
  } | null;
  expenses: Expense[];
  currency: string;
  year: number;
  month: number;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const initialItems = useMemo(() => {
    if (plan && plan.budgetItems.length > 0) {
      return plan.budgetItems.map((b) => ({
        category: b.category,
        plannedAmount: String(b.plannedAmount),
      }));
    }
    return [
      { category: "Housing", plannedAmount: "" },
      { category: "Food", plannedAmount: "" },
      { category: "Transport", plannedAmount: "" },
      { category: "Bills", plannedAmount: "" },
    ];
  }, [plan]);

  const [items, setItems] = useState<
    { category: string; plannedAmount: string }[]
  >(initialItems);
  const [saving, setSaving] = useState(false);

  const spentByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) {
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    }
    return map;
  }, [expenses]);

  const rows = useMemo(() => {
    return items;
  }, [items]);

  const totalPlanned = rows.reduce(
    (s, r) => s + (Number(r.plannedAmount) || 0),
    0
  );
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = totalPlanned - totalSpent;

  function updateAmount(index: number, value: string) {
    setItems((prev) =>
      prev.map((r, i) => (i === index ? { ...r, plannedAmount: value } : r))
    );
  }

  function updateCategory(index: number, category: string) {
    setItems((prev) =>
      prev.map((r, i) => (i === index ? { ...r, category } : r))
    );
  }

  function addRow() {
    setItems((prev) => [
      ...prev,
      { category: SUGGESTED[prev.length % SUGGESTED.length], plannedAmount: "" },
    ]);
  }

  function removeRow(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    const payload = rows
      .filter((r) => r.category && Number(r.plannedAmount) > 0)
      .map((r) => ({
        category: r.category,
        plannedAmount: Number(r.plannedAmount),
      }));
    if (payload.length === 0) {
      toast("error", "Add at least one planned amount");
      setSaving(false);
      return;
    }
    const result = await saveMonthlyPlan(year, month, payload);
    setSaving(false);
    if (result.success) {
      toast("success", "Plan saved");
      router.refresh();
    } else {
      toast("error", result.error ?? "Could not save plan");
    }
  }

  const hasPlan = Boolean(plan && plan.budgetItems.length > 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-brand text-2xl font-bold text-black">Monthly plan</h1>
          <p className="mt-1 text-sm text-muted">
            Plan your spending before the month begins.
          </p>
        </div>
        <MonthNav year={year} month={month} basePath="/plan" />
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total planned" value={formatMoney(totalPlanned, currency)} />
        <StatCard label="Total spent" value={formatMoney(totalSpent, currency)} tone="danger" />
        <StatCard
          label="Remaining"
          value={formatMoney(remaining, currency)}
          tone={remaining >= 0 ? "positive" : "danger"}
        />
      </section>

      {!hasPlan && (
        <EmptyState
          icon={<Wallet className="h-5 w-5" />}
          title="No plan for this month"
          description="Set how much you plan to spend in each category below, then save your plan."
        />
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-brand text-lg font-semibold text-black">
            Category budgets
          </h2>
          <Button variant="secondary" size="sm" onClick={addRow}>
            <Plus className="h-4 w-4" /> Add category
          </Button>
        </div>

        <div className="space-y-3">
          {rows.map((row, index) => {
            const spent = spentByCategory.get(row.category) ?? 0;
            const planned = Number(row.plannedAmount) || 0;
            const pct = planned > 0 ? Math.round((spent / planned) * 100) : 0;
            const over = planned > 0 && spent > planned;
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-soft/50 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Select
                    className="flex-1"
                    value={row.category}
                    onChange={(e) => updateCategory(index, e.target.value)}
                    aria-label={`Category ${index + 1}`}
                  >
                    {SUGGESTED.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted">Planned</span>
                    <input
                      type="number"
                      min="0"
                      className="h-10 w-28 rounded-lg border border-border bg-white px-3 text-right text-sm tabular focus:outline-2 focus:outline-offset-2 focus:outline-black"
                      value={row.plannedAmount}
                      onChange={(e) => updateAmount(index, e.target.value)}
                      placeholder="0"
                      aria-label={`Planned amount for ${row.category}`}
                    />
                    <button
                      className="rounded-md p-2 text-muted hover:bg-soft hover:text-danger"
                      onClick={() => removeRow(index)}
                      aria-label={`Remove ${row.category}`}
                    >
                      <Plus className="h-4 w-4 rotate-45" />
                    </button>
                  </div>
                </div>
                {planned > 0 && (
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted">
                        Spent: {formatMoney(spent, currency)}
                      </span>
                      <span
                        className={`font-medium ${
                          over ? "text-danger" : "text-muted"
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                    <Progress
                      value={pct}
                      tone={over ? "danger" : pct > 80 ? "warning" : "default"}
                    />
                    {over && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-danger">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Over this category's budget.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} loading={saving}>
            <Save className="h-4 w-4" /> Save plan
          </Button>
        </div>
      </Card>

      <p className="text-sm text-muted">
        Your plan feeds into your <span className="font-medium text-black">Available to Spend</span>.
        Adjust it any time — it's recalculated automatically.
      </p>
    </div>
  );
}
