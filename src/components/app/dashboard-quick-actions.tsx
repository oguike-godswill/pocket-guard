"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionForm } from "@/components/modals/transaction-form";
import { GoalForm } from "@/components/modals/goal-form";
import { BillForm } from "@/components/modals/bill-form";

type ModalKind = "income" | "expense" | "goal" | "bill" | null;

export function DashboardQuickActions() {
  const [openModal, setOpenModal] = useState<ModalKind>(null);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => setOpenModal("income")}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" /> Income
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setOpenModal("expense")}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" /> Expense
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setOpenModal("bill")}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" /> Bill
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setOpenModal("goal")}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" /> Goal
        </Button>
      </div>

      <TransactionForm
        open={openModal === "income" || openModal === "expense"}
        onClose={() => setOpenModal(null)}
        type={openModal === "income" ? "income" : "expense"}
        existing={null}
      />
      <GoalForm open={openModal === "goal"} onClose={() => setOpenModal(null)} existing={null} />
      <BillForm open={openModal === "bill"} onClose={() => setOpenModal(null)} existing={null} />
    </>
  );
}
