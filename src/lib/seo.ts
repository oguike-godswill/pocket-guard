import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pocketguard.app";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path === "/" ? "" : path}`;
}

export function marketingPageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      type: "website",
      siteName: "PocketGuard",
      title,
      description,
      url: absoluteUrl(path),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
