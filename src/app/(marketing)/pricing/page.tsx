"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Animate } from "@/components/marketing/animate";

const included = [
  "Income and expense tracking",
  "Monthly spending plan",
  "Available to Spend",
  "Savings goals with progress",
  "Bills tracking",
  "Basic analytics",
  "Multiple currencies",
  "No bank connection needed",
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Simple pricing, no surprises"
        description="PocketGuard is free to use while we focus on getting money planning right."
      />

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Animate>
            <div className="mx-auto max-w-md">
              <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <h2 className="font-brand text-xl font-semibold text-black">
                  Free
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Everything you need to plan your money and spend with
                  confidence.
                </p>
                <div className="mt-6">
                  <span className="font-brand text-4xl font-bold text-black">
                    ₦0
                  </span>
                  <span className="text-muted"> / forever</span>
                </div>
                <ul className="mt-6 space-y-2 text-sm">
                  {included.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-black">
                      <Check className="h-4 w-4 text-positive" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-black px-6 text-base font-medium text-white transition-colors hover:bg-neutral-800"
                >
                  Get started free <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-4 text-center text-xs text-muted">
                  We keep pricing clear and honest. If a premium plan launches
                  later, existing users will be the first to know.
                </p>
              </div>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
