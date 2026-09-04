import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { billSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const url = new URL(request.url);
    const paid = url.searchParams.get("paid");

    const where: any = { userId: user.id };
    if (paid === "true") where.paid = true;
    if (paid === "false") where.paid = false;

    const bills = await prisma.bill.findMany({
      where,
      orderBy: { dueDate: "asc" },
    });
    return Response.json({ bills });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const body = await request.json();
    const parsed = billSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.flatten().fieldErrors.name?.[0] ?? "Invalid input");
    }

    const bill = await prisma.bill.create({
      data: {
        userId: user.id,
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
