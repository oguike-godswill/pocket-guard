import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoalsClient } from "@/components/goals/goals-client";

export const metadata = {
  title: "Savings goals",
  robots: { index: false, follow: false },
};

export default async function GoalsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const goals = await prisma.savingsGoal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <GoalsClient
      goals={goals.map((g) => ({
        id: g.id,
        name: g.name,
        targetAmount: Number(g.targetAmount),
        currentAmount: Number(g.currentAmount),
        targetDate: g.targetDate ? g.targetDate.toISOString() : null,
      }))}
      currency={user.currency ?? "NGN"}
    />
  );
}
