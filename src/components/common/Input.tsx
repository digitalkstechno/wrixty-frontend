import React, { useId, useState } from "react";
import { Loader } from "./Loader";
import { FiEye, FiEyeOff } from "react-icons/fi";

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
  const generatedId = useId();
  const inputId = id || generatedId;
  const isDisabled = disabled || isLoading;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

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
          type={actualType}
          className={`
            w-full px-4 py-2.5 text-sm bg-card-bg
            border border-border-ui
            text-text-primary
            rounded-lg transition-all duration-200 outline-none
            focus:border-primary-teal focus:ring-1 focus:ring-primary-teal/30
            placeholder:text-text-secondary/50
            disabled:bg-background disabled:text-text-secondary
            ${error ? "border-error focus:border-error focus:ring-error/20" : ""}
            ${isLoading || isPassword ? "pr-10" : ""}
            ${className}
          `}
          disabled={isDisabled}
          {...props}
        />
        {isLoading && (
          <div className="absolute right-3 text-primary-teal">
            <Loader size="sm" />
          </div>
        )}
        {!isLoading && isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-text-secondary hover:text-primary-teal cursor-pointer focus:outline-none"
            style={{ background: 'none', border: 'none' }}
          >
            {showPassword ? <FiEyeOff className="w-4.5 h-4.5" /> : <FiEye className="w-4.5 h-4.5" />}
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs font-medium text-error">{error}</span>
      )}
      {!error && helperText && (
        <span className="text-xs text-[var(--muted)]">{helperText}</span>
      )}
    </div>
  );
};
