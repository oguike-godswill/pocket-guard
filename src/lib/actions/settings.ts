"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  profileSchema,
  notificationPreferencesSchema,
  updatePasswordSchema,
} from "@/lib/validations";
import { CURRENCIES, type CurrencyCode } from "@/lib/money";
import { SESSION_COOKIE } from "@/lib/auth";

export async function updateProfile(input: { name: string; currency: string }) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  if (!CURRENCIES[parsed.data.currency as CurrencyCode]) {
    return { error: "Invalid currency" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name, currency: parsed.data.currency },
  });

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return { success: true };
}

export async function updatePassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = updatePasswordSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const ok = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!ok) return { error: "Current password is incorrect" };

  const hash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });
  return { success: true };
}

export async function updateNotifications(input: {
  emailDigest: boolean;
  billReminders: boolean;
  goalProgress: boolean;
  weeklySummary: boolean;
}) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = notificationPreferencesSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid input" };

  await prisma.notificationPreference.upsert({
    where: { userId: user.id },
    update: parsed.data,
    create: { userId: user.id, ...parsed.data },
  });

  revalidatePath("/settings");
  return { success: true };
}

export async function deleteAccount() {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  await prisma.user.delete({ where: { id: user.id } });
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  redirect("/");
}
