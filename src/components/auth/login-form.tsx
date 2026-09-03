"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction, type ActionResult } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    loginAction,
    {}
  );
  const searchParams = useSearchParams();
  const wasReset = searchParams.get("reset") === "1";

  return (
    <form action={formAction} className="space-y-4">
      {wasReset && (
        <div
          className="rounded-lg border border-positive/30 bg-positive-soft p-3 text-sm text-positive"
          role="status"
        >
          Your password has been reset. Sign in with your new password.
        </div>
      )}
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
        error={state.fieldErrors?.email?.[0]}
      />
      <Input
        type="password"
        name="password"
        label="Password"
        placeholder="Your password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password?.[0]}
      />
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-muted hover:text-black"
        >
          Forgot password?
        </Link>
      </div>
      <Button type="submit" className="w-full" size="lg" loading={pending}>
        Sign in
      </Button>
      <p className="text-center text-sm text-muted">
        New to PocketGuard?{" "}
        <Link href="/register" className="font-medium text-black hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
