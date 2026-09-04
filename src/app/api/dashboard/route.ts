import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { getDashboardData, calculateAvailableToSpend, calculateCurrentMoney, calculateTotalPlannedExpenses, calculateTotalSavingsCommitments, calculateTotalUpcomingBills } from "@/lib/calculations";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const url = new URL(request.url);
    const period = url.searchParams.get("period") ?? undefined;

    const data = await getDashboardData(user.id, period as any);
    const available = calculateAvailableToSpend(data);
    const currentMoney = calculateCurrentMoney(data);
    const plannedExpenses = calculateTotalPlannedExpenses(data);
    const savingsCommitments = calculateTotalSavingsCommitments(data);
    const upcomingBills = calculateTotalUpcomingBills(data);

    return Response.json({
      availableToSpend: available,
      currentMoney,
      plannedExpenses,
      savingsCommitments,
      upcomingBills,
      incomeSources: data.incomes,
      transactions: {
        expenses: data.expenseTxns,
        income: data.incomeTxns,
      },
      plan: data.plan,
      bills: data.bills,
      savingsGoals: data.goals,
      recentTransactions: data.recentTransactions,
      currency: user.currency,
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}
