import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";
import { CURRENCIES } from "@/lib/money";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    return Response.json({
      name: user.name,
      email: user.email,
      currency: user.currency,
      supportedCurrencies: Object.keys(CURRENCIES),
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.flatten().fieldErrors.name?.[0] ?? "Invalid input");
    }

    if (!(parsed.data.currency in CURRENCIES)) {
      return jsonError("Unsupported currency");
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: parsed.data.name, currency: parsed.data.currency },
    });

    return Response.json({
      ok: true,
      user: { name: updated.name, email: updated.email, currency: updated.currency },
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}
