"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, PiggyBank, Pencil, TrendingUp, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { GoalForm } from "@/components/modals/goal-form";
import { formatMoney } from "@/lib/money";

type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
};

export function GoalsClient({
  goals: initialGoals,
  currency,
}: {
  goals: Goal[];
  currency: string;
}) {
  const router = useRouter();
  const [goals, setGoals] = useState(initialGoals);
  const [modal, setModal] = useState<{ open: boolean; existing?: Goal | null }>({
    open: false,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-brand text-2xl font-bold text-black">Savings goals</h1>
          <p className="mt-1 text-sm text-muted">Save for what matters to you.</p>
        </div>
        <Button onClick={() => setModal({ open: true, existing: null })}>
          <Plus className="h-4 w-4" /> New goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon={<PiggyBank className="h-5 w-5" />}
          title="No savings goals yet"
          description="Create your first goal, set a target and a date, and watch your progress grow."
          action={
            <Button onClick={() => setModal({ open: true, existing: null })}>
              <Plus className="h-4 w-4" /> Create a goal
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {goals.map((g) => {
            const pct =
              g.targetAmount > 0
                ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))
                : 0;
            const isComplete = pct >= 100;

            // Suggested contribution: to hit target by date
            let suggested: string | null = null;
            if (g.targetDate && !isComplete) {
              const monthsLeft = Math.max(
                1,
                Math.ceil(
                  (new Date(g.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
                )
              );
              suggested = formatMoney(
                (g.targetAmount - g.currentAmount) / monthsLeft,
                currency
              );
            }

            return (
              <Card
                key={g.id}
                className="flex flex-col"
                onClick={() => setModal({ open: true, existing: g })}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h2 className="font-brand text-lg font-semibold text-black">
                      {g.name}
                    </h2>
                    {g.targetDate && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                        <CalendarClock className="h-3.5 w-3.5" />
                        Target:{" "}
                        {new Date(g.targetDate).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                  <Badge tone={isComplete ? "positive" : pct > 0 ? "warning" : "neutral"}>
                    {pct}%
                  </Badge>
                </div>

                <Progress value={pct} tone={isComplete ? "positive" : "default"} />

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted">
                    Saved:{" "}
                    <span className="font-medium text-black tabular">
                      {formatMoney(g.currentAmount, currency)}
                    </span>
                  </span>
                  <span className="text-muted">
                    Goal:{" "}
                    <span className="font-medium text-black tabular">
                      {formatMoney(g.targetAmount, currency)}
                    </span>
                  </span>
                </div>

                <div className="mt-4 flex flex-1 items-end justify-between gap-2">
                  {suggested ? (
                    <p className="flex items-center gap-1 text-xs text-muted">
                      <TrendingUp className="h-3.5 w-3.5 text-positive" />
                      ~{suggested}/month to stay on pace
                    </p>
                  ) : (
                    <span />
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal({ open: true, existing: g });
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Manage
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <GoalForm
        open={modal.open}
        onClose={() => setModal({ open: false })}
        existing={modal.existing ?? null}
      />
    </div>
  );
}
