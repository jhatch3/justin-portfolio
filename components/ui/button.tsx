// src/components/ui/button.tsx

import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
};

export const Button: React.FC<ButtonProps> = ({
  variant = "solid",
  className = "",
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-[#0a0a0a]";
  const variants = {
    solid:
      "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white",
    outline:
      "border border-white/20 bg-white/5 hover:bg-white/10 text-white",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
