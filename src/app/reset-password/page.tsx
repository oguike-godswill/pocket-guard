import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your PocketGuard account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-soft">
      <header className="flex h-16 items-center border-b border-border bg-white px-6">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-brand text-2xl font-bold text-black">
              Set a new password
            </h1>
            <p className="mt-1 text-muted">
              Choose a strong password for your account.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <Suspense>
              <ResetPasswordForm />
            </Suspense>
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/login" className="inline-flex items-center gap-1.5 hover:text-black">
              <ArrowLeft className="h-4 w-4" /> Back to sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
