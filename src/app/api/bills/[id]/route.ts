import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { billSchema } from "@/lib/validations";

export async function PUT(
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

    const body = await request.json();
    const parsed = billSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.flatten().fieldErrors.name?.[0] ?? "Invalid input");
    }

    const bill = await prisma.bill.update({
      where: { id },
      data: {
        name: parsed.data.name,
        amount: parsed.data.amount,
        dueDate: new Date(parsed.data.dueDate),
        frequency: parsed.data.frequency,
      },
    });

    return Response.json({ ok: true, bill });
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

    const existing = await prisma.bill.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return jsonError("Bill not found", 404);

    await prisma.bill.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}
