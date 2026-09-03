export const EXPENSE_CATEGORIES = [
  { name: "Housing", kind: "expense" as const },
  { name: "Food", kind: "expense" as const },
  { name: "Transport", kind: "expense" as const },
  { name: "Bills", kind: "expense" as const },
  { name: "Health", kind: "expense" as const },
  { name: "Education", kind: "expense" as const },
  { name: "Entertainment", kind: "expense" as const },
  { name: "Shopping", kind: "expense" as const },
  { name: "Subscriptions", kind: "expense" as const },
  { name: "Family", kind: "expense" as const },
  { name: "Debt", kind: "expense" as const },
  { name: "Other", kind: "expense" as const },
];

export const INCOME_CATEGORIES = [
  "Salary",
  "Business",
  "Freelance",
  "Investments",
  "Gifts",
  "Other",
];

export const ALL_CATEGORIES = [
  ...EXPENSE_CATEGORIES.map((c) => c.name),
  ...INCOME_CATEGORIES,
];

export const FREQUENCIES = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
] as const;
