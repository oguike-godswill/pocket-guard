"use client";

import Link from "next/link";
import { ArrowRight, Target, Shield, Heart, Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Animate, Stagger, StaggerItem } from "@/components/marketing/animate";

const values = [
  {
    icon: Target,
    title: "Clarity over complexity",
    description:
      "Every feature is designed to answer one question: how much can I safely spend right now? If it doesn't help answer that, it doesn't belong.",
  },
  {
    icon: Shield,
    title: "Privacy first",
    description:
      "Your financial data is yours. We don't sell it, we don't access it unnecessarily, and we never connect to your bank.",
  },
  {
    icon: Heart,
    title: "Built for real life",
    description:
      "Surprise expenses, irregular income, multiple savings goals — PocketGuard handles the messiness of everyday money.",
  },
  {
    icon: Lightbulb,
    title: "Honest by default",
    description:
      "No dark patterns, no hidden fees, no bait-and-switch. We charge what we say or nothing at all.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Built around one question"
        description="How much can I safely spend right now?"
      />

      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Animate>
            <div className="space-y-6 text-muted">
              <p>
                PocketGuard started with a simple frustration: money planning
                tools felt like accounting software, not something built for
                everyday life. People don't want spreadsheets and ledgers — they
                want to know they can spend without worrying.
              </p>
              <p>
                So we built PocketGuard around a single, central number:
                <span className="font-medium text-black"> Available to Spend</span>
                . It brings your income, expenses, bills and savings into one
                clear plan and tells you, right now, how much you can safely
                spend.
              </p>
              <p>
                We keep the product calm, simple and trustworthy. No flashy
                features, no gimmicks — just a clear, precise way to plan your
                money.
              </p>
              <p>
                PocketGuard respects your privacy. Your financial records are
                yours alone, protected with secure sessions and access controls
                on everything you do.
              </p>
            </div>
          </Animate>

          <Animate delay={0.1}>
            <div className="mt-12 flex justify-center">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-black px-8 text-base font-medium text-white transition-colors hover:bg-neutral-800"
              >
                Start planning <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Animate>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-border bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <Animate>
            <h2 className="font-brand text-3xl font-bold tracking-tight text-black">
              What we believe
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              The principles behind every decision we make.
            </p>
          </Animate>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <div className="flex gap-4 rounded-xl border border-border bg-white p-6 h-full">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-brand text-base font-semibold text-black">
                      {value.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {value.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Numbers */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <Animate>
            <h2 className="font-brand text-3xl font-bold tracking-tight text-black">
              PocketGuard in numbers
            </h2>
          </Animate>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { number: "8", label: "Currencies supported" },
              { number: "12", label: "Spending categories" },
              { number: "6", label: "Income categories" },
              { number: "0", label: "Bank connections required" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center rounded-xl border border-border bg-white p-6">
                  <p className="font-brand text-4xl font-bold text-black">{stat.number}</p>
                  <p className="mt-2 text-sm text-muted">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
