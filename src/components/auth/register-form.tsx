"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerAction, type ActionResult } from "@/lib/actions/auth";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    registerAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div
          className="rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger"
          role="alert"
        >
          {state.error}
        </div>
      )}
      <Input
        type="text"
        name="name"
        label="Full name"
        placeholder="Ada Obi"
        autoComplete="name"
        required
        error={state.fieldErrors?.name?.[0]}
      />
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
        placeholder="At least 8 characters"
        autoComplete="new-password"
        required
        hint="Use at least 8 characters."
        error={state.fieldErrors?.password?.[0]}
      />
      <Button type="submit" className="w-full" size="lg" loading={pending}>
        Create account
      </Button>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-black hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
