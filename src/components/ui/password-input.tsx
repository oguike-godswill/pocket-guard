"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

export interface PasswordInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "className"
  > {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    const [visible, setVisible] = useState(false);

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-black"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            className={cn(
              "h-10 w-full rounded-lg border bg-white px-3 pr-10 text-sm text-black placeholder:text-muted transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-black disabled:opacity-50",
              error ? "border-danger" : "border-border",
              className
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted transition-colors hover:text-black"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            tabIndex={-1}
          >
            {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-danger"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
