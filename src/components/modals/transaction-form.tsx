"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/lib/actions/money";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/categories";

type TransactionFormProps = {
  open: boolean;
  onClose: () => void;
  type?: "income" | "expense";
  existing?: {
    id: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
    note?: string | null;
  } | null;
};

export function TransactionForm({
  open,
  onClose,
  type = "expense",
  existing,
}: TransactionFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [txType, setTxType] = useState<"income" | "expense">(existing?.type ?? type);
  const [amount, setAmount] = useState(existing ? String(existing.amount) : "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [date, setDate] = useState(
    existing ? existing.date.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [note, setNote] = useState(existing?.note ?? "");
  const [saving, setSaving] = useState(false);

  const isNew = !existing;

  const wasOpen = useRef(open);
  useEffect(() => {
    if (open && !wasOpen.current) {
      setTxType(existing?.type ?? type);
      if (!existing) {
        setAmount("");
        setCategory("");
        setDate(new Date().toISOString().slice(0, 10));
        setNote("");
      }
    }
    wasOpen.current = open;
  }, [open, type, existing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      toast("error", "Please enter a valid amount");
      setSaving(false);
      return;
    }
    if (!category) {
      toast("error", "Please select a category");
      setSaving(false);
      return;
    }

    const payload = { amount: amountNum, type: txType, category, date, note: note || undefined };
    const result = isNew
      ? await createTransaction(payload)
      : await updateTransaction(existing.id, payload);

    setSaving(false);
    if (result.success) {
      toast("success", isNew ? "Transaction added" : "Transaction updated");
      onClose();
      router.refresh();
    } else if (result.error) {
      toast("error", result.error);
    }
  }

  async function handleDelete() {
    if (!existing) return;
    setSaving(true);
    const result = await deleteTransaction(existing.id);
    setSaving(false);
    if (result.success) {
      toast("success", "Transaction deleted");
      onClose();
      router.refresh();
    }
  }

  const categories = txType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES.map((c) => c.name);

  return (
    <Modal open={open} onClose={onClose} title={isNew ? `Add ${txType}` : "Edit transaction"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isNew && (
          <div className="grid grid-cols-2 gap-2">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTxType(t);
                  setCategory("");
                }}
                className={`h-10 rounded-lg border text-sm font-medium transition-colors ${
                  txType === t
                    ? t === "income"
                      ? "border-positive bg-positive-soft text-positive"
                      : "bg-black text-white"
                    : "border-border bg-white text-muted hover:bg-soft"
                }`}
              >
                {t === "income" ? "Income" : "Expense"}
              </button>
            ))}
          </div>
        )}

        <CurrencyInput
          label="Amount"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Input
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Input
          type="text"
          label="Note (optional)"
          placeholder="What was this for?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex items-center justify-between gap-3 pt-2">
          {existing && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
            >
              Delete
            </Button>
          )}
          {!existing && <span />}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {isNew ? "Add" : "Save changes"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
