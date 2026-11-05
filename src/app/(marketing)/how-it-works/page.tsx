"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, Sparkles, RefreshCcw } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Animate, Stagger, StaggerItem } from "@/components/marketing/animate";

const steps = [
  {
    number: "01",
    tag: "INFLOW NORMALIZATION",
    title: "Capture your income sources",
    description:
      "Tell PocketGuard what you earn and your pay cycle (monthly salary, bi-weekly retainers, or freelance contracts). The engine normalizes multiple streams into your effective monthly starting pool.",
    takeaway: "Eliminates double-counting between expectations and deposits.",
  },
  {
    number: "02",
    tag: "SMART ENVELOPES",
    title: "Set your envelopes & goals in 1 click",
    description:
      "Planning shouldn't take hours. PocketGuard lets you copy your previous month's envelopes in one tap, or automatically calculates a 3-month historical average to propose realistic spending caps.",
    takeaway: "Long-term savings goals are amortized by deadline.",
  },
  {
    number: "03",
    tag: "DAILY PACING & RECONCILIATION",
    title: "Spend with real-time confidence",
    description:
      "Available to Spend deducts unpaid bills, planned envelopes, and goal reserves. When you record a receipt that matches an upcoming bill, PocketGuard automatically marks it paid.",
    takeaway: "View your daily burn limit every morning.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How PocketGuard Works"
        title="Three simple steps to absolute financial clarity"
        description="Here is how our calculation engine turns scattered expenses, unpredictable bills, and wishful goals into one clear number you can trust."
      />

      <section className="border-b border-border bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Stagger className="space-y-10" staggerDelay={0.08}>
            {steps.map((step) => (
              <StaggerItem key={step.number}>
                <div className="group rounded-3xl border border-neutral-200 bg-white p-8 sm:p-10 shadow-xs transition-all hover:border-black/30 hover:shadow-xl hover:shadow-neutral-900/5">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <span className="font-brand text-5xl font-black text-neutral-200 group-hover:text-black transition-colors">
                      {step.number}
                    </span>
                    <div className="flex-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        {step.tag}
                      </span>
                      <h2 className="mt-1 font-brand text-2xl font-extrabold text-black">
                        {step.title}
                      </h2>
                      <p className="mt-3 text-base leading-relaxed text-muted">
                        {step.description}
                      </p>
                      <div className="mt-5 flex items-center gap-2 rounded-xl bg-neutral-50 px-4 py-2.5 text-xs font-semibold text-neutral-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        {step.takeaway}
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Mechanics callout */}
      <section className="border-b border-border bg-soft py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">The Golden Formula</span>
          <h3 className="mt-2 font-brand text-2xl font-extrabold text-black sm:text-3xl">
            Safe-to-Spend = Inflow − Bills − Envelopes − Goals
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Simple enough to understand in 5 seconds, rigorous enough to protect your wallet every day of the month.
          </p>
        </div>
      </section>

      <section className="bg-black text-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Animate>
            <h2 className="font-brand text-3xl font-extrabold sm:text-4xl">
              Ready to take control of your cash flow?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-neutral-300">
              Create your account in seconds and see your first Safe-to-Spend balance immediately.
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
