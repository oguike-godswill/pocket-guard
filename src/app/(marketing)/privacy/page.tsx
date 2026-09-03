import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { marketingPageMetadata } from "@/lib/seo";

export const metadata: Metadata = marketingPageMetadata({
  title: "Privacy Policy",
  description:
    "How PocketGuard handles your data. Learn what we collect, how we protect it, and your choices.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        description="Last updated: September 2026"
      />
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="space-y-8 text-muted">
            <div>
              <h2 className="font-brand text-xl font-semibold text-black">
                What we collect
              </h2>
              <p className="mt-2">
                We collect the information you provide when you create an
                account: your name, email address and password. You also enter
                financial information — income, expenses, bills and savings —
                which we store securely to power PocketGuard.
              </p>
            </div>
            <div>
              <h2 className="font-brand text-xl font-semibold text-black">
                How we protect it
              </h2>
              <p className="mt-2">
                Passwords are hashed using a modern password-hashing algorithm
                and are never stored in plain text. Sessions are protected with
                secure, HTTP-only cookies. Every read and write of your
                financial records is verified on the server so only you can
                access your own data.
              </p>
            </div>
            <div>
              <h2 className="font-brand text-xl font-semibold text-black">
                What we don't do
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>We do not connect to your bank or pull data automatically.</li>
                <li>We do not sell your personal or financial data.</li>
                <li>
                  We do not claim security certifications we haven't obtained.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-brand text-xl font-semibold text-black">
                Your data, your control
              </h2>
              <p className="mt-2">
                You can access, update or delete your account and records at any
                time from Settings. Deleting your account removes your data.
              </p>
            </div>
            <div>
              <h2 className="font-brand text-xl font-semibold text-black">
                Questions
              </h2>
              <p className="mt-2">
                If you have questions about this policy, please contact us.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
