import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your PocketGuard account.",
};

export default function LoginPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-brand text-2xl font-bold text-black">Welcome back</h1>
        <p className="mt-1 text-muted">Sign in to see your plan.</p>
      </div>
      <LoginForm />
    </>
  );
}
