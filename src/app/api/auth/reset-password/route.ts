import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    // In demo mode, token is treated as an email for simplicity
    const user = await prisma.user.findFirst({ where: { email: token } });
    if (!user) {
      return Response.json({ error: "Invalid reset token" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return Response.json({ ok: true, message: "Password reset successfully" });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
