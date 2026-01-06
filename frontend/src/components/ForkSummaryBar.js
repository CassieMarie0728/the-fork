import React from "react";
import { Pill } from "./Pill";
import { INTENSITY, truncate } from "../utils/constants";

/**
 * ForkSummaryBar component - sticky summary shown after fork starts
 */
export const ForkSummaryBar = ({ forkStatement, intensity, onReset }) => {
  return (
    <div
      data-testid="fork-summary-bar"
      className="sticky top-0 z-30 border-b border-white/10 bg-black/60 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Pill testId="fork-summary-pill" className="border-white/10">
              Fork Summary
            </Pill>
            <Pill testId="fork-intensity-pill" className="border-crimson/30">
              {INTENSITY[intensity].badge}
            </Pill>
          </div>
          <div
            data-testid="fork-summary-text"
            className="mt-1 truncate text-sm text-zinc-200"
            title={forkStatement}
          >
            {truncate(forkStatement, 90)}
          </div>
        </div>

        <button
          data-testid="burn-timeline-button"
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 transition-colors duration-200 hover:bg-white/10"
        >
          Burn This Timeline & Start Over
        </button>
      </div>
    </div>
  );
};

ForkSummaryBar.displayName = "ForkSummaryBar";
