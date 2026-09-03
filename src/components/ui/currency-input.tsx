"use client";

import { forwardRef, useId, useRef } from "react";
import { CURRENCIES, type CurrencyCode } from "@/lib/money";
import { cn } from "@/lib/cn";

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  currencyCode?: string;
  onValueChange?: (value: string) => void;
  value?: string | number | readonly string[] | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    { label, error, currencyCode = "NGN", onValueChange, className, id, ...props },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? props.name ?? generatedId;
    const symbol =
      CURRENCIES[currencyCode as CurrencyCode]?.symbol ?? "₦";

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-black">
            {label}
          </label>
        )}
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted tabular">
            {symbol}
          </span>
          <input
            ref={ref}
            id={inputId}
            inputMode="decimal"
            className={cn(
              "h-10 w-full rounded-lg border border-border bg-white pl-8 pr-3 text-sm text-black tabular transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-black disabled:opacity-50",
              error && "border-danger",
              className
            )}
            aria-invalid={error ? true : undefined}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";
