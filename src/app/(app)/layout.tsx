import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app/app-sidebar";
import { verifySession } from "@/lib/auth";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col bg-soft lg:flex-row">
      <AppSidebar />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
