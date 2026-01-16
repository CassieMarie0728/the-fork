import React from "react";

/**
 * MessageBubble component - individual chat message display
 */
// This component is memoized with React.memo to prevent unnecessary re-renders
// of every message in the chat history whenever a new message is added or the
// user's input changes. This provides a significant performance boost, especially
// in long conversations.
export const MessageBubble = React.memo(({ side, label, content }) => {
  const isUser = side === "right";
  return (
    <div
      data-testid={`message-row-${isUser ? "user" : "alter"}`}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[85%] sm:max-w-[70%] ${isUser ? "" : ""}`}>
        <div
          className={`mb-1 flex items-center gap-2 ${
            isUser ? "justify-end" : ""
          }`}
        >
          {!isUser && (
            <span
              data-testid="alter-avatar"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-crimson/30 bg-crimson/20 text-xs font-semibold text-zinc-100"
            >
              OY
            </span>
          )}
          <span
            data-testid={`message-label-${isUser ? "you" : "other-you"}`}
            className="text-xs text-zinc-400"
          >
            {label}
          </span>
          {isUser && (
            <span
              data-testid="user-avatar"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-zinc-100"
            >
              Y
            </span>
          )}
        </div>
        <div
          data-testid={`message-bubble-${isUser ? "user" : "alter"}`}
          className={`rounded-3xl px-4 py-3 text-base leading-relaxed shadow-lg shadow-black/30 ${
            isUser
              ? "bg-zinc-100 text-zinc-900"
              : "alter-texture border border-white/10 bg-ink/70 text-zinc-100"
          }`}
        >
          <pre className="whitespace-pre-wrap font-sans">{content}</pre>
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";
