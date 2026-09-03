"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowRightCircle,
  Pencil,
  CheckCircle2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { BillForm } from "@/components/modals/bill-form";
import { ConfirmDialog } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { markBillPaid, deleteBill } from "@/lib/actions/money";
import { formatMoney } from "@/lib/money";
import type { RecurringFrequency } from "@prisma/client";

type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  frequency: RecurringFrequency;
  paid: boolean;
};

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function BillsClient({
  bills: initialBills,
  currency,
}: {
  bills: Bill[];
  currency: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [bills, setBills] = useState(initialBills);
  const [modal, setModal] = useState<{ open: boolean; existing?: Bill | null }>({
    open: false,
  });
  const [confirmDelete, setConfirmDelete] = useState<Bill | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const unpaid = bills.filter((b) => !b.paid);
  const totalUpcoming = unpaid.reduce((s, b) => s + b.amount, 0);
  const overdue = unpaid.filter((b) => daysUntil(b.dueDate) < 0);

  async function handleTogglePaid(bill: Bill) {
    setBusyId(bill.id);
    const result = await markBillPaid(bill.id, !bill.paid);
    setBusyId(null);
    if (result.success) {
      setBills((prev) =>
        prev.map((b) => (b.id === bill.id ? { ...b, paid: !b.paid } : b))
      );
      toast("success", bill.paid ? "Bill marked as unpaid" : "Bill marked as paid");
      router.refresh();
    } else {
      toast("error", result.error ?? "Could not update bill");
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    const result = await deleteBill(confirmDelete.id);
    if (result.success) {
      setBills((prev) => prev.filter((b) => b.id !== confirmDelete.id));
      toast("success", "Bill deleted");
      setConfirmDelete(null);
      router.refresh();
    } else {
      toast("error", result.error ?? "Could not delete bill");
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-brand text-2xl font-bold text-black">Bills</h1>
          <p className="mt-1 text-sm text-muted">
            Upcoming and recurring bills, so nothing surprises you.
          </p>
        </div>
        <Button onClick={() => setModal({ open: true, existing: null })}>
          <Plus className="h-4 w-4" /> Add bill
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Upcoming (unpaid)"
          value={formatMoney(totalUpcoming, currency)}
          hint={`${unpaid.length} unpaid bill${unpaid.length === 1 ? "" : "s"}`}
          tone="warning"
        />
        <StatCard
          label="Paid this period"
          value={formatMoney(
            bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0),
            currency
          )}
          tone="positive"
        />
        <StatCard
          label="Overdue"
          value={formatMoney(overdue.reduce((s, b) => s + b.amount, 0), currency)}
          tone={overdue.length ? "danger" : "default"}
          hint={overdue.length ? `${overdue.length} overdue` : "None overdue"}
        />
      </section>

      {bills.length === 0 ? (
        <EmptyState
          icon={<ArrowRightCircle className="h-5 w-5" />}
          title="No bills yet"
          description="Add upcoming bills like rent, electricity or subscriptions to keep them on your radar."
          action={
            <Button onClick={() => setModal({ open: true, existing: null })}>
              <Plus className="h-4 w-4" /> Add bill
            </Button>
          }
        />
      ) : (
        <Card className="p-0 sm:p-0">
          <ul className="divide-y divide-border">
            {bills.map((bill) => {
              const days = daysUntil(bill.dueDate);
              const isOverdue = !bill.paid && days < 0;
              const dueSoon = !bill.paid && days >= 0 && days <= 7;
              return (
                <li key={bill.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-black">
                        {bill.name}
                      </span>
                      {isOverdue && (
                        <Badge tone="danger">Overdue</Badge>
                      )}
                      {dueSoon && <Badge tone="warning">Due soon</Badge>}
                    </div>
                    <p className="mt-0.5 text-xs text-muted">
                      {new Date(bill.dueDate).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {!bill.paid && (
                        <span className="ml-2">
                          {isOverdue
                            ? `${Math.abs(days)}d overdue`
                            : days === 0
                              ? "Due today"
                              : `in ${days}d`}
                        </span>
                      )}
                      <span className="ml-2 capitalize">· {bill.frequency}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-semibold tabular ${
                        bill.paid
                          ? "text-muted line-through"
                          : isOverdue
                            ? "text-danger"
                            : "text-black"
                      }`}
                    >
                      {formatMoney(bill.amount, currency)}
                    </span>
                    <Button
                      variant={bill.paid ? "secondary" : "primary"}
                      size="sm"
                      disabled={busyId === bill.id}
                      onClick={() => handleTogglePaid(bill)}
                    >
                      {bill.paid ? "Unmark" : "Mark paid"}
                    </Button>
                    <div className="flex items-center gap-1">
                      <button
                        className="rounded-md p-1.5 text-muted hover:bg-soft hover:text-black"
                        aria-label={`Edit ${bill.name}`}
                        onClick={() => setModal({ open: true, existing: bill })}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-md p-1.5 text-muted hover:bg-soft hover:text-danger"
                        aria-label={`Delete ${bill.name}`}
                        onClick={() => setConfirmDelete(bill)}
                      >
                        <Check className="h-4 w-4 rotate-45" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <BillForm
        open={modal.open}
        onClose={() => setModal({ open: false })}
        existing={modal.existing ?? null}
      />

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete bill"
        message="This will permanently remove this bill. This action cannot be undone."
      />
    </div>
  );
}
