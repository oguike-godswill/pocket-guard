"use client";

import { useEffect, useRef, useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { registerAction, type ActionResult } from "@/lib/actions/auth";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    registerAction,
    {}
  );
  const { toast } = useToast();
  const toastFired = useRef(false);

  useEffect(() => {
    if (state.error && !toastFired.current) {
      toast("error", state.error);
      toastFired.current = true;
    }
    if (!state.error) toastFired.current = false;
  }, [state.error, toast]);

  return (
    <form action={formAction} className="space-y-4">
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
      <PasswordInput
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
