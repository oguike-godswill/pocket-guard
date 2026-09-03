"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addContribution,
} from "@/lib/actions/money";

type GoalFormProps = {
  open: boolean;
  onClose: () => void;
  existing?: {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate?: string | Date | null;
  } | null;
};

export function GoalForm({ open, onClose, existing }: GoalFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [name, setName] = useState(existing?.name ?? "");
  const [targetAmount, setTargetAmount] = useState(
    existing ? String(existing.targetAmount) : ""
  );
  const [currentAmount, setCurrentAmount] = useState(
    existing ? String(existing.currentAmount) : "0"
  );
  const [targetDate, setTargetDate] = useState(
    existing?.targetDate
      ? new Date(existing.targetDate).toISOString().slice(0, 10)
      : ""
  );
  const [saving, setSaving] = useState(false);
  const [contribution, setContribution] = useState("");

  const isNew = !existing;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (!name.trim()) {
      toast("error", "Please enter a goal name");
      setSaving(false);
      return;
    }
    const target = Number(targetAmount);
    if (!target || target <= 0) {
      toast("error", "Please enter a valid target amount");
      setSaving(false);
      return;
    }
    const payload = {
      name: name.trim(),
      targetAmount: target,
      currentAmount: Number(currentAmount) || 0,
      targetDate: targetDate || undefined,
    };

    const result = isNew
      ? await createSavingsGoal(payload)
      : await updateSavingsGoal(existing.id, payload);

    setSaving(false);
    if (result.success) {
      toast("success", isNew ? "Goal created" : "Goal updated");
      onClose();
      router.refresh();
    } else if (result.error) {
      toast("error", result.error);
    }
  }

  async function handleContribute() {
    if (!existing) return;
    const amt = Number(contribution);
    if (!amt || amt <= 0) {
      toast("error", "Enter a valid contribution");
      return;
    }
    setSaving(true);
    const result = await addContribution(existing.id, amt);
    setSaving(false);
    if (result.success) {
      toast("success", "Contribution added");
      setContribution("");
      router.refresh();
    } else if (result.error) {
      toast("error", result.error);
    }
  }

  async function handleDelete() {
    if (!existing) return;
    setSaving(true);
    const result = await deleteSavingsGoal(existing.id);
    setSaving(false);
    if (result.success) {
      toast("success", "Goal deleted");
      onClose();
      router.refresh();
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isNew ? "New savings goal" : "Edit goal"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Goal name"
          placeholder="e.g. Emergency fund"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <CurrencyInput
          label="Target amount"
          placeholder="0"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
        />
        {!isNew && (
          <CurrencyInput
            label="Current amount"
            placeholder="0"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
          />
        )}
        <Input
          type="date"
          label="Target date (optional)"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />

        {!isNew && (
          <div className="rounded-xl border border-border bg-soft p-3">
            <p className="mb-2 text-sm font-medium text-black">Add a contribution</p>
            <div className="flex gap-2">
              <CurrencyInput
                placeholder="Amount"
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleContribute();
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleContribute}
                disabled={saving}
              >
                Contribute
              </Button>
            </div>
          </div>
        )}

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
              {isNew ? "Create goal" : "Save changes"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
