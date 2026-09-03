import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your PocketGuard password.",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-brand text-2xl font-bold text-black">
          Forgot your password?
        </h1>
        <p className="mt-1 text-muted">
          Enter your email and we'll help you reset it.
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
