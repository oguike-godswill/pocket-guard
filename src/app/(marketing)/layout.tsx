import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { verifySession } from "@/lib/auth";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  return (
    <>
      <MarketingNav isAuthenticated={Boolean(session)} />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </>
  );
}
