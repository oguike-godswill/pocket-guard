export const CURRENCIES = {
  NGN: { symbol: "₦", code: "NGN", name: "Nigerian Naira" },
  USD: { symbol: "$", code: "USD", name: "US Dollar" },
  GBP: { symbol: "£", code: "GBP", name: "British Pound" },
  EUR: { symbol: "€", code: "EUR", name: "Euro" },
  KES: { symbol: "KSh", code: "KES", name: "Kenyan Shilling" },
  GHS: { symbol: "GH₵", code: "GHS", name: "Ghanaian Cedi" },
  ZAR: { symbol: "R", code: "ZAR", name: "South African Rand" },
  EGP: { symbol: "E£", code: "EGP", name: "Egyptian Pound" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export function formatMoney(
  amount: number | bigint | string | { toNumber: () => number },
  currencyCode: string = "NGN"
): string {
  const config = CURRENCIES[currencyCode as CurrencyCode] ?? CURRENCIES.NGN;
  const numeric =
    typeof amount === "bigint"
      ? Number(amount)
      : typeof amount === "object"
        ? Number(amount.toNumber())
        : Number(amount);

  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numeric);

  return formatted;
}

export function formatMoneyCompact(
  amount: number,
  currencyCode: string = "NGN"
): string {
  const config = CURRENCIES[currencyCode as CurrencyCode] ?? CURRENCIES.NGN;
  const abs = Math.abs(amount);
  let value = amount;
  let suffix = "";

  if (abs >= 1_000_000) {
    value = amount / 1_000_000;
    suffix = "M";
  } else if (abs >= 1_000) {
    value = amount / 1_000;
    suffix = "k";
  }

  const digits = value % 1 === 0 ? 0 : 1;
  return `${config.symbol}${value.toFixed(digits)}${suffix}`;
}

export function parseCurrencyInput(value: string): number | null {
  const cleaned = value.replace(/[^\d.-]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return null;
  const num = Number(cleaned);
  if (Number.isNaN(num)) return null;
  return num;
}
