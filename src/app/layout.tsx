import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pocketguard.app";

const metadataBase = new URL(siteUrl);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "PocketGuard — Plan your money. Spend with confidence.",
    template: "%s | PocketGuard",
  },
  description:
    "Bring income, expenses, bills and savings into one clear plan. Know exactly how much you can safely spend right now with Available to Spend.",
  openGraph: {
    type: "website",
    siteName: "PocketGuard",
    title: "PocketGuard — Plan your money. Spend with confidence.",
    description:
      "Bring income, expenses, bills and savings into one clear plan. Know exactly how much you can safely spend right now.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "PocketGuard — Plan your money. Spend with confidence.",
    description:
      "Bring income, expenses, bills and savings into one clear plan.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
