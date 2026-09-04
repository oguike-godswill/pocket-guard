import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireApiAuth(request);
    const { id } = await params;

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return jsonError("Transaction not found", 404);

    const body = await request.json();
    const parsed = transactionSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.flatten().fieldErrors.category?.[0] ?? "Invalid input");
    }

    const { amount, type, category, date, note } = parsed.data;
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount,
        type,
        category,
        date: new Date(date),
        note: note ?? null,
      },
    });

    return Response.json({ ok: true, transaction });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireApiAuth(request);
    const { id } = await params;

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return jsonError("Transaction not found", 404);

    await prisma.transaction.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}
