import React from "react";

/**
 * ResetModal component - confirmation dialog for resetting the timeline
 */
export const ResetModal = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;
  return (
    <div
      data-testid="reset-modal"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-6"
    >
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-ink/90 p-6 shadow-2xl shadow-black/60">
        <h2
          data-testid="reset-modal-title"
          className="text-xl font-semibold text-zinc-50"
        >
          Burn it?
        </h2>
        <p data-testid="reset-modal-body" className="mt-2 text-sm text-zinc-300">
          This wipes the fork statement and the conversation. No history. No mercy. No undo.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            data-testid="reset-modal-cancel"
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 transition-colors duration-200 hover:bg-white/10"
          >
            Keep This Timeline
          </button>
          <button
            data-testid="reset-modal-confirm"
            type="button"
            onClick={onConfirm}
            className="rounded-2xl bg-crimson px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-crimson/90"
          >
            Burn This Timeline
          </button>
        </div>
      </div>
    </div>
  );
};

ResetModal.displayName = "ResetModal";
