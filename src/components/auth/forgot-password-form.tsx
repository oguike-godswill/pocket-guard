"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPasswordSchema } from "@/lib/validations";
import type { ActionResult } from "@/lib/actions/auth";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<ActionResult>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setState({ fieldErrors: parsed.error.flatten().fieldErrors });
      return;
    }
    setPending(true);
    setState({});
    await new Promise((r) => setTimeout(r, 600));
    setPending(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="space-y-4">
        <div
          className="rounded-lg border border-positive/30 bg-positive-soft p-4 text-sm text-positive"
          role="status"
        >
          {state.success ??
            `If an account exists for ${email}, a reset link has been generated.`}
        </div>
        <p className="text-sm text-muted">
          In this demo, use the link below to reset your password (a real app
          emails this securely):
        </p>
        <Link
          href={`/reset-password?email=${encodeURIComponent(email)}`}
          className="block w-full rounded-lg border border-border bg-white p-3 text-center text-sm font-medium text-black hover:bg-soft"
        >
          Reset password
        </Link>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            setSubmitted(false);
            setEmail("");
          }}
        >
          Try another email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {state.error && (
        <div
          className="rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger"
          role="alert"
        >
          {state.error}
        </div>
      )}
      <Input
        type="email"
        name="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={state.fieldErrors?.email?.[0]}
      />
      <Button type="submit" className="w-full" size="lg" loading={pending}>
        Send reset link
      </Button>
      <p className="text-center text-sm text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-black hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
