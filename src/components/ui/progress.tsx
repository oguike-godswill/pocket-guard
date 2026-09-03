import { cn } from "@/lib/cn";

export function Progress({
  value,
  className,
  tone = "positive",
}: {
  value: number;
  className?: string;
  tone?: "positive" | "danger" | "warning" | "default";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const colors = {
    positive: "bg-positive",
    danger: "bg-danger",
    warning: "bg-warning",
    default: "bg-black",
  };
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-soft", className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500", colors[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
