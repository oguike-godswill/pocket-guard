import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white p-5",
        className
      )}
      {...props}
    />
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "positive" | "danger" | "warning";
  className?: string;
}) {
  const toneColor = {
    default: "text-black",
    positive: "text-positive",
    danger: "text-danger",
    warning: "text-warning",
  }[tone];

  return (
    <Card className={cn("flex flex-col gap-1", className)}>
      <span className="text-sm text-muted">{label}</span>
      <span className={cn("font-brand text-2xl font-semibold tabular", toneColor)}>
        {value}
      </span>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </Card>
  );
}
