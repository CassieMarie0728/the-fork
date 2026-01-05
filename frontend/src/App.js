import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const INTENSITY = {
  mild: {
    label: "Mild",
    hint: "Supportive. Honest. Still has a pulse.",
    badge: "MILD",
    typing: "Other You is choosing their words…",
  },
  savage: {
    label: "Savage",
    hint: "Truthful. Biting. Calls you out.",
    badge: "SAVAGE",
    typing: "Other You is loading ammunition…",
  },
  brutal: {
    label: "Brutal",
    hint: "No comfort. No flinching. Still not abusive.",
    badge: "BRUTAL",
    typing: "Other You is sharpening the knife…",
  },
};

function uuidv4() {
  // lightweight UUID; good enough for ephemeral sessions
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function truncate(text, max = 64) {
  const t = (text || "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

const Pill = ({ children, className = "", testId }) => (
  <span
    data-testid={testId}
    className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide text-zinc-100 ${className}`}
  >
    {children}
  </span>
);

const IntensityToggle = ({ value, onChange, disabled }) => {
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
            className={`relative rounded-xl px-3 py-2 text-left text-sm transition-colors duration-200 disabled:opacity-60
              ${active ? "bg-crimson/20 border border-crimson/30" : "bg-white/5 hover:bg-white/10"}`}
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

const ForkSetup = ({
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
                    Tell me the decision that split your life in half — and the path you didn’t take. Don’t bullshit yourself.
                  </label>
                  <textarea
                    data-testid="fork-statement-input"
                    value={forkStatement}
                    onChange={(e) => setForkStatement(e.target.value)}
                    placeholder={`“I joined the Navy instead of staying home to start a family.”\n“I chose law school instead of art.”\n“I left my hometown instead of marrying my high school love.”`}
                    rows={4}
                    className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-500 shadow-inner shadow-black/40 focus:outline-none focus:ring-2 focus:ring-crimson/60"
                  />
                  <div
                    data-testid="fork-statement-required"
                    className="mt-2 text-xs text-zinc-400"
                  >
                    Required. Be specific. Don’t hide behind vague.
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
                    You can’t unsee what the other-you says. Fair warning.
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

const ForkSummaryBar = ({ forkStatement, intensity, onReset }) => {
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

const MessageBubble = ({ side, label, content }) => {
  const isUser = side === "right";
  return (
    <div
      data-testid={`message-row-${isUser ? "user" : "alter"}`}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[85%] sm:max-w-[70%] ${isUser ? "" : ""}`}>
        <div className={`mb-1 flex items-center gap-2 ${isUser ? "justify-end" : ""}`}>
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
};

const ResetModal = ({ open, onCancel, onConfirm }) => {
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

const ChatWindow = ({ forkStatement, intensity, sessionId }) => {
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
        "The other door jammed. Try again in a second (or burn it and restart).",
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
                <Pill testId="chat-intensity-badge" className="border-crimson/30">
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
              <div className="font-semibold text-zinc-100">The interrogation room is ready.</div>
              <div className="mt-1 text-zinc-400">
                Say something. Ask what it cost. Ask what you avoided. Don’t be polite.
              </div>
            </div>
          ) : (
            <div data-testid="message-list" className="grid gap-4">
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  side={m.role === "user" ? "right" : "left"}
                  label={m.role === "user" ? "You" : "Other You (Alternate Timeline)"}
                  content={m.content}
                />
              ))}
            </div>
          )}

          {loading && (
            <div data-testid="typing-indicator" className="mt-4 text-sm text-zinc-400">
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
                className="block text-xs font-medium text-zinc-400"
              >
                Your message (Enter to send, Shift+Enter for newline)
              </label>
              <textarea
                data-testid="composer-input"
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
              className="inline-flex items-center justify-center rounded-2xl bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Say It
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

function Home() {
  const [forkStatement, setForkStatement] = useState("");
  const [intensity, setIntensity] = useState("mild");
  const [started, setStarted] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const sessionId = useMemo(() => {
    const existing = window.localStorage.getItem("fork.sessionId");
    if (existing) return existing;
    const id = uuidv4();
    window.localStorage.setItem("fork.sessionId", id);
    return id;
  }, []);

  const chatAnchorRef = useRef(null);

  const start = () => {
    setStarted(true);
    // Scroll into chat after paint
    setTimeout(() => {
      chatAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const resetAll = () => {
    setShowReset(false);
    setStarted(false);
    setForkStatement("");
    setIntensity("mild");
    // new session
    const id = uuidv4();
    window.localStorage.setItem("fork.sessionId", id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div data-testid="app-root" className="min-h-screen bg-black text-zinc-100">
      <div className="bg-hero">
        {!started && (
          <ForkSetup
            forkStatement={forkStatement}
            setForkStatement={setForkStatement}
            intensity={intensity}
            setIntensity={setIntensity}
            onStart={start}
            started={started}
          />
        )}

        {started && (
          <ForkSummaryBar
            forkStatement={forkStatement}
            intensity={intensity}
            onReset={() => setShowReset(true)}
          />
        )}

        <div
          data-testid="chat-anchor"
          ref={chatAnchorRef}
          style={{ scrollMarginTop: 96 }}
        />

        {started && (
          <ChatWindow
            forkStatement={forkStatement}
            intensity={intensity}
            sessionId={window.localStorage.getItem("fork.sessionId") || sessionId}
          />
        )}

        <ResetModal
          open={showReset}
          onCancel={() => setShowReset(false)}
          onConfirm={resetAll}
        />
      </div>

      <footer
        data-testid="footer"
        className="mx-auto max-w-5xl px-6 pb-10 text-xs text-zinc-500"
      >
        Built for the present moment. No accounts. No saving. Just you vs you.
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
