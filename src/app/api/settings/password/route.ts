import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { updatePasswordSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function PUT(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    const body = await request.json();
    const parsed = updatePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.flatten().fieldErrors.newPassword?.[0] ?? "Invalid input");
    }

    const { currentPassword, newPassword } = parsed.data;
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return jsonError("Current password is incorrect", 401);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return Response.json({ ok: true, message: "Password updated" });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}
