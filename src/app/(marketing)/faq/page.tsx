"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { cn } from "@/lib/cn";
import { Animate, Stagger, StaggerItem } from "@/components/marketing/animate";

const faqs = [
  {
    q: "What is PocketGuard?",
    a: "PocketGuard is a money-planning web app. It brings your income, expenses, bills and savings into one clear plan, so you always know how much you can safely spend right now.",
  },
  {
    q: "Is PocketGuard free?",
    a: "Yes. PocketGuard is free to use. We keep our pricing simple and honest — if we add a premium plan later, existing users will be the first to know.",
  },
  {
    q: "Do I need to connect a bank account?",
    a: "No. You enter your income and expenses yourself. There's no bank connection required, and we never pull data from linked accounts.",
  },
  {
    q: "Can I track cash expenses?",
    a: "Yes. You can log any expense, cash or otherwise, with an amount, category and date.",
  },
  {
    q: "Can I create savings goals?",
    a: "Yes. Set a target amount, an optional target date, and track your progress plus suggested contribution.",
  },
  {
    q: "Can PocketGuard remind me about bills?",
    a: "PocketGuard helps you see upcoming bills so they're never a surprise. Reminder notifications are a planned future feature.",
  },
  {
    q: "How is my financial information protected?",
    a: "Your financial records are private to you. We use secure, encrypted sessions and verify ownership on every request, so only you can read or change your data.",
  },
  {
    q: "Can I use PocketGuard on mobile?",
    a: "Yes. PocketGuard is fully responsive and works well on desktop, tablet and mobile in your browser.",
  },
  {
    q: "What currencies are supported?",
    a: "PocketGuard supports 8 currencies: NGN (Naira), USD (Dollar), GBP (Pound), EUR (Euro), KES (Kenyan Shilling), GHS (Ghanaian Cedi), ZAR (South African Rand), and EGP (Egyptian Pound).",
  },
  {
    q: "Can I export my data?",
    a: "Data export is on our roadmap. For now, you can view and manage all your records directly in the app.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Everything you need to know about PocketGuard."
      />
      <section className="border-b border-border">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <Stagger className="space-y-2" staggerDelay={0.04}>
            {faqs.map((faq, i) => {
              const open = openIndex === i;
              return (
                <StaggerItem key={faq.q}>
                  <div className="overflow-hidden rounded-xl border border-border bg-white">
                    <button
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      onClick={() => setOpenIndex(open ? null : i)}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${i}`}
                    >
                      <span className="font-medium text-black">{faq.q}</span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 text-muted transition-transform duration-200",
                          open && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      id={`faq-panel-${i}`}
                      className={cn(
                        "grid transition-all duration-200",
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-4 text-sm text-muted">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
    </>
  );
}
