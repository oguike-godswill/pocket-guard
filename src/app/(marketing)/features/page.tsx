"use client";

import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  CalendarClock,
  PiggyBank,
  Receipt,
  BarChart3,
  Settings,
  Sparkles,
  Flame,
  CheckCircle2,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Animate, Stagger, StaggerItem } from "@/components/marketing/animate";

const featureGroups = [
  {
    category: "Calculation Engine",
    items: [
      {
        icon: TrendingUp,
        title: "Safe-to-Spend Balance",
        highlight: "Core Algorithm",
        description:
          "Calculates what you can safely spend right now by automatically deducting upcoming bills, category envelopes, and amortized monthly goals from effective income.",
      },
      {
        icon: Flame,
        title: "Daily Spending Pace",
        highlight: "Burn Control",
        description:
          "Knows exactly how many days remain in the month and provides a simple per-day spending limit so you never run out of money before your next payday.",
      },
      {
        icon: BarChart3,
        title: "Dynamic Overspend Protection",
        highlight: "Adaptive Math",
        description:
          "If you exceed your dining out or entertainment budget, the engine automatically absorbs the deficit in real time, adjusting your spending limit without breaking your finances.",
      },
    ],
  },
  {
    category: "Automation & Lifecycle",
    items: [
      {
        icon: Sparkles,
        title: "1-Click Auto-Rollover",
        highlight: "Zero Effort",
        description:
          "Start each new month instantly by copying your previous month's envelopes or letting the system recommend a smart budget from your last 3 months of history.",
      },
      {
        icon: RefreshCcw,
        title: "Auto-Match Bill Reconciliation",
        highlight: "Smart Matching",
        description:
          "When you log an expense for rent, wifi, or utility bills, PocketGuard automatically recognizes it, marks the bill as paid, and sets up the next due cycle.",
      },
      {
        icon: PiggyBank,
        title: "Amortized Savings Horizons",
        highlight: "Goal Planning",
        description:
          "Instead of withholding a huge lump sum today, PocketGuard divides long-term savings goals evenly across the months until your deadline.",
      },
    ],
  },
  {
    category: "Security & Control",
    items: [
      {
        icon: ShieldCheck,
        title: "Zero Bank Connection Risk",
        highlight: "100% Private",
        description:
          "No third-party aggregators, credential sharing, or bank account scraping. Your data remains strictly between you and your encrypted device storage.",
      },
      {
        icon: Receipt,
        title: "Comprehensive Ledger",
        highlight: "Fast Entry",
        description:
          "Filter by category, search notes, view historical breakdown percentages, and manage your entire financial journey in one unified view.",
      },
      {
        icon: Settings,
        title: "Multi-Currency Preferences",
        highlight: "Global Support",
        description:
          "Support for 8 major currencies (NGN, USD, EUR, GBP, KES, GHS, ZAR, EGP) with instant currency symbol formatting across the entire app.",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Features & Capabilities"
        title="Everything you need to spend without anxiety"
        description="PocketGuard strips away the spreadsheet jargon and focuses on what matters: one clear number, intelligent automation, and absolute privacy."
      />

      {/* Feature groups */}
      <section className="border-b border-border bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-20">
          {featureGroups.map((group) => (
            <div key={group.category}>
              <div className="mb-8 border-b border-border/80 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  {group.category}
                </span>
                <h2 className="mt-1 font-brand text-2xl font-extrabold text-black">
                  Engineered for real-world reliability
                </h2>
              </div>

              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
                {group.items.map((feature) => (
                  <StaggerItem key={feature.title}>
                    <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-white p-7 transition-all hover:border-black/30 hover:shadow-lg hover:shadow-neutral-900/5">
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-black">
                            <feature.icon className="h-6 w-6" />
                          </div>
                          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">
                            {feature.highlight}
                          </span>
                        </div>
                        <h3 className="font-brand text-lg font-bold text-black">
                          {feature.title}
                        </h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-muted">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-black text-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Animate>
            <h2 className="font-brand text-3xl font-extrabold tracking-tight sm:text-4xl">
              Experience the difference today
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-neutral-300">
              Free forever. No credit cards, no third-party bank linking, no complicated setup.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-black transition-all hover:bg-neutral-200 hover:-translate-y-0.5"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </Animate>
        </div>
      </section>
    </>
  );
}
