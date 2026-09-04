import { NextRequest } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Demo mode — always return success to prevent email enumeration
    return Response.json({ ok: true, message: "If an account exists, a reset link has been sent." });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
