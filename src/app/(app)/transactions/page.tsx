import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TransactionsClient } from "@/components/transactions/transactions-client";

export const metadata = {
  title: "Transactions",
  robots: { index: false, follow: false },
};

export default async function TransactionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [transactions, incomeSources] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 500,
    }),
    prisma.incomeSource.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <TransactionsClient
      initialTransactions={transactions.map((t) => ({
        ...t,
        amount: Number(t.amount),
        date: t.date.toISOString(),
      }))}
      incomeSources={incomeSources.map((s) => ({
        ...s,
        amount: Number(s.amount),
      }))}
      currency={user.currency ?? "NGN"}
    />
  );
}
