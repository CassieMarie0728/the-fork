import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Pill } from "./Pill";
import { MessageBubble } from "./MessageBubble";
import { INTENSITY, uuidv4, truncate } from "../utils/constants";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/**
 * ChatWindow component - main chat interface
 */
export const ChatWindow = ({ forkStatement, intensity, sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const listRef = useRef(null);

  const serverMessages = useMemo(() => {
    return messages.map((m) => ({
      role: m.role === "alter" ? "assistant" : "user",
      content: m.content,
    }));
  }, [messages]);

  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const send = async () => {
    const text = draft.trim();
    if (!text || loading) return;

    setError("");
    const userMsg = {
      id: uuidv4(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/chat`, {
        forkStatement,
        intensity,
        sessionId,
        messages: [...serverMessages, { role: "user", content: text }],
      });

      const reply = res?.data?.reply;
      if (!reply) throw new Error("Empty reply");

      const alterMsg = {
        id: uuidv4(),
        role: "alter",
        content: reply,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, alterMsg]);
    } catch (e) {
      setError(
        "The other door jammed. Try again in a second (or burn it and restart)."
      );
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <section
      data-testid="chat-window"
      className="mx-auto w-full max-w-5xl px-6 pb-10"
    >
      <div className="grid gap-4">
        <div
          data-testid="chat-header"
          className="rounded-3xl border border-white/10 bg-ink/60 p-5 shadow-lg shadow-black/40"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Pill testId="chat-fork-pill" className="border-white/10">
                  Fork Summary
                </Pill>
                <Pill
                  testId="chat-intensity-badge"
                  className="border-crimson/30"
                >
                  {INTENSITY[intensity].badge}
                </Pill>
              </div>
              <div
                data-testid="chat-fork-summary"
                className="mt-1 truncate text-sm text-zinc-200"
                title={forkStatement}
              >
                {truncate(forkStatement, 110)}
              </div>
            </div>

            <div
              data-testid="chat-room-label"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100"
            >
              The Interrogation Room
            </div>
          </div>
        </div>

        <div
          data-testid="message-list-container"
          ref={listRef}
          className="h-[460px] overflow-y-auto rounded-3xl border border-white/10 bg-black/30 p-5 shadow-inner shadow-black/50"
        >
          {messages.length === 0 ? (
            <div
              data-testid="chat-empty-state"
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-300"
            >
              <div className="font-semibold text-zinc-100">
                The interrogation room is ready.
              </div>
              <div className="mt-1 text-zinc-400">
                Say something. Ask what it cost. Ask what you avoided. Don't be
                polite.
              </div>
            </div>
          ) : (
            <div data-testid="message-list" className="grid gap-4">
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  side={m.role === "user" ? "right" : "left"}
                  label={
                    m.role === "user" ? "You" : "Other You (Alternate Timeline)"
                  }
                  content={m.content}
                />
              ))}
            </div>
          )}

          {loading && (
            <div
              data-testid="typing-indicator"
              aria-live="polite"
              className="mt-4 text-sm text-zinc-400"
            >
              {INTENSITY[intensity].typing}
            </div>
          )}
        </div>

        {error && (
          <div
            data-testid="chat-error"
            className="rounded-2xl border border-crimson/30 bg-crimson/10 p-4 text-sm text-zinc-100"
          >
            {error}
          </div>
        )}

        <div
          data-testid="composer"
          className="rounded-3xl border border-white/10 bg-ink/60 p-4 shadow-lg shadow-black/40"
        >
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label
                data-testid="composer-label"
                htmlFor="composer-input"
                className="block text-xs font-medium text-zinc-400"
              >
                Your message (Enter to send, Shift+Enter for newline)
              </label>
              <textarea
                data-testid="composer-input"
                id="composer-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                rows={3}
                placeholder="Say the quiet part."
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-crimson/60"
              />
            </div>

            <button
              data-testid="composer-send-button"
              type="button"
              onClick={send}
              disabled={loading || draft.trim().length === 0}
              className="inline-flex items-center justify-center rounded-2xl bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson/60 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Say It
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

ChatWindow.displayName = "ChatWindow";
