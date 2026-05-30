import React from "react";
import { Loader } from "./Loader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "success" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-bold rounded transition-all outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-zinc-950";
  
  const sizeClasses = {
    sm: "py-1.5 px-3 text-xs",
    md: "py-2 px-4 text-xs tracking-wider uppercase",
    lg: "py-2.5 px-5 text-sm uppercase tracking-widest",
  };

  const variantClasses = {
    primary: "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white focus:ring-indigo-500 shadow-sm",
    secondary: "bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white focus:ring-zinc-500",
    danger: "bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500",
    outline: "bg-transparent border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 focus:ring-zinc-500",
    ghost: "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:ring-zinc-500",
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-70 cursor-not-allowed pointer-events-none" : ""}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && <Loader size="sm" className="mr-2" />}
      {children}
    </button>
  );
};
