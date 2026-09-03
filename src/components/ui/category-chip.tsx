import { cn } from "@/lib/cn";

export function CategoryChip({
  name,
  active,
  onClick,
  tone = "default",
}: {
  name: string;
  active?: boolean;
  onClick?: () => void;
  tone?: "default" | "positive" | "danger";
}) {
  const toneColors = {
    default: active
      ? "bg-black text-white border-black"
      : "bg-soft text-black border-border hover:bg-neutral-100",
    positive:
      "bg-positive-soft text-positive border-positive/30 hover:bg-green-100",
    danger:
      "bg-danger-soft text-danger border-danger/30 hover:bg-red-100",
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
          toneColors[tone]
        )}
      >
        {name}
      </button>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        toneColors[tone]
      )}
    >
      {name}
    </span>
  );
}
