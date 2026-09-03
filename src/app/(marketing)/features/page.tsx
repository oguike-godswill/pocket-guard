import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  CalendarClock,
  PiggyBank,
  Receipt,
  BarChart3,
  Settings,
} from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { marketingPageMetadata } from "@/lib/seo";

export const metadata: Metadata = marketingPageMetadata({
  title: "Features",
  description:
    "Explore PocketGuard's features: transactions, monthly planning, savings goals, bills and analytics — all focused on Available to Spend.",
  path: "/features",
});

const features = [
  {
    icon: TrendingUp,
    title: "Available to Spend",
    description:
      "The central number. Brings income, planned expenses, savings and bills into one clear, trustworthy figure.",
  },
  {
    icon: Receipt,
    title: "Transactions",
    description:
      "Record every income and expense, categorize them, and see a clear history you can filter and search.",
  },
  {
    icon: CalendarClock,
    title: "Monthly plan",
    description:
      "Plan your spending by category before the month begins, and compare planned vs actual as it happens.",
  },
  {
    icon: PiggyBank,
    title: "Savings goals",
    description:
      "Set a target, a target date and a contribution. Track progress and see if you're on pace.",
  },
  {
    icon: ArrowRight,
    title: "Bills",
    description:
      "Keep track of upcoming and recurring bills, mark them paid, and see how they affect your spending.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Understand your spending with clear, focused insights — not a full accounting suite.",
  },
  {
    icon: Settings,
    title: "Settings & profile",
    description:
      "Manage your profile, currency and notification preferences in one place.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Features"
        title="Everything you need to plan your money"
        description="PocketGuard is focused on one thing: making it clear how much you can safely spend. Every feature supports that."
      />

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-white p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-soft text-black">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-brand text-base font-semibold text-black">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-brand text-2xl font-bold sm:text-3xl">
            Start planning today
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/70">
            It's free. Create your account and see your first plan.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 text-base font-semibold text-black transition-colors hover:bg-neutral-200"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
