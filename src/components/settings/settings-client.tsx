"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Shield, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/modal";
import { CURRENCIES } from "@/lib/money";
import {
  updateProfile,
  updatePassword,
  updateNotifications,
  deleteAccount,
} from "@/lib/actions/settings";

type NotifPrefs = {
  emailDigest: boolean;
  billReminders: boolean;
  goalProgress: boolean;
  weeklySummary: boolean;
};

const NOTIF_GROUPS: {
  key: keyof NotifPrefs;
  label: string;
  description: string;
}[] = [
  { key: "emailDigest", label: "Email digest", description: "Periodic summary of your balance and recent activity." },
  { key: "billReminders", label: "Bill reminders", description: "Get a heads-up before a bill is due." },
  { key: "goalProgress", label: "Goal progress", description: "Updates when you're close to (or reach) a savings goal." },
  { key: "weeklySummary", label: "Weekly summary", description: "A short weekly recap of how your money moved." },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-black" : "bg-neutral-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[1.375rem]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function SettingsClient({
  user,
  prefs,
}: {
  user: { id: string; name: string; email: string; currency: string; createdAt: string };
  prefs: NotifPrefs | null;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [currency, setCurrency] = useState(user.currency);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [notifs, setNotifs] = useState<NotifPrefs>({
    emailDigest: prefs?.emailDigest ?? true,
    billReminders: prefs?.billReminders ?? true,
    goalProgress: prefs?.goalProgress ?? true,
    weeklySummary: prefs?.weeklySummary ?? false,
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingNotifs, setSavingNotifs] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    const result = await updateProfile({ name, currency });
    setSavingProfile(false);
    if (result.success) {
      toast("success", "Profile updated");
      router.refresh();
    } else if (result.error === "Not authenticated") {
      router.push("/login");
    } else {
      toast("error", result.error ?? "Could not update profile");
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setSavingPassword(true);
    const result = await updatePassword({ currentPassword, newPassword });
    setSavingPassword(false);
    if (result.success) {
      toast("success", "Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } else if (result.error === "Not authenticated") {
      router.push("/login");
    } else {
      toast("error", result.error ?? "Could not update password");
    }
  }

  async function handleNotifs() {
    setSavingNotifs(true);
    const result = await updateNotifications(notifs);
    setSavingNotifs(false);
    if (result.success) {
      toast("success", "Notification preferences saved");
    } else if (result.error === "Not authenticated") {
      router.push("/login");
    } else {
      toast("error", result.error ?? "Could not save preferences");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteAccount();
    setDeleting(false);
    if (result && result.error) {
      toast("error", result.error);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-brand text-2xl font-bold text-black">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your profile, preferences and account.
        </p>
      </div>

      {/* Profile */}
      <Card>
        <h2 className="mb-1 font-brand text-lg font-semibold text-black">Profile</h2>
        <p className="mb-4 text-sm text-muted">
          Your name and preferred currency used across PocketGuard.
        </p>
        <form onSubmit={handleProfile} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-medium text-black">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Select
                label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Signed in as {user.email}</p>
            <Button type="submit" loading={savingProfile}>
              <Save className="h-4 w-4" /> Save profile
            </Button>
          </div>
        </form>
      </Card>

      {/* Notifications */}
      <Card>
        <h2 className="mb-1 font-brand text-lg font-semibold text-black">
          Notifications
        </h2>
        <p className="mb-4 text-sm text-muted">
          Choose what you'd like to hear about (currently not actively sent).
        </p>
        <ul className="divide-y divide-border">
          {NOTIF_GROUPS.map((g) => (
            <li
              key={g.key}
              className="flex items-center justify-between gap-4 py-3.5"
            >
              <div>
                <p className="text-sm font-medium text-black">{g.label}</p>
                <p className="text-sm text-muted">{g.description}</p>
              </div>
              <Toggle
                checked={notifs[g.key]}
                onChange={(v) => setNotifs((prev) => ({ ...prev, [g.key]: v }))}
                label={g.label}
              />
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={handleNotifs} loading={savingNotifs}>
            <Save className="h-4 w-4" /> Save preferences
          </Button>
        </div>
      </Card>

      {/* Password */}
      <Card>
        <h2 className="mb-1 font-brand text-lg font-semibold text-black">
          Change password
        </h2>
        <p className="mb-4 text-sm text-muted">
          Make sure your account uses a strong, unique password.
        </p>
        <form onSubmit={handlePassword} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-black"
              >
                Current password
              </label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-black"
              >
                New password
              </label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={savingPassword}>
              <Shield className="h-4 w-4" /> Update password
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger zone */}
      <Card>
        <h2 className="mb-1 font-brand text-lg font-semibold text-danger">
          Danger zone
        </h2>
        <p className="mb-4 text-sm text-muted">
          Permanently delete your account and all of your data. This cannot be undone.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="secondary"
            onClick={async () => {
              const res = await fetch("/api/auth/logout", { method: "POST" });
              router.push("/");
              router.refresh();
            }}
          >
            <LogOut className="h-4 w-4" /> Log out
          </Button>
          <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4" /> Delete account
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete account?"
        message="This will permanently delete your account and all transactions, plans, goals and bills. This action cannot be undone."
        confirmLabel="Delete forever"
      />
    </div>
  );
}
