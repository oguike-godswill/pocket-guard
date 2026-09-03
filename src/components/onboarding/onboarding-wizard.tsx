"use client";

import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Select } from "@/components/ui/select";
import { completeOnboarding, type OnboardingData } from "@/lib/actions/onboarding";
import { EXPENSE_CATEGORIES, FREQUENCIES } from "@/lib/categories";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Wallet,
  CalendarRange,
  PiggyBank,
  CalendarClock,
  Check,
  Sparkles,
} from "lucide-react";

type RecurringExpense = {
  name: string;
  amount: string;
  category: string;
  frequency: string;
};

type OnboardingGoal = {
  name: string;
  targetAmount: string;
  targetDate?: string;
};

type OnboardingBill = {
  name: string;
  amount: string;
  dueDate: string;
  frequency: string;
};

type BudgetAllocation = { category: string; amount: string };

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Welcome
  // Step 2: Income
  const [incomeName, setIncomeName] = useState("Salary");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeFrequency, setIncomeFrequency] = useState("monthly");

  // Step 3: Recurring expenses
  const [expenses, setExpenses] = useState<RecurringExpense[]>([]);
  const [expName, setExpName] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expCategory, setExpCategory] = useState("Bills");
  const [expFrequency, setExpFrequency] = useState("monthly");

  // Step 4: Goals
  const [goals, setGoals] = useState<OnboardingGoal[]>([]);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalDate, setGoalDate] = useState("");

  // Step 5: Bills
  const [bills, setBills] = useState<OnboardingBill[]>([]);
  const [billName, setBillName] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billDue, setBillDue] = useState("");
  const [billFrequency, setBillFrequency] = useState("monthly");

  // Step 6: Plan review / budget allocation
  const [allocations, setAllocations] = useState<BudgetAllocation[]>([
    { category: "Housing", amount: "150000" },
    { category: "Food", amount: "50000" },
    { category: "Transport", amount: "30000" },
    { category: "Bills", amount: "15000" },
  ]);

  const canContinue = (): boolean => {
    switch (step) {
      case 1:
        return incomeAmount !== "" && Number(incomeAmount) > 0;
      default:
        return true;
    }
  };

  async function finish() {
    setSubmitting(true);
    const data: OnboardingData = {
      incomeName,
      incomeAmount: incomeAmount ? Number(incomeAmount) : undefined,
      incomeFrequency: incomeFrequency as OnboardingData["incomeFrequency"],
      recurringExpenses: expenses
        .filter((e) => e.name && e.amount)
        .map((e) => ({
          name: e.name,
          amount: Number(e.amount),
          category: e.category,
          frequency: e.frequency as "monthly",
        })),
      goals: goals
        .filter((g) => g.name && g.targetAmount)
        .map((g) => ({
          name: g.name,
          targetAmount: Number(g.targetAmount),
          targetDate: g.targetDate || undefined,
        })),
      bills: bills
        .filter((b) => b.name && b.amount && b.dueDate)
        .map((b) => ({
          name: b.name,
          amount: Number(b.amount),
          dueDate: b.dueDate,
          frequency: b.frequency as "monthly",
        })),
      planCategories: allocations.map((a) => ({
        category: a.category,
        plannedAmount: a.amount ? Number(a.amount) : 0,
      })),
    };
    await completeOnboarding(data);
  }

  const stepsMeta = [
    { label: "Welcome", icon: Sparkles },
    { label: "Income", icon: Wallet },
    { label: "Expenses", icon: CalendarRange },
    { label: "Goals", icon: PiggyBank },
    { label: "Bills", icon: CalendarClock },
    { label: "Plan", icon: Check },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-soft">
      <header className="flex h-16 items-center border-b border-border bg-white px-6">
        <Logo />
      </header>

      {/* Progress */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-3">
          {stepsMeta.slice(0, step >= 6 ? 6 : step).map((s, i) => (
            <div key={s.label} className="flex flex-1 items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                  i < step
                    ? "bg-black text-white"
                    : i === step
                      ? "border-2 border-black text-black"
                      : "border border-border text-muted"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < stepsMeta.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    i < step ? "bg-black" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-2xl border border-border bg-white p-6 sm:p-8">
          {step === 0 && (
            <WelcomeStep
              onNext={() => setStep(1)}
              userName=""
            />
          )}

          {step === 1 && (
            <Step
              title="Add your first income"
              subtitle="We'll use this to build your plan. You can change it any time."
              onBack={step > 0 ? () => setStep(0) : undefined}
              onNext={() => setStep(2)}
              nextDisabled={!canContinue()}
            >
              <div className="space-y-4">
                <Input
                  label="Income name"
                  value={incomeName}
                  onChange={(e) => setIncomeName(e.target.value)}
                  placeholder="e.g. Monthly salary"
                />
                <CurrencyInput
                  label="Amount"
                  placeholder="0"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                />
                <Select
                  label="How often do you receive this?"
                  value={incomeFrequency}
                  onChange={(e) => setIncomeFrequency(e.target.value)}
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </Select>
              </div>
            </Step>
          )}

          {step === 2 && (
            <Step
              title="Add recurring expenses"
              subtitle="These repeat regularly. Optional and skippable."
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
              onSkip={() => setStep(3)}
            >
              <div className="space-y-4">
                <div className="space-y-4 rounded-xl border border-border bg-soft p-4">
                  <Input
                    label="Expense name"
                    value={expName}
                    onChange={(e) => setExpName(e.target.value)}
                    placeholder="e.g. Rent"
                  />
                  <CurrencyInput
                    label="Amount"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    placeholder="0"
                  />
                  <Select
                    label="Category"
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value)}
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                  <div className="flex items-end gap-2">
                    <Select
                      label="Frequency"
                      value={expFrequency}
                      onChange={(e) => setExpFrequency(e.target.value)}
                      className="flex-1"
                    >
                      {FREQUENCIES.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </Select>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        if (!expName || !expAmount) return;
                        setExpenses((prev) => [
                          ...prev,
                          {
                            name: expName,
                            amount: expAmount,
                            category: expCategory,
                            frequency: expFrequency,
                          },
                        ]);
                        setExpName("");
                        setExpAmount("");
                      }}
                    >
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>
                </div>
                {expenses.length > 0 && (
                  <ul className="space-y-2">
                    {expenses.map((e, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-sm"
                      >
                        <span>
                          <span className="font-medium text-black">
                            {e.name}
                          </span>
                          <span className="text-muted"> · {e.category}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="tabular">₦{Number(e.amount).toLocaleString()}</span>
                          <button
                            onClick={() =>
                              setExpenses((prev) => prev.filter((_, j) => j !== i))
                            }
                            className="text-muted hover:text-danger"
                            aria-label={`Remove ${e.name}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Step>
          )}

          {step === 3 && (
            <Step
              title="Add savings goals"
              subtitle="Optional. Save for something that matters to you."
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
              onSkip={() => setStep(4)}
            >
              <div className="space-y-4">
                <div className="space-y-4 rounded-xl border border-border bg-soft p-4">
                  <Input
                    label="Goal name"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="e.g. Emergency fund"
                  />
                  <CurrencyInput
                    label="Target amount"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    placeholder="0"
                  />
                  <Input
                    type="date"
                    label="Target date (optional)"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (!goalName || !goalAmount) return;
                      setGoals((prev) => [
                        ...prev,
                        {
                          name: goalName,
                          targetAmount: goalAmount,
                          targetDate: goalDate,
                        },
                      ]);
                      setGoalName("");
                      setGoalAmount("");
                      setGoalDate("");
                    }}
                  >
                    <Plus className="h-4 w-4" /> Add goal
                  </Button>
                </div>
                {goals.length > 0 && (
                  <ul className="space-y-2">
                    {goals.map((g, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-sm"
                      >
                        <span className="font-medium text-black">{g.name}</span>
                        <span className="flex items-center gap-2">
                          <span className="tabular">
                            ₦{Number(g.targetAmount).toLocaleString()}
                          </span>
                          <button
                            onClick={() =>
                              setGoals((prev) => prev.filter((_, j) => j !== i))
                            }
                            className="text-muted hover:text-danger"
                            aria-label={`Remove ${g.name}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Step>
          )}

          {step === 4 && (
            <Step
              title="Add upcoming bills"
              subtitle="Optional. Bills you know are coming."
              onBack={() => setStep(3)}
              onNext={() => setStep(5)}
              onSkip={() => setStep(5)}
            >
              <div className="space-y-4">
                <div className="space-y-4 rounded-xl border border-border bg-soft p-4">
                  <Input
                    label="Bill name"
                    value={billName}
                    onChange={(e) => setBillName(e.target.value)}
                    placeholder="e.g. Electricity"
                  />
                  <CurrencyInput
                    label="Amount"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    placeholder="0"
                  />
                  <Input
                    type="date"
                    label="Due date"
                    value={billDue}
                    onChange={(e) => setBillDue(e.target.value)}
                  />
                  <Select
                    label="Frequency"
                    value={billFrequency}
                    onChange={(e) => setBillFrequency(e.target.value)}
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </Select>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (!billName || !billAmount || !billDue) return;
                      setBills((prev) => [
                        ...prev,
                        {
                          name: billName,
                          amount: billAmount,
                          dueDate: billDue,
                          frequency: billFrequency,
                        },
                      ]);
                      setBillName("");
                      setBillAmount("");
                      setBillDue("");
                    }}
                  >
                    <Plus className="h-4 w-4" /> Add bill
                  </Button>
                </div>
                {bills.length > 0 && (
                  <ul className="space-y-2">
                    {bills.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-sm"
                      >
                        <span className="font-medium text-black">{b.name}</span>
                        <span className="flex items-center gap-2">
                          <span className="tabular">₦{Number(b.amount).toLocaleString()}</span>
                          <button
                            onClick={() =>
                              setBills((prev) => prev.filter((_, j) => j !== i))
                            }
                            className="text-muted hover:text-danger"
                            aria-label={`Remove ${b.name}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Step>
          )}

          {step === 5 && (
            <PlanReviewStep
              incomeAmount={incomeAmount}
              expenses={expenses}
              goals={goals}
              bills={bills}
              allocations={allocations}
              setAllocations={setAllocations}
              onBack={() => setStep(4)}
              onFinish={finish}
              submitting={submitting}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function WelcomeStep({ onNext, userName }: { onNext: () => void; userName: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
        <Sparkles className="h-6 w-6" />
      </div>
      <h1 className="font-brand text-2xl font-bold text-black">
        Welcome to PocketGuard
      </h1>
      <p className="mt-3 text-muted">
        We'll help you answer one question:{" "}
        <span className="font-medium text-black">
          how much can you safely spend right now?
        </span>{" "}
        We call this <span className="font-medium text-black">Available to Spend</span>.
      </p>
      <p className="mt-3 text-sm text-muted">
        In the next few steps you'll add your income, expenses, savings and
        bills. We'll create a first plan you can adjust any time.
      </p>
      <Button className="mt-8 w-full" size="lg" onClick={onNext}>
        Get started <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function Step({
  title,
  subtitle,
  onBack,
  onNext,
  onSkip,
  children,
  nextDisabled,
  nextLabel = "Continue",
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  children: React.ReactNode;
  nextDisabled?: boolean;
  nextLabel?: string;
}) {
  return (
    <div>
      <h1 className="font-brand text-2xl font-bold text-black">{title}</h1>
      {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
      <div className="mt-6">{children}</div>
      <div className="mt-8 flex items-center justify-between gap-3">
        {onBack ? (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          {onSkip && (
            <Button variant="ghost" onClick={onSkip}>
              Skip
            </Button>
          )}
          {onNext && (
            <Button onClick={onNext} disabled={nextDisabled}>
              {nextLabel} <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function PlanReviewStep({
  incomeAmount,
  expenses,
  goals,
  bills,
  allocations,
  setAllocations,
  onBack,
  onFinish,
  submitting,
}: {
  incomeAmount: string;
  expenses: RecurringExpense[];
  goals: OnboardingGoal[];
  bills: OnboardingBill[];
  allocations: BudgetAllocation[];
  setAllocations: React.Dispatch<React.SetStateAction<BudgetAllocation[]>>;
  onBack: () => void;
  onFinish: () => void;
  submitting: boolean;
}) {
  const income = Number(incomeAmount) || 0;
  const expenseTotal = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const billsTotal = bills.reduce((s, b) => s + (Number(b.amount) || 0), 0);
  const goalsTotal = goals.reduce((s, g) => s + (Number(g.targetAmount) || 0), 0);
  const planned = allocations.reduce((s, a) => s + (Number(a.amount) || 0), 0);
  const available = income - expenseTotal - billsTotal - planned;

  function updateAllocation(index: number, amount: string) {
    setAllocations((prev) =>
      prev.map((a, i) => (i === index ? { ...a, amount } : a))
    );
  }

  return (
    <div>
      <h1 className="font-brand text-2xl font-bold text-black">
        Review your plan
      </h1>
      <p className="mt-2 text-muted">
        Set how much you plan to spend in each category this month.
      </p>

      <div className="mt-6 space-y-3">
        {allocations.map((alloc, i) => (
          <div
            key={alloc.category}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-soft p-3"
          >
            <span className="text-sm font-medium text-black">
              {alloc.category}
            </span>
            <CurrencyInput
              className="w-32"
              value={alloc.amount}
              onChange={(e) => updateAllocation(i, e.target.value)}
              aria-label={`Planned amount for ${alloc.category}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-white p-4">
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Income</span>
            <span className="font-medium text-positive tabular">
              ₦{income.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Planned expenses</span>
            <span className="tabular">₦{planned.toLocaleString()}</span>
          </div>
          {expenseTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-muted">Recurring expenses</span>
              <span className="tabular">₦{expenseTotal.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted">Available to Spend</span>
            <span className="font-semibold text-black tabular">
              ₦{available.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 text-xs text-muted">
        {goals.length > 0 &&
          `${goals.length} savings goal${goals.length > 1 ? "s" : ""}, `}
        {bills.length > 0 && `${bills.length} upcoming bill${bills.length > 1 ? "s" : ""}`}
        {goals.length === 0 && bills.length === 0 && "No goals or bills added yet — you can add them anytime from the app."}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={onFinish} loading={submitting} size="lg">
          Finish & go to dashboard <Check className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
