import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

async function handleBillPayment(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireApiAuth(request);
    const { id } = await params;

    const existing = await prisma.bill.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return jsonError("Bill not found", 404);

    let paid = !existing.paid;
    try {
      const body = await request.json();
      if (typeof body.paid === "boolean") paid = body.paid;
    } catch {
      // Empty body defaults to toggling
    }

    const bill = await prisma.bill.update({
      where: { id },
      data: { paid },
    });

    // Advance recurring bill lifecycle when marked paid
    if (paid) {
      const nextDueDate = new Date(existing.dueDate);
      if (existing.frequency === "weekly") {
        nextDueDate.setDate(nextDueDate.getDate() + 7);
      } else if (existing.frequency === "yearly") {
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
      } else {
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      }

      const existingNext = await prisma.bill.findFirst({
        where: {
          userId: user.id,
          name: existing.name,
          dueDate: nextDueDate,
        },
      });

      if (!existingNext) {
        await prisma.bill.create({
          data: {
            userId: user.id,
            name: existing.name,
            amount: existing.amount,
            frequency: existing.frequency,
            dueDate: nextDueDate,
            paid: false,
          },
        });
      }
    }

    return Response.json({ ok: true, bill });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}

export const PATCH = handleBillPayment;
export const POST = handleBillPayment;
