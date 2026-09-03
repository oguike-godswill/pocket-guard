import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(100),
  email: z.string().email("Please enter a valid email").max(200),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200),
});

export const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Select a category"),
  date: z.string().min(1, "Select a date"),
  note: z.string().max(300).optional().nullable(),
});

export const incomeSourceSchema = z.object({
  name: z.string().min(2, "Please enter a name").max(120),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  frequency: z.enum(["weekly", "monthly", "yearly"]),
});

export const budgetItemSchema = z.object({
  category: z.string().min(1, "Select a category"),
  plannedAmount: z.coerce.number().min(0),
});

export const savingsGoalSchema = z.object({
  name: z.string().min(2, "Please enter a goal name").max(120),
  targetAmount: z.coerce
    .number()
    .positive("Target amount must be greater than zero"),
  currentAmount: z.coerce.number().min(0).default(0),
  targetDate: z.string().optional().nullable(),
});

export const billSchema = z.object({
  name: z.string().min(2, "Please enter a bill name").max(120),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  dueDate: z.string().min(1, "Select a due date"),
  frequency: z.enum(["weekly", "monthly", "yearly"]),
});

export const contributionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero"),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(100),
  currency: z.string().min(3).max(3),
});

export const notificationPreferencesSchema = z.object({
  emailDigest: z.boolean(),
  billReminders: z.boolean(),
  goalProgress: z.boolean(),
  weeklySummary: z.boolean(),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    message: "New password must be different from the current one",
    path: ["newPassword"],
  });
