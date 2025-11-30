// src/components/ui/badge.tsx

import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

export const Badge: React.FC<BadgeProps> = ({ className = "", children, ...props }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-white/10 text-gray-200 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
