"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { currentPeriod, periodKey } from "@/lib/calculations";

export function MonthNav({
  year,
  month,
  basePath,
}: {
  year: number;
  month: number;
  basePath: string;
}) {
  const now = currentPeriod();
  const isCurrent = periodKey(year, month) === now;

  const prev = new Date(year, month - 2, 1);
  const next = new Date(year, month, 1);
  const prevKey = periodKey(prev.getFullYear(), prev.getMonth() + 1);
  const nextKey = periodKey(next.getFullYear(), next.getMonth() + 1);

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`${basePath}?period=${prevKey}`}
        className="rounded-md p-1.5 text-muted hover:bg-soft hover:text-black"
        aria-label="Previous month"
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
      <span className="min-w-[8rem] text-center text-sm font-medium text-black">
        {new Date(year, month - 1, 1).toLocaleDateString("en-NG", {
          month: "long",
          year: "numeric",
        })}
        {isCurrent && (
          <span className="ml-1.5 text-xs text-muted">(current)</span>
        )}
      </span>
      <Link
        href={`${basePath}?period=${nextKey}`}
        className="rounded-md p-1.5 text-muted hover:bg-soft hover:text-black"
        aria-label="Next month"
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
