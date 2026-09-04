"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Animate, Stagger, StaggerItem } from "@/components/marketing/animate";

const steps = [
  {
    number: "01",
    title: "Add your money",
    description:
      "Tell PocketGuard how much you earn and how often. Add income sources like salary, business or freelance so your plan is built on your real money.",
  },
  {
    number: "02",
    title: "Set your plan",
    description:
      "Plan how much you want to spend in each category, add recurring expenses and bills, and set aside money toward the savings goals that matter.",
  },
  {
    number: "03",
    title: "Know what you can spend",
    description:
      "Available to Spend subtracts your bills, planned expenses and savings commitments from your money. It's one clear number you can trust.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="A simple way to plan your money"
        description="Three steps between you and knowing exactly how much you can safely spend."
      />

      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Stagger className="space-y-8">
            {steps.map((step) => (
              <StaggerItem key={step.number}>
                <li className="flex gap-6 rounded-xl border border-border bg-white p-6 list-none">
                  <span className="font-brand text-3xl font-bold text-black/10">
                    {step.number}
                  </span>
                  <div>
                    <h2 className="font-brand text-xl font-semibold text-black">
                      {step.title}
                    </h2>
                    <p className="mt-2 text-muted">{step.description}</p>
                  </div>
                </li>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <Animate>
            <h2 className="font-brand text-2xl font-bold sm:text-3xl">
              Ready to see how much you can spend?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/70">
              Create a free account and build your first plan in minutes.
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
