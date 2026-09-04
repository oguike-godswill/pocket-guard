import { NextRequest } from "next/server";

export async function POST(_request: NextRequest) {
  // Stateless JWT — client just discards the token.
  // If using cookies, clear them here.
  return Response.json({ ok: true });
}
