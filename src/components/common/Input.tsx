import React from "react";
import { Loader } from "./Loader";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isLoading?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  isLoading = false,
  className = "",
  id,
  type = "text",
  disabled,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const isDisabled = disabled || isLoading;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={inputId}
          type={type}
          className={`
            w-full px-3.5 py-2 text-sm bg-[var(--background)]
            border border-[var(--border)]
            text-[var(--foreground)]
            rounded-md transition-all duration-200 outline-none
            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
            placeholder:text-zinc-400 dark:placeholder:text-zinc-600
            disabled:bg-zinc-50 disabled:dark:bg-zinc-900 disabled:text-zinc-500
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
            ${isLoading ? "pr-10" : ""}
            ${className}
          `}
          disabled={isDisabled}
          {...props}
        />
        {isLoading && (
          <div className="absolute right-3 text-indigo-500">
            <Loader size="sm" />
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs font-medium text-red-500">{error}</span>
      )}
      {!error && helperText && (
        <span className="text-xs text-[var(--muted)]">{helperText}</span>
      )}
    </div>
  );
};
