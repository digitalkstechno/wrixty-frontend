import React from "react";
import { Loader } from "./Loader";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
  isLoading?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  isLoading = false,
  className = "",
  id,
  disabled,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  const isDisabled = disabled || isLoading;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          className={`
            w-full px-3.5 py-2 text-sm bg-white dark:bg-zinc-950
            border border-zinc-200 dark:border-zinc-800
            text-zinc-900 dark:text-zinc-100
            rounded-md transition-all duration-200 outline-none
            focus:border-indigo-500 dark:focus:border-indigo-500
            focus:ring-1 focus:ring-indigo-500/30
            disabled:bg-zinc-50 disabled:dark:bg-zinc-900 disabled:text-zinc-500
            appearance-none cursor-pointer
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
            ${isLoading ? "pr-10 cursor-not-allowed" : ""}
            ${className}
          `}
          disabled={isDisabled}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5">
          {isLoading ? (
            <Loader size="sm" className="text-indigo-500" />
          ) : (
            <svg className="fill-current h-4 w-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          )}
        </div>
      </div>
      {error && (
        <span className="text-xs font-medium text-red-500">{error}</span>
      )}
      {!error && helperText && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{helperText}</span>
      )}
    </div>
  );
};
