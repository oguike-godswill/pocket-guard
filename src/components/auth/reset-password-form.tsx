"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { resetPasswordAction } from "@/lib/actions/auth";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const router = useRouter();
  const { toast } = useToast();
  const [fieldError, setFieldError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldError(undefined);
    const form = new FormData(e.currentTarget);
    form.set("email", email);
    const password = String(form.get("password") ?? "");
    if (password.length < 8) {
      setFieldError("Password must be at least 8 characters");
      toast("error", "Password must be at least 8 characters");
      return;
    }
    setPending(true);
    const result = await resetPasswordAction(form);
    setPending(false);
    if (result?.error) {
      toast("error", result.error);
      return;
    }
    router.push("/login?reset=1");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PasswordInput
        name="password"
        label="New password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        required
        hint="Use at least 8 characters."
        error={fieldError}
      />
      <Button type="submit" className="w-full" size="lg" loading={pending}>
        Reset password
      </Button>
    </form>
  );
}
