import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { incomeSourceSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const sources = await prisma.incomeSource.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return Response.json({ incomeSources: sources });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const body = await request.json();
    const parsed = incomeSourceSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.flatten().fieldErrors.name?.[0] ?? "Invalid input");
    }

    const source = await prisma.incomeSource.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        amount: parsed.data.amount,
        frequency: parsed.data.frequency,
      },
    });

    return Response.json({ ok: true, incomeSource: source });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}
