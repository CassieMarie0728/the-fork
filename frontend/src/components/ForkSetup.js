import React from "react";
import { Pill } from "./Pill";
import { IntensityToggle } from "./IntensityToggle";
import { INTENSITY } from "../utils/constants";

/**
 * ForkSetup component - initial screen where user enters fork statement and selects intensity
 */
export const ForkSetup = ({
  forkStatement,
  setForkStatement,
  intensity,
  setIntensity,
  onStart,
  started,
}) => {
  const canStart = forkStatement.trim().length > 0;

  return (
    <section
      data-testid="fork-setup"
      className={`mx-auto w-full max-w-4xl px-6 pt-10 ${
        started ? "pb-4" : "pb-10"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-3xl border border-white/10 bg-ink/70 p-6 shadow-xl shadow-black/40 backdrop-blur-md ${
          started ? "fork-collapsed" : "fork-open"
        }`}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="noise" />
        </div>

        <div className="relative">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1
                data-testid="app-title"
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-50"
              >
                The Fork
              </h1>
              <p
                data-testid="app-tagline"
                className="mt-2 max-w-2xl text-base md:text-lg text-zinc-300"
              >
                One decision. One alternate you. No refunds. No bullshit.
              </p>
            </div>
            <Pill testId="confessional-pill" className="self-start sm:self-auto">
              Confessional booth
            </Pill>
          </div>

          {!started && (
            <>
              <div className="mt-8 grid gap-6">
                <div>
                  <label
                    data-testid="fork-prompt-label"
                    className="block text-sm font-medium text-zinc-200"
                  >
                    Tell me the decision that split your life in half — and the path you didn't take. Don't bullshit yourself.
                  </label>
                  <textarea
                    data-testid="fork-statement-input"
                    value={forkStatement}
                    onChange={(e) => setForkStatement(e.target.value)}
                    placeholder={`"I joined the Navy instead of staying home to start a family."\n"I chose law school instead of art."\n"I left my hometown instead of marrying my high school love."`}
                    rows={4}
                    className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-500 shadow-inner shadow-black/40 focus:outline-none focus:ring-2 focus:ring-crimson/60"
                  />
                  <div
                    data-testid="fork-statement-required"
                    className="mt-2 text-xs text-zinc-400"
                  >
                    Required. Be specific. Don't hide behind vague.
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      data-testid="intensity-label"
                      className="text-sm font-medium text-zinc-200"
                    >
                      Intensity
                    </label>
                    <Pill testId="intensity-selected-pill" className="border-crimson/30">
                      {INTENSITY[intensity].badge}
                    </Pill>
                  </div>
                  <IntensityToggle
                    value={intensity}
                    onChange={setIntensity}
                    disabled={false}
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    data-testid="open-other-door-button"
                    type="button"
                    disabled={!canStart}
                    onClick={onStart}
                    className="group inline-flex items-center justify-center rounded-2xl bg-crimson px-5 py-3 text-base font-semibold text-white shadow-lg shadow-crimson/20 transition-colors duration-200 hover:bg-crimson/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="mr-2">Open the Other Door</span>
                    <span className="arrow transition-colors duration-200">→</span>
                  </button>

                  <div
                    data-testid="setup-subtext"
                    className="text-xs text-zinc-400"
                  >
                    You can't unsee what the other-you says. Fair warning.
                  </div>
                </div>
              </div>
            </>
          )}

          {started && (
            <div
              data-testid="setup-collapsed-note"
              className="mt-5 text-sm text-zinc-300"
            >
              Setup collapsed. Scroll down. The other door is open.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

ForkSetup.displayName = "ForkSetup";
