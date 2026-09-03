"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { createBill, updateBill, deleteBill } from "@/lib/actions/money";
import { FREQUENCIES } from "@/lib/categories";

type BillFormProps = {
  open: boolean;
  onClose: () => void;
  existing?: {
    id: string;
    name: string;
    amount: number;
    dueDate: Date | string;
    frequency: "weekly" | "monthly" | "yearly";
  } | null;
};

export function BillForm({ open, onClose, existing }: BillFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [name, setName] = useState(existing?.name ?? "");
  const [amount, setAmount] = useState(existing ? String(existing.amount) : "");
  const [dueDate, setDueDate] = useState(
    existing
      ? new Date(existing.dueDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [frequency, setFrequency] = useState<string>(existing?.frequency ?? "monthly");
  const [saving, setSaving] = useState(false);

  const isNew = !existing;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const amt = Number(amount);
    if (!name.trim() || !amt || amt <= 0) {
      toast("error", "Please fill in the bill details");
      setSaving(false);
      return;
    }
    const payload = {
      name: name.trim(),
      amount: amt,
      dueDate,
      frequency: frequency as "weekly" | "monthly" | "yearly",
    };

    const result = isNew
      ? await createBill(payload)
      : await updateBill(existing.id, payload);

    setSaving(false);
    if (result.success) {
      toast("success", isNew ? "Bill added" : "Bill updated");
      onClose();
      router.refresh();
    } else if (result.error) {
      toast("error", result.error);
    }
  }

  async function handleDelete() {
    if (!existing) return;
    setSaving(true);
    const result = await deleteBill(existing.id);
    setSaving(false);
    if (result.success) {
      toast("success", "Bill deleted");
      onClose();
      router.refresh();
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isNew ? "Add a bill" : "Edit bill"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Bill name"
          placeholder="e.g. Rent, Electricity"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <CurrencyInput
          label="Amount"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <Input
          type="date"
          label="Due date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <Select
          label="Frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          {FREQUENCIES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </Select>

        <div className="flex items-center justify-between gap-3 pt-2">
          {existing && (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={saving}>
              Delete
            </Button>
          )}
          {!existing && <span />}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {isNew ? "Add bill" : "Save changes"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
