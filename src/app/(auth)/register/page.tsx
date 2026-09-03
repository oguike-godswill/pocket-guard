import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your PocketGuard account and start planning your money.",
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-brand text-2xl font-bold text-black">
          Create your account
        </h1>
        <p className="mt-1 text-muted">
          It's free. Start planning your money in minutes.
        </p>
      </div>
      <RegisterForm />
    </>
  );
}
