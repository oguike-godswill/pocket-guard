"use client";

import Link from "next/link";
import { ArrowRight, Check, Sparkles, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Animate } from "@/components/marketing/animate";

const included = [
  "Dynamic Safe-to-Spend & Daily Pace Calculation",
  "1-Click Auto-Rollover & 3-Month Smart Budgeting",
  "Automated Bill Matching & Recurring Cycles",
  "Amortized Goal Progress & Timeline Tracking",
  "Complete Income & Expense Transaction Ledger",
  "Category Envelope Overspend Shields",
  "8 Global Currencies Support (NGN, USD, EUR, GBP, etc.)",
  "100% Private — Zero Bank Connection Risk",
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Transparent Pricing"
        title="100% Free. No hidden fees. No paywalls."
        description="We believe everyone deserves financial clarity. PocketGuard has zero monthly subscription fees and never locks essential features behind a paywall."
      />

      <section className="border-b border-border bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Animate>
            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl shadow-neutral-200/50">
              <div className="grid md:grid-cols-12">
                
                {/* Left features overview */}
                <div className="p-8 sm:p-10 md:col-span-7">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    <Sparkles className="h-3.5 w-3.5" /> COMPLETE SUITE
                  </div>
                  <h2 className="mt-4 font-brand text-2xl font-extrabold text-black sm:text-3xl">
                    Free Community Plan
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Full access to our entire financial calculation engine with zero limitations on entries or goals.
                  </p>

                  <ul className="mt-8 space-y-3.5">
                    {included.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm font-medium text-neutral-800">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-positive">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right price card */}
                <div className="flex flex-col justify-between border-t border-border bg-neutral-900 p-8 text-white sm:p-10 md:col-span-5 md:border-t-0 md:border-l">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Monthly Cost
                    </span>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-brand text-6xl font-black text-white">₦0</span>
                      <span className="text-sm font-medium text-neutral-400">/ forever</span>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-neutral-400">
                      No trial period. No credit card required. Free to use on web, tablet, and mobile.
                    </p>
                  </div>

                  <div className="mt-8 space-y-3">
                    <Link
                      href="/register"
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-black transition-all hover:bg-neutral-200 hover:-translate-y-0.5 shadow-md"
                    >
                      Get started free <ArrowRight className="h-4 w-4" />
                    </Link>
                    <p className="text-center text-[11px] text-neutral-400">
                      Takes less than 3 minutes to set up
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </Animate>
        </div>
      </section>

      {/* Security guarantee */}
      <section className="bg-soft py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xs">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="font-brand text-xl font-bold text-black">
            Our Commitment to Your Privacy
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            We will never sell your financial records, display ads inside your dashboard, or force you to connect bank credentials.
          </p>
        </div>
      </section>
    </>
  );
}
