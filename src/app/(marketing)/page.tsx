"use client";

import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  CalendarClock,
  PiggyBank,
  ShieldCheck,
  Check,
  Plus,
  Receipt,
  Target,
  ChevronDown,
  Zap,
  BarChart3,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Animate, Stagger, StaggerItem } from "@/components/marketing/animate";
import { useState } from "react";

const demoValues = [
  { label: "Effective monthly income", amount: "₦650,000", positive: true },
  { label: "Upcoming bills reserved", amount: "₦85,000" },
  { label: "Envelope budgets allocated", amount: "₦240,000" },
  { label: "Goal contribution (amortized)", amount: "₦65,000" },
];

const faqs = [
  {
    q: "Is PocketGuard really 100% free?",
    a: "Yes. Plan your money, track actual expenses, calculate your daily burn pace, and know what you can safely spend — with zero paywalls or trial limits.",
  },
  {
    q: "Do I have to connect my bank account?",
    a: "No. PocketGuard is privacy-first. You control your figures with zero third-party bank screen-scraping or linked account access.",
  },
  {
    q: "How does Safe-to-Spend differ from bank balance?",
    a: "Your bank balance tells you what you have today, but ignores tomorrow's rent, upcoming subscriptions, and unspent grocery budgets. Safe-to-Spend deducts all future commitments so you never accidentally overspend.",
  },
  {
    q: "How does Auto-Match bill reconciliation work?",
    a: "When you log an expense that matches an unpaid bill's amount or keyword (like 'Internet' or 'Electricity'), PocketGuard automatically reconciles that bill as paid and sets up the next billing cycle.",
  },
  {
    q: "Can I use PocketGuard seamlessly on mobile?",
    a: "Absolutely. PocketGuard is engineered to feel like a high-performance native web application on iOS, Android, tablet, and desktop.",
  },
];

function InteractiveLivePreviewCard() {
  const [activeTab, setActiveTab] = useState<"spend" | "pace">("spend");

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-2xl shadow-neutral-900/10 transition-all">
      {/* Top subtle highlight gradient */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-black" />

      {/* Header section */}
      <div className="border-b border-border/80 bg-neutral-900 p-6 text-white sm:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Live Safe-to-Spend Engine
            </span>
          </div>

          {/* Toggle pill */}
          <div className="flex rounded-full bg-white/10 p-0.5 text-xs">
            <button
              onClick={() => setActiveTab("spend")}
              className={`rounded-full px-2.5 py-1 font-medium transition-all ${
                activeTab === "spend"
                  ? "bg-white text-black shadow-xs"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Balance
            </button>
            <button
              onClick={() => setActiveTab("pace")}
              className={`rounded-full px-2.5 py-1 font-medium transition-all ${
                activeTab === "pace"
                  ? "bg-white text-black shadow-xs"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Daily Pace
            </button>
          </div>
        </div>

        <div className="mt-4">
          {activeTab === "spend" ? (
            <div>
              <p className="font-brand text-4xl font-extrabold tracking-tight tabular sm:text-5xl">
                ₦260,000
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Guaranteed safe after bills, envelopes & goals
              </p>
            </div>
          ) : (
            <div>
              <p className="font-brand text-4xl font-extrabold tracking-tight tabular text-emerald-400 sm:text-5xl">
                ₦14,440 <span className="text-sm font-normal text-white/60">/ day</span>
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-300">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                18 days remaining · spend under this to stay green
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown ledger */}
      <div className="space-y-3.5 p-6 bg-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Active Monthly Deductions
        </p>
        {demoValues.map((v) => (
          <div
            key={v.label}
            className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-soft"
          >
            <span className="flex items-center gap-2.5 text-sm text-neutral-700">
              {v.positive ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-positive">
                  <TrendingUp className="h-4 w-4" />
                </div>
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                  <Receipt className="h-4 w-4" />
                </div>
              )}
              {v.label}
            </span>
            <span
              className={`font-semibold tabular text-sm ${
                v.positive ? "text-positive" : "text-black"
              }`}
            >
              {v.amount}
            </span>
          </div>
        ))}
      </div>

      {/* Footer bar */}
      <div className="border-t border-border bg-neutral-50/80 px-6 py-4">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1.5 font-medium text-black">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Auto-Rollover enabled
          </span>
          <span className="rounded-md bg-neutral-200/60 px-2 py-0.5 font-mono text-[11px] text-neutral-700">
            Smart Budget v2
          </span>
        </div>
      </div>
    </div>
  );
}

function FaqItem({
  faq,
  isOpen,
  onClick,
}: {
  faq: { q: string; a: string };
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white transition-all hover:border-neutral-300">
      <button
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-black text-base">{faq.q}</span>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft transition-transform duration-200 ${isOpen ? "rotate-180 bg-neutral-200" : ""}`}>
          <ChevronDown className="h-4 w-4 text-neutral-700" />
        </div>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed text-muted">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-neutral-50/80 via-white to-soft pt-6 pb-20 lg:py-28">
        {/* Soft decorative background blurs */}
        <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="pointer-events-none absolute top-40 left-10 h-72 w-72 rounded-full bg-neutral-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            
            {/* Left pitch */}
            <div className="lg:col-span-7">
              <Animate variant="slideRight">
                {/* Pill badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 shadow-xs">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold tracking-wide text-neutral-800">
                    Safe-to-Spend & Daily Burn Engine
                  </span>
                </div>

                <h1 className="mt-5 font-brand text-4xl font-extrabold leading-[1.1] tracking-tight text-black sm:text-6xl">
                  Plan your money.
                  <br />
                  <span className="text-neutral-500">Spend with zero guilt.</span>
                </h1>

                <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-600 sm:text-xl">
                  PocketGuard connects your real income, bills, category envelopes, and savings goals into one live calculation. Know exactly how much you can spend today without ever coming up short.
                </p>

                {/* Trust bullets */}
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm font-medium text-neutral-700">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-positive" /> No bank connection required
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-positive" /> Auto-match bill payments
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-positive" /> 1-click smart budgeting
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Link
                    href="/register"
                    className="inline-flex h-13 items-center justify-center gap-2.5 rounded-xl bg-black px-8 text-base font-semibold text-white shadow-lg shadow-black/10 transition-all hover:bg-neutral-800 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Get started free <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 text-base font-semibold text-neutral-900 transition-all hover:bg-neutral-50 hover:border-neutral-400"
                  >
                    Explore mechanics
                  </Link>
                </div>
              </Animate>
            </div>

            {/* Right Interactive Mockup Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <Animate variant="slideLeft" delay={0.15}>
                <InteractiveLivePreviewCard />
              </Animate>
            </div>

          </div>
        </div>
      </section>

      {/* Problem Comparison Section */}
      <section className="border-b border-border bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Animate className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">The Problem</span>
            <h2 className="mt-2 font-brand text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              Why your bank balance lies to you.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Seeing money in your checking account gives a false sense of security. It doesn't know about upcoming subscriptions, utility bills due next week, or emergency fund allocations.
            </p>
          </Animate>

          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <div className="group rounded-2xl border border-border bg-white p-7 transition-all hover:border-black/30 hover:shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-black group-hover:bg-black group-hover:text-white transition-colors">
                  <Receipt className="h-5 w-5" />
                </div>
                <h3 className="font-brand text-lg font-bold text-black">Micro-Expense Creep</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Small untracked purchases quietly drain your buffer until you're stressed by mid-month.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="group rounded-2xl border border-border bg-white p-7 transition-all hover:border-black/30 hover:shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-black group-hover:bg-black group-hover:text-white transition-colors">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <h3 className="font-brand text-lg font-bold text-black">Surprise Recurring Bills</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Quarterly hosting, yearly car insurance, or monthly utility bills hitting right after you spend.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="group rounded-2xl border border-border bg-white p-7 transition-all hover:border-black/30 hover:shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-black group-hover:bg-black group-hover:text-white transition-colors">
                  <Flame className="h-5 w-5" />
                </div>
                <h3 className="font-brand text-lg font-bold text-black">No Daily Burn Limit</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Lacking a simple per-day safe amount makes it easy to burn through disposable income too early.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="group rounded-2xl border border-border bg-white p-7 transition-all hover:border-black/30 hover:shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-black group-hover:bg-black group-hover:text-white transition-colors">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="font-brand text-lg font-bold text-black">Forgotten Savings</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Hoping to save "whatever is left" almost always leaves you with zero saved at the end of the month.
                </p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* How It Works with Visual Step Formula */}
      <section className="border-b border-border bg-neutral-50/70 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Animate className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">The 3-Step Process</span>
            <h2 className="mt-2 font-brand text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              From chaos to total financial clarity.
            </h2>
          </Animate>

          <Stagger className="mt-12 grid gap-6 lg:grid-cols-3">
            <StaggerItem>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-white p-8 shadow-xs">
                <div>
                  <span className="font-brand text-5xl font-black text-neutral-200">01</span>
                  <h3 className="mt-4 font-brand text-xl font-bold text-black">Capture Your Inflow</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    Set up your salary or side incomes. PocketGuard normalizes weekly, bi-weekly, or monthly paydays into an effective monthly pool.
                  </p>
                </div>
                <div className="mt-6 rounded-xl bg-neutral-50 p-3 font-mono text-xs text-neutral-600">
                  Effective Income = Max(Logged, Expected)
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-white p-8 shadow-xs">
                <div>
                  <span className="font-brand text-5xl font-black text-neutral-200">02</span>
                  <h3 className="mt-4 font-brand text-xl font-bold text-black">Plan With 1-Click Rollover</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    No tedious budgeting. Copy last month's envelopes in 1 click or generate a smart budget based on your last 3 months of actual history.
                  </p>
                </div>
                <div className="mt-6 rounded-xl bg-neutral-50 p-3 font-mono text-xs text-neutral-600">
                  Envelopes + Amortized Goal Targets
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-white p-8 shadow-xs">
                <div>
                  <span className="font-brand text-5xl font-black text-neutral-200">03</span>
                  <h3 className="mt-4 font-brand text-xl font-bold text-black">Spend by the Safe Daily Pace</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    PocketGuard reconciles your bills automatically and recalculates your daily burn rate each morning so you never guess again.
                  </p>
                </div>
                <div className="mt-6 rounded-xl bg-neutral-50 p-3 font-mono text-xs text-neutral-600">
                  Safe Pace = Available / Days Remaining
                </div>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* Feature Grid Spotlight */}
      <section className="border-b border-border bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Feature Spotlight</span>
              <h2 className="mt-2 font-brand text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
                Built for real money decisions.
              </h2>
            </div>
            <Link
              href="/features"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-black hover:text-neutral-600 transition-colors"
            >
              See all capabilities <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-8 transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-positive mb-5">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-brand text-lg font-bold text-black">Auto-Match Bill Reconciliation</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Log a receipt for rent or electricity and PocketGuard automatically matches it to your upcoming bill, marks it paid, and spins up the next cycle.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-8 transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-black mb-5">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-brand text-lg font-bold text-black">Smart 3-Month Auto-Budget</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Let the engine review your historical spending patterns to recommend realistic envelopes with built-in safety buffers.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-8 transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-black mb-5">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-brand text-lg font-bold text-black">Overspend Deficit Shields</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                If dining out exceeds its envelope, PocketGuard dynamically adjusts your remaining Safe-to-Spend balance so your totals never break.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-8 transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-black mb-5">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-brand text-lg font-bold text-black">Amortized Savings Targets</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Set a goal due in December; the math automatically allocates only this month's required installment instead of starving your balance today.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-8 transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-black mb-5">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="font-brand text-lg font-bold text-black">100% Zero Bank Link Risks</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Zero third-party screen scraping. No credentials stored. Fast manual input gives you awareness without privacy compromises.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-8 transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-black mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-brand text-lg font-bold text-black">Multi-Device Web App</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Engineered for quick on-the-go receipt entry at the checkout counter on your phone, with deep monthly reviews on your desktop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Forever Banner */}
      <section className="border-b border-border bg-neutral-50/60 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 sm:p-12 shadow-xl shadow-neutral-200/40">
            <div className="grid gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-7">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                  FREE & OPEN ACCESS
                </div>
                <h3 className="mt-4 font-brand text-3xl font-extrabold text-black">
                  Zero subscriptions. No paywalls.
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  Get full access to all budgeting features, auto-matching, goal tracking, and daily pace calculators.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-medium text-neutral-800">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-positive" /> Full Safe-to-Spend
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-positive" /> Auto-Rollover
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-positive" /> Bill Reconciliation
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-positive" /> Multi-Goal Tracking
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-neutral-900 p-8 text-center text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Monthly Cost</p>
                <p className="mt-2 font-brand text-5xl font-black text-white">₦0</p>
                <p className="mt-1 text-xs text-neutral-400">Forever free. No credit card required.</p>
                <Link
                  href="/register"
                  className="mt-6 w-full rounded-xl bg-white py-3.5 text-center text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="border-b border-border bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Animate className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Got Questions?</span>
            <h2 className="mt-2 font-brand text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-muted">Everything you need to know about PocketGuard's calculation model.</p>
          </Animate>

          <Stagger className="mt-10 space-y-3" staggerDelay={0.05}>
            {faqs.map((faq, i) => (
              <StaggerItem key={faq.q}>
                <FaqItem
                  faq={faq}
                  isOpen={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Final Heroic CTA */}
      <section className="relative overflow-hidden bg-black text-white py-24 sm:py-28">
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-emerald-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Animate>
            <h2 className="font-brand text-4xl font-extrabold tracking-tight sm:text-5xl">
              Give every single naira a job today.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-300">
              Join thousands who have stopped stressing about their bank balance. Set up your first safe plan in 3 minutes.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-black transition-all hover:bg-neutral-200 hover:-translate-y-0.5"
              >
                Start planning for free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
