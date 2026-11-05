"use client";

import Link from "next/link";
import { ArrowRight, Target, Shield, Heart, Lightbulb, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Animate, Stagger, StaggerItem } from "@/components/marketing/animate";

const values = [
  {
    icon: Target,
    title: "Clarity Over Complexity",
    description:
      "Most money apps drown you in charts and double-entry accounting terms. PocketGuard is engineered to answer one urgent question: 'How much can I spend right now without regretting it?'",
  },
  {
    icon: Shield,
    title: "Privacy as a First Principle",
    description:
      "Your financial life should never be scraped, tracked, or sold to lenders and advertisers. We never ask for bank credentials or third-party aggregation access.",
  },
  {
    icon: Heart,
    title: "Honoring Real Life",
    description:
      "Income isn't always linear, and unexpected costs happen. Our dynamic overspend absorption and amortized goal horizons bend with reality instead of making you feel guilty.",
  },
  {
    icon: Lightbulb,
    title: "Guaranteed Transparency",
    description:
      "No dark patterns, sudden trial expirations, or paywalls blocking your historical reports. We build straightforward software that does what it promises.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Mission"
        title="Built around one essential number"
        description="We believe financial peace doesn't come from tracking 50 spreadsheet tabs — it comes from knowing what is genuinely safe to spend today."
      />

      {/* Story narrative */}
      <section className="border-b border-border bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Animate>
            <div className="space-y-6 text-base sm:text-lg leading-relaxed text-neutral-600">
              <p>
                <strong className="text-black font-semibold">PocketGuard</strong> started from a universal frustration: modern budgeting apps are designed like corporate accounting packages. They force you to link bank accounts, categorize hundreds of historical transactions, and leave you staring at complex graphs that don't tell you if you can afford dinner tonight.
              </p>
              <p>
                Checking your bank balance is equally misleading. Seeing money in your checking account on a Tuesday gives no warning about rent due next Monday, your car insurance renewal next week, or the savings installment you promised yourself to set aside.
              </p>
              <p>
                We rebuilt the personal budgeting equation around a single, honest metric: <span className="font-semibold text-black">Safe-to-Spend</span>. By automatically deducting unpaid bills, unspent category envelopes, and deadline-amortized savings goals from your effective income, you get one unmistakable number you can trust.
              </p>
            </div>
          </Animate>

          <Animate delay={0.1}>
            <div className="mt-12 flex items-center justify-start gap-4">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-black px-8 text-base font-semibold text-white shadow-md transition-all hover:bg-neutral-800 hover:-translate-y-0.5"
              >
                Join PocketGuard free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Animate>
        </div>
      </section>

      {/* Core Values */}
      <section className="border-b border-border bg-soft py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Our Principles</span>
            <h2 className="mt-2 font-brand text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              What guides our design decisions
            </h2>
          </div>

          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2" staggerDelay={0.06}>
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="rounded-2xl border border-border bg-white p-8 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-black mb-5">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-brand text-xl font-bold text-black">{v.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{v.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
