import { NextRequest } from "next/server";
import { requireApiAuth, jsonError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireApiAuth(request);
    return Response.json({
      id: user.id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      onboardingCompleted: user.onboardingCompleted,
      createdAt: user.createdAt,
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401);
    return jsonError("Internal server error", 500);
  }
}
