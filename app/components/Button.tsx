import { ButtonHTMLAttributes } from "react";
import { cn } from "@/app/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "warning";
  size?: "sm" | "md";
}

const variantStyles = {
  primary: "border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20",
  outline: "border border-gray-200 hover:bg-gray-50 text-gray-700",
  ghost: "hover:bg-gray-100 text-gray-600",
  warning: "border border-red-600 bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-500/20",
};

const sizeStyles = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn("rounded-lg disabled:opacity-40 transition-all duration-200 active:scale-[0.98]", variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
