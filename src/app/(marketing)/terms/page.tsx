import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { marketingPageMetadata } from "@/lib/seo";

export const metadata: Metadata = marketingPageMetadata({
  title: "Terms of Service",
  description:
    "The terms and conditions for using PocketGuard's money-planning web app.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated: September 2026"
      />
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="space-y-8 text-muted">
            <div>
              <h2 className="font-brand text-xl font-semibold text-black">
                Using PocketGuard
              </h2>
              <p className="mt-2">
                By creating an account, you agree to use PocketGuard for lawful
                purposes and in accordance with these terms. You are responsible
                for keeping your login information secure.
              </p>
            </div>
            <div>
              <h2 className="font-brand text-xl font-semibold text-black">
                Your information
              </h2>
              <p className="mt-2">
                You are responsible for the accuracy of the financial
                information you enter. PocketGuard is a planning tool and is not
                a substitute for professional financial, tax or legal advice.
              </p>
            </div>
            <div>
              <h2 className="font-brand text-xl font-semibold text-black">
                No warranties
              </h2>
              <p className="mt-2">
                PocketGuard is provided "as is" without warranties of any kind.
                We strive for accuracy in our calculations, but numbers should
                be verified against your own records.
              </p>
            </div>
            <div>
              <h2 className="font-brand text-xl font-semibold text-black">
                Account termination
              </h2>
              <p className="mt-2">
                You may delete your account at any time. We may suspend or
                terminate accounts that violate these terms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
