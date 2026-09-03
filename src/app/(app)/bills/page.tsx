import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BillsClient } from "@/components/bills/bills-client";

export const metadata = {
  title: "Bills",
  robots: { index: false, follow: false },
};

export default async function BillsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const bills = await prisma.bill.findMany({
    where: { userId: user.id },
    orderBy: { dueDate: "asc" },
  });

  return (
    <BillsClient
      bills={bills.map((b) => ({
        id: b.id,
        name: b.name,
        amount: Number(b.amount),
        dueDate: b.dueDate.toISOString(),
        frequency: b.frequency,
        paid: b.paid,
      }))}
      currency={user.currency ?? "NGN"}
    />
  );
}
