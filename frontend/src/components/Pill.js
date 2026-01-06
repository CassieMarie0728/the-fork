import React from "react";

/**
 * Pill component - reusable badge/label component
 */
export const Pill = ({ children, className = "", testId }) => (
  <span
    data-testid={testId}
    className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide text-zinc-100 ${className}`}
  >
    {children}
  </span>
);

Pill.displayName = "Pill";
