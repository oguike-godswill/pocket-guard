import { cn } from "@/lib/cn";

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "positive" | "danger" | "warning";
}) {
  const tones = {
    neutral: "bg-soft text-black border border-border",
    positive: "bg-positive-soft text-positive border border-positive/20",
    danger: "bg-danger-soft text-danger border border-danger/20",
    warning: "bg-warning-soft text-warning border border-warning/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
