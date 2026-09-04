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
} from "lucide-react";
import { Animate, Stagger, StaggerItem } from "@/components/marketing/animate";
import { useState } from "react";

const demoValues = [
  { label: "Income this month", amount: "₦500,000", positive: true },
  { label: "Planned expenses", amount: "₦214,600" },
  { label: "Savings commitments", amount: "₦100,000" },
];

const faqs = [
  {
    q: "Is PocketGuard really free?",
    a: "Yes. Plan your money, track spending, and know what you can safely spend — no hidden costs, no trial limits.",
  },
  {
    q: "Do I need to connect my bank account?",
    a: "No. You enter your income and expenses yourself. No bank connection required, and we never pull data from linked accounts.",
  },
  {
    q: "How does Available to Spend work?",
    a: "It subtracts your bills, planned expenses, and savings commitments from your income. One clear number, updated in real time.",
  },
  {
    q: "Can I use it on my phone?",
    a: "Yes. PocketGuard works great on mobile, tablet, and desktop right in your browser.",
  },
];

function AvailableToSpendHeroCard() {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-white shadow-xl shadow-neutral-200/50">
      <div className="border-b border-border p-6">
        <p className="text-sm text-muted">Available to Spend</p>
        <p className="mt-1 font-brand text-4xl font-bold tracking-tight text-black tabular">
          ₦185,400
        </p>
        <p className="mt-2 text-xs text-positive">
          You can safely spend this right now.
        </p>
      </div>
      <div className="space-y-4 p-6">
        {demoValues.map((v) => (
          <div key={v.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-muted">
              {v.positive ? (
                <TrendingUp className="h-4 w-4 text-positive" />
              ) : (
                <Receipt className="h-4 w-4 text-muted" />
              )}
              {v.label}
            </span>
            <span
              className={`font-medium tabular ${
                v.positive ? "text-positive" : "text-black"
              }`}
            >
              {v.amount}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-border bg-soft p-4">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Plus className="h-4 w-4 text-positive" />
          <span>
            <span className="font-medium text-black">Add income</span> · Add
            expense · Add bill
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
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <button
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-black">{faq.q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-sm text-muted">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Animate variant="slideRight">
              <h1 className="font-brand text-4xl font-bold leading-tight tracking-tight text-black sm:text-5xl">
                Plan your money.
                <br />
                Spend with confidence.
              </h1>
              <p className="mt-4 max-w-md text-lg text-muted">
                PocketGuard brings your income, expenses, bills and savings
                into one clear plan. Know exactly how much you can safely spend
                right now.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-positive" /> Simple
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-positive" /> Clear
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-positive" /> Private
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-positive" /> Built for everyday
                  money planning
                </span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-black px-8 text-base font-medium text-white transition-colors hover:bg-neutral-800"
                >
                  Get started free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-white px-6 text-base font-medium text-black transition-colors hover:bg-soft"
                >
                  See how it works
                </Link>
              </div>
            </Animate>
            <Animate variant="slideLeft" delay={0.15} className="flex justify-center lg:justify-end">
              <AvailableToSpendHeroCard />
            </Animate>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <Animate>
            <h2 className="max-w-2xl font-brand text-3xl font-bold tracking-tight text-black">
              Does your money feel scattered?
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              Too many expenses, surprise bills, unclear spending limits and
              vague savings goals. PocketGuard turns that into one clear, simple
              plan.
            </p>
          </Animate>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-soft text-black">
                  <Receipt className="h-5 w-5" />
                </div>
                <h3 className="font-brand text-base font-semibold text-black">Too many expenses</h3>
                <p className="mt-2 text-sm text-muted">Every small purchase adds up. See where your money actually goes.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-soft text-black">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <h3 className="font-brand text-base font-semibold text-black">Surprise bills</h3>
                <p className="mt-2 text-sm text-muted">Upcoming and recurring bills, so nothing catches you off guard.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-soft text-black">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-brand text-base font-semibold text-black">Unclear limits</h3>
                <p className="mt-2 text-sm text-muted">Know what you can safely spend without second-guessing.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-soft text-black">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="font-brand text-base font-semibold text-black">Vague savings goals</h3>
                <p className="mt-2 text-sm text-muted">Turn a wish into a target with a date and a plan to reach it.</p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <Animate>
            <h2 className="font-brand text-3xl font-bold tracking-tight text-black">
              How it works
            </h2>
          </Animate>
          <Stagger className="mt-10 grid gap-6 lg:grid-cols-3">
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6">
                <span className="font-brand text-4xl font-bold text-black/10">01</span>
                <h3 className="mt-4 font-brand text-lg font-semibold text-black">Add your money</h3>
                <p className="mt-2 text-sm text-muted">Enter your income sources and how often you get paid.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6">
                <span className="font-brand text-4xl font-bold text-black/10">02</span>
                <h3 className="mt-4 font-brand text-lg font-semibold text-black">Set your plan</h3>
                <p className="mt-2 text-sm text-muted">Plan your spending by category and set aside savings and bills.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6">
                <span className="font-brand text-4xl font-bold text-black/10">03</span>
                <h3 className="mt-4 font-brand text-lg font-semibold text-black">Know what you can spend</h3>
                <p className="mt-2 text-sm text-muted">Available to Spend shows what's left, updated from your real money.</p>
              </div>
            </StaggerItem>
          </Stagger>
          <Animate delay={0.2}>
            <div className="mt-8 rounded-xl border border-border bg-white p-6">
              <p className="text-sm font-medium text-black">Example calculation</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted">Income</span>
                <span className="font-medium tabular">₦500,000</span>
                <span className="text-muted">− planned expenses</span>
                <span className="font-medium tabular">₦214,600</span>
                <span className="text-muted">− savings</span>
                <span className="font-medium tabular">₦100,000</span>
                <span className="text-muted">=</span>
                <span className="font-semibold text-positive tabular">
                  Available to Spend ₦185,400
                </span>
              </div>
              <p className="mt-2 text-xs text-muted">
                Demo figures shown for illustration only.
              </p>
            </div>
          </Animate>
        </div>
      </section>

      {/* Feature showcase */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <Animate>
            <h2 className="font-brand text-3xl font-bold tracking-tight text-black">
              Everything in one place
            </h2>
          </Animate>
          <Stagger className="mt-10 grid gap-4 lg:grid-cols-2">
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-md">
                <h3 className="flex items-center gap-2 font-brand text-lg font-semibold text-black">
                  <Receipt className="h-5 w-5 text-positive" />
                  Know where your money goes
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Transactions and spending categories in one clear history.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-md">
                <h3 className="flex items-center gap-2 font-brand text-lg font-semibold text-black">
                  <CalendarClock className="h-5 w-5 text-positive" />
                  Plan before you spend
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Monthly planning, recurring expenses and bills, set in advance.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-md">
                <h3 className="flex items-center gap-2 font-brand text-lg font-semibold text-black">
                  <PiggyBank className="h-5 w-5 text-positive" />
                  Save for what matters
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Savings goals with target dates and progress you can track.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-md">
                <h3 className="flex items-center gap-2 font-brand text-lg font-semibold text-black">
                  <TrendingUp className="h-5 w-5 text-positive" />
                  Always know what's available
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Available to Spend — one clear number, from your real data.
                </p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* Why PocketGuard */}
      <section className="border-b border-border bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <Animate>
            <h2 className="font-brand text-3xl font-bold tracking-tight text-black">
              Why people choose PocketGuard
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              Built for real life, not accounting textbooks.
            </p>
          </Animate>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <StaggerItem>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-brand text-base font-semibold text-black">Quick to set up</h3>
                  <p className="mt-1 text-sm text-muted">
                    Create your account, enter your income, and build your first plan in under 5 minutes.
                  </p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-brand text-base font-semibold text-black">Clear insights</h3>
                  <p className="mt-1 text-sm text-muted">
                    See spending by category, track monthly trends, and understand where your money goes.
                  </p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-brand text-base font-semibold text-black">Private by default</h3>
                  <p className="mt-1 text-sm text-muted">
                    No bank connections. Your data is encrypted and only accessible by you.
                  </p>
                </div>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* Real-life scenarios */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <Animate>
            <h2 className="font-brand text-3xl font-bold tracking-tight text-black">
              Ready for real life
            </h2>
          </Animate>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">Payday</span>
                <h3 className="mt-2 font-brand text-base font-semibold text-black">Income lands</h3>
                <p className="mt-2 text-sm text-muted">Add your income and your plan updates instantly.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">Rent week</span>
                <h3 className="mt-2 font-brand text-base font-semibold text-black">Rent is due</h3>
                <p className="mt-2 text-sm text-muted">Mark bills paid and see space open up in your plan.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">Unexpected</span>
                <h3 className="mt-2 font-brand text-base font-semibold text-black">A surprise expense</h3>
                <p className="mt-2 text-sm text-muted">Log it, categorize it, and see the real impact.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-xl border border-border bg-white p-6">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">Saving</span>
                <h3 className="mt-2 font-brand text-base font-semibold text-black">Saving for a goal</h3>
                <p className="mt-2 text-sm text-muted">Track progress toward what matters most to you.</p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* Security */}
      <section className="border-b border-border bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <Animate>
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="font-brand text-3xl font-bold tracking-tight text-black">
                Your data stays yours
              </h2>
              <p className="mt-3 text-muted">
                Only you can access your financial records. Your financial
                information is protected with secure sessions and ownership checks
                on every request.
              </p>
              <Link
                href="/privacy"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-black hover:underline"
              >
                Read our privacy policy <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Animate>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <Animate>
            <h2 className="font-brand text-3xl font-bold tracking-tight text-black">
              Pricing
            </h2>
          </Animate>
          <Animate delay={0.1}>
            <div className="mt-8 max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
              <h3 className="font-brand text-xl font-semibold text-black">Free</h3>
              <p className="mt-2 text-sm text-muted">
                Plan your money and stay confident about what you can spend.
              </p>
              <div className="mt-6">
                <span className="font-brand text-4xl font-bold text-black">₦0</span>
                <span className="text-muted"> / forever</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {[
                  "Income, expenses, bills and savings",
                  "Monthly plan and Available to Spend",
                  "Savings goals with progress",
                  "Basic analytics",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-black">
                    <Check className="h-4 w-4 text-positive" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-lg bg-black px-6 text-base font-medium text-white transition-colors hover:bg-neutral-800"
              >
                Get started free
              </Link>
            </div>
          </Animate>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="border-b border-border bg-soft">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-20">
          <Animate>
            <h2 className="font-brand text-3xl font-bold tracking-tight text-black">
              Frequently asked questions
            </h2>
          </Animate>
          <Stagger className="mt-8 space-y-2" staggerDelay={0.05}>
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
          <Animate delay={0.2}>
            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="inline-flex items-center gap-1 text-sm font-medium text-black hover:underline"
              >
                See all questions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Animate>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <Animate>
            <h2 className="font-brand text-3xl font-bold tracking-tight sm:text-4xl">
              Give every naira a plan.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/70">
              Create a free account, complete a quick onboarding, and see your
              first plan in minutes.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 text-base font-semibold text-black transition-colors hover:bg-neutral-200"
            >
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </Animate>
        </div>
      </section>
    </>
  );
}
