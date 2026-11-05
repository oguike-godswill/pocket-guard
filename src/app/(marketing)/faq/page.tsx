"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/marketing/page-header";
import { cn } from "@/lib/cn";
import { Animate, Stagger, StaggerItem } from "@/components/marketing/animate";

const faqs = [
  {
    q: "How does PocketGuard calculate my Safe-to-Spend balance?",
    a: "It takes your effective monthly income and automatically subtracts: (1) any upcoming unpaid bills for the month, (2) the remaining unspent allowance in your category envelopes, and (3) amortized monthly contributions for your active savings goals. The remaining number is what you can spend right now with 100% confidence.",
  },
  {
    q: "Why do you not connect to bank accounts via Plaid or Open Banking?",
    a: "Two reasons: security and intentionality. Third-party bank scrapers often break, store sensitive credentials, and commoditize your data. Manually or semi-automatically recording transactions takes only 5 seconds per expense and builds true mindfulness around your spending habits.",
  },
  {
    q: "What is the Daily Spending Pace feature?",
    a: "Your Daily Pace takes your current Safe-to-Spend balance and divides it by the number of days remaining in the month. If you have ₦150,000 left and 15 days in the month, your pace is ₦10,000/day. Spending under your daily pace guarantees you stay in the green.",
  },
  {
    q: "How does Auto-Match Bill Reconciliation work?",
    a: "When you log an expense (such as ₦25,000 with note 'Electricity' or categorized under 'Bills'), PocketGuard checks your list of open bills. If the amount and keyword match, it automatically marks that bill as paid and rolls forward the next billing cycle.",
  },
  {
    q: "What is 1-Click Auto-Rollover and Smart Auto-Budget?",
    a: "Instead of rebuilding your budget every 1st of the month, you can copy last month's budget in one click. Or, choose 'Smart 3-mo Auto-Budget', which averages your last 3 months of actual category spending, adds a small safety buffer, and creates a realistic budget for you.",
  },
  {
    q: "How are savings goals treated in my budget?",
    a: "Rather than deducting your entire savings goal target in a single month (which would falsely wipe out your cash), PocketGuard calculates an amortized monthly installment based on your target completion date.",
  },
  {
    q: "Which currencies does PocketGuard support?",
    a: "PocketGuard supports 8 global and regional currencies: NGN (₦), USD ($), GBP (£), EUR (€), KES (KSh), GHS (GH₵), ZAR (R), and EGP (E£). You can change your preferred currency anytime in Settings.",
  },
  {
    q: "Is PocketGuard really completely free?",
    a: "Yes. All calculation features, bill reconciliation, envelope budgeting, and goal trackers are 100% free with no trial periods or credit card requirements.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <PageHeader
        eyebrow="Knowledge Base"
        title="Frequently asked questions"
        description="Everything you need to know about PocketGuard's calculation engine, privacy standards, and daily spending pace."
      />
      <section className="border-b border-border bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Stagger className="space-y-3.5" staggerDelay={0.04}>
            {faqs.map((faq, i) => {
              const open = openIndex === i;
              return (
                <StaggerItem key={faq.q}>
                  <div className="overflow-hidden rounded-2xl border border-border bg-white transition-all hover:border-neutral-300">
                    <button
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                      onClick={() => setOpenIndex(open ? null : i)}
                      aria-expanded={open}
                    >
                      <span className="font-semibold text-black text-base">{faq.q}</span>
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft transition-transform duration-200",
                          open && "rotate-180 bg-neutral-200"
                        )}
                      >
                        <ChevronDown className="h-4 w-4 text-neutral-700" />
                      </div>
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-5 text-sm leading-relaxed text-muted">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>

          <div className="mt-16 rounded-2xl bg-neutral-50 p-8 text-center border border-border">
            <h3 className="font-brand text-lg font-bold text-black">
              Still have a question?
            </h3>
            <p className="mt-1 text-sm text-muted">
              We're here to help you get the most out of your money planning.
            </p>
            <div className="mt-5">
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-6 text-sm font-semibold text-white transition-all hover:bg-neutral-800"
              >
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
