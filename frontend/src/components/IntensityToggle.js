import React from "react";
import { INTENSITY } from "../utils/constants";

/**
 * Intensity toggle component - allows user to select fork intensity
 */
export const IntensityToggle = ({ value, onChange, disabled }) => {
  return (
    <div
      data-testid="intensity-toggle"
      className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/30 p-2"
    >
      {Object.entries(INTENSITY).map(([key, meta]) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            data-testid={`intensity-toggle-${key}`}
            onClick={() => onChange(key)}
            className={`relative rounded-xl px-3 py-2 text-left text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson/60 disabled:opacity-60
              ${
                active
                  ? "bg-crimson/20 border border-crimson/30"
                  : "bg-white/5 hover:bg-white/10"
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-100">{meta.label}</span>
              {active ? (
                <span className="h-2 w-2 rounded-full bg-crimson" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-white/10" />
              )}
            </div>
            <div className="mt-1 text-xs text-zinc-400">{meta.hint}</div>
          </button>
        );
      })}
    </div>
  );
};

IntensityToggle.displayName = "IntensityToggle";
