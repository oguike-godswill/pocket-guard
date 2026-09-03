import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({
  href = "/",
  className,
  showWordmark = true,
}: {
  href?: string;
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2", className)}
      aria-label="PocketGuard home"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 6v-2" />
          <path d="M12 20v-2" />
          <path d="M8 7.5a4 4 0 0 1 4-3.5 4 4 0 0 1 4 3.5c0 2-1.5 3-4 3.5-3 .5-4 1.5-4 3.5A4 4 0 0 0 12 17.5 4 4 0 0 0 16 14" />
          <rect x="2" y="9" width="20" height="12" rx="2" />
        </svg>
      </span>
      {showWordmark && (
        <span className="font-brand text-lg font-bold tracking-tight text-black">
          PocketGuard
        </span>
      )}
    </Link>
  );
}
