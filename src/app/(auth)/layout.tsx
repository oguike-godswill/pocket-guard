import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-soft">
      <header className="flex h-16 items-center border-b border-border bg-white px-6">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:text-black">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
