import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const url = new URL(request.url);
    const type = url.searchParams.get("type") as "income" | "expense" | null;
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const limit = parseInt(url.searchParams.get("limit") ?? "50");
    const skip = (page - 1) * limit;

    const where: any = { userId: user.id };
    if (type) where.type = type;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return Response.json({
      transactions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const body = await request.json();
    const parsed = transactionSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.flatten().fieldErrors.category?.[0] ?? "Invalid input");
    }

    const { amount, type, category, date, note } = parsed.data;

    // Auto-Match Bill Reconciliation logic
    let matchedBillName: string | null = null;
    if (type === "expense") {
      const candidateBills = await prisma.bill.findMany({
        where: { userId: user.id, paid: false },
      });

      const matchedBill = candidateBills.find((bill) => {
        const isExactAmount = Math.abs(Number(bill.amount) - amount) < 0.01;
        const isNameMatched =
          note?.toLowerCase().includes(bill.name.toLowerCase()) ||
          bill.name.toLowerCase().includes(category.toLowerCase()) ||
          category.toLowerCase().includes(bill.name.toLowerCase());
        return isExactAmount && isNameMatched;
      });

      if (matchedBill) {
        await prisma.bill.update({
          where: { id: matchedBill.id },
          data: { paid: true },
        });
        matchedBillName = matchedBill.name;
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        type,
        category,
        date: new Date(date),
        note: note ?? null,
      },
    });

    return Response.json({ ok: true, transaction, matchedBillName });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}
