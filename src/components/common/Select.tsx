import React, { useId } from "react";
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
  const generatedId = useId();
  const selectId = id || generatedId;
  const isDisabled = disabled || isLoading;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-text-secondary uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          className={`
            w-full px-4 py-2.5 text-sm bg-card-bg
            border border-border-ui
            text-text-primary
            rounded-2xl transition-all duration-200 outline-none
            focus:border-primary-teal
            focus:ring-1 focus:ring-primary-teal/30
            disabled:bg-background disabled:text-text-secondary
            appearance-none cursor-pointer
            ${error ? "border-error focus:border-error focus:ring-error/20" : ""}
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
            <Loader size="sm" className="text-primary-teal" />
          ) : (
            <svg className="fill-current h-4 w-4 text-text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          )}
        </div>
      </div>
      {error && (
        <span className="text-xs font-medium text-error">{error}</span>
      )}
      {!error && helperText && (
        <span className="text-xs text-text-secondary">{helperText}</span>
      )}
    </div>
  );
};
