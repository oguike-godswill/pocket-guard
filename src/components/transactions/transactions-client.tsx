"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  TrendingUp,
  Receipt,
  Pencil,
  Wallet,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { TransactionForm } from "@/components/modals/transaction-form";
import { useToast } from "@/components/ui/toast";
import { formatMoney } from "@/lib/money";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/categories";
import { deleteTransaction } from "@/lib/actions/money";
import { ConfirmDialog } from "@/components/ui/modal";
import type { TransactionType } from "@prisma/client";

type DisplayTransaction = {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string | null;
  createdAt: Date | string;
  date: string;
};

type IncomeSource = {
  id: string;
  name: string;
  amount: number;
  frequency: string;
};

const ALL_CATS = [
  ...new Set([...EXPENSE_CATEGORIES.map((c) => c.name), ...INCOME_CATEGORIES]),
];

export function TransactionsClient({
  initialTransactions,
  incomeSources: initialIncomeSources,
  currency,
}: {
  initialTransactions: DisplayTransaction[];
  incomeSources: IncomeSource[];
  currency: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [incomeSources, setIncomeSources] = useState(initialIncomeSources);

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modal, setModal] = useState<{
    open: boolean;
    type?: "income" | "expense";
    existing?: DisplayTransaction | null;
  }>({ open: false });
  const [confirmDelete, setConfirmDelete] = useState<DisplayTransaction | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showIncomeSources, setShowIncomeSources] = useState(false);

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        if (typeFilter !== "all" && t.type !== typeFilter) return false;
        if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
        if (query) {
          const q = query.toLowerCase();
          return (
            t.category.toLowerCase().includes(q) ||
            (t.note ?? "").toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, query, typeFilter, categoryFilter]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    const result = await deleteTransaction(confirmDelete.id);
    setDeleting(false);
    if (result.success) {
      setTransactions((prev) =>
        prev.filter((t) => t.id !== confirmDelete.id)
      );
      toast("success", "Transaction deleted");
      setConfirmDelete(null);
      router.refresh();
    } else {
      toast("error", result.error ?? "Could not delete");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-brand text-2xl font-bold text-black">Transactions</h1>
          <p className="mt-1 text-sm text-muted">
            Income and expenses, in one place.
          </p>
        </div>
        <Button onClick={() => setModal({ open: true, type: "expense", existing: null })}>
          <Plus className="h-4 w-4" /> Add transaction
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total income" value={formatMoney(totalIncome, currency)} tone="positive" />
        <StatCard label="Total expenses" value={formatMoney(totalExpense, currency)} tone="danger" />
        <StatCard
          label="Net"
          value={formatMoney(totalIncome - totalExpense, currency)}
          tone={totalIncome - totalExpense >= 0 ? "positive" : "danger"}
        />
      </section>

      {/* Filters */}
      <section className="rounded-xl border border-border bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              className="pl-9"
              placeholder="Search transactions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select
              className="w-40"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by type"
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
            <Select
              className="w-44"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {ALL_CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>

      {/* Income sources */}
      <section>
        <button
          className="flex items-center gap-2 text-sm font-medium text-black hover:underline"
          onClick={() => setShowIncomeSources(!showIncomeSources)}
          aria-expanded={showIncomeSources}
        >
          <Wallet className="h-4 w-4" /> Income sources ({incomeSources.length})
          <span className="text-muted">{showIncomeSources ? "Hide" : "Show"}</span>
        </button>
        {showIncomeSources && (
          <div className="mt-3 rounded-xl border border-border bg-white p-4">
            {incomeSources.length === 0 ? (
              <p className="text-sm text-muted">
                No income sources yet. Add a recurring income source from the plan or onboarding.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {incomeSources.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-2 text-sm">
                    <span className="flex items-center gap-2 text-black">
                      <Lock className="h-3.5 w-3.5 text-muted" />
                      {s.name}
                    </span>
                    <span className="flex items-center gap-3">
                      <Badge tone="neutral">{s.frequency}</Badge>
                      <span className="font-medium text-positive tabular">
                        +{formatMoney(s.amount, currency)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* Transaction list */}
      <Card className="p-0 sm:p-0">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Receipt className="h-5 w-5" />}
            title="No transactions"
            description={
              transactions.length === 0
                ? "Add your first income or expense to start tracking where your money goes."
                : "No transactions match your filters."
            }
            action={
              transactions.length === 0 ? (
                <Button onClick={() => setModal({ open: true, type: "expense", existing: null })}>
                  <Plus className="h-4 w-4" /> Add transaction
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop table */}
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Note</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-soft/50"
                    onClick={() => setModal({ open: true, existing: t })}
                  >
                    <td className="px-5 py-3 text-muted">
                      {new Date(t.date).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 font-medium text-black">{t.category}</td>
                    <td className="px-5 py-3 text-muted">{t.note ?? "—"}</td>
                    <td className="px-5 py-3">
                      <Badge tone={t.type === "income" ? "positive" : "neutral"}>
                        {t.type}
                      </Badge>
                    </td>
                    <td
                      className={`px-5 py-3 text-right font-medium tabular ${
                        t.type === "income" ? "text-positive" : "text-black"
                      }`}
                    >
                      {t.type === "income" ? "+" : "−"}
                      {formatMoney(t.amount, currency)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        className="rounded-md p-1.5 text-muted hover:bg-soft hover:text-black"
                        aria-label={`Edit ${t.category}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setModal({ open: true, existing: t });
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <ul className="divide-y divide-border sm:hidden">
              {filtered.map((t) => (
                <li key={t.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp
                        className={`h-4 w-4 ${
                          t.type === "income" ? "text-positive" : "text-black"
                        }`}
                      />
                      <span className="font-medium text-black">{t.category}</span>
                    </div>
                    <span
                      className={`font-semibold tabular ${
                        t.type === "income" ? "text-positive" : "text-black"
                      }`}
                    >
                      {t.type === "income" ? "+" : "−"}
                      {formatMoney(t.amount, currency)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted">
                    <span>
                      {new Date(t.date).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                      })}
                      {t.note ? ` · ${t.note}` : ""}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <TransactionForm
        open={modal.open}
        onClose={() => setModal({ open: false })}
        type={modal.type ?? "expense"}
        existing={modal.existing ?? null}
      />

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete transaction"
        message="This will permanently delete this transaction. This action cannot be undone."
      />
    </div>
  );
}
