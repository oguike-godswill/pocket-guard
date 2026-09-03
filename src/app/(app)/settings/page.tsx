import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SettingsClient } from "@/components/settings/settings-client";

export const metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const prefs = user.notificationPreference;

  return (
    <SettingsClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        createdAt: user.createdAt.toISOString(),
      }}
      prefs={
        prefs
          ? {
              emailDigest: prefs.emailDigest,
              billReminders: prefs.billReminders,
              goalProgress: prefs.goalProgress,
              weeklySummary: prefs.weeklySummary,
            }
          : null
      }
    />
  );
}
