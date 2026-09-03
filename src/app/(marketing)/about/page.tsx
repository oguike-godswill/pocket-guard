import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { marketingPageMetadata } from "@/lib/seo";

export const metadata: Metadata = marketingPageMetadata({
  title: "About",
  description:
    "PocketGuard is built around one question: how much can I safely spend right now? Learn about the product and philosophy.",
  path: "/about",
});

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

          <div className="mt-12 flex justify-center">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-black px-8 text-base font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Start planning <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
