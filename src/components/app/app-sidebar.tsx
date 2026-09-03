"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  CalendarRange,
  PiggyBank,
  ArrowRightCircle,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/logo";
import { ConfirmDialog } from "@/components/ui/modal";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: Receipt },
  { href: "/plan", label: "Plan", icon: CalendarRange },
  { href: "/goals", label: "Goals", icon: PiggyBank },
  { href: "/bills", label: "Bills", icon: ArrowRightCircle },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const res = await fetch("/api/auth/logout", { method: "POST" });
    setLoggingOut(false);
    setLogoutOpen(false);
    router.push("/login");
    router.refresh();
  }

  const content = (
    <nav
      className="flex h-full flex-col gap-1"
      aria-label="App navigation"
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-black text-white"
                : "text-muted hover:bg-soft hover:text-black"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/settings"
        onClick={() => setMobileOpen(false)}
        className={cn(
          "mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          pathname === "/settings"
            ? "bg-black text-white"
            : "text-muted hover:bg-soft hover:text-black"
        )}
      >
        <Settings className="h-5 w-5" />
        Settings
      </Link>
      <button
        type="button"
        onClick={() => setLogoutOpen(true)}
        className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-danger hover:bg-danger-soft"
      >
        <LogOut className="h-5 w-5" />
        Log out
      </button>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 self-start overflow-y-auto border-r border-border bg-white p-4 lg:block">
        {content}
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
        <Logo href="/dashboard" />
        <button
          className="rounded-md p-2 text-black"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-white p-4 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-brand text-lg font-bold">PocketGuard</span>
              <button
                className="rounded-md p-2 text-black"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        loading={loggingOut}
        title="Log out"
        message="Are you sure you want to log out of PocketGuard?"
        confirmLabel="Log out"
      />
    </>
  );
}
