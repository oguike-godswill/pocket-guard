"use client";

import { useEffect, useRef, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { loginAction, type ActionResult } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    loginAction,
    {}
  );
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const wasReset = searchParams.get("reset") === "1";
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
      {wasReset && (
        <div
          className="rounded-lg border border-positive/30 bg-positive-soft p-3 text-sm text-positive"
          role="status"
        >
          Your password has been reset. Sign in with your new password.
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
      <PasswordInput
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
