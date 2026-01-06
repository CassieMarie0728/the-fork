import React, { useRef, useState } from "react";
import { ForkSetup } from "../components/ForkSetup";
import { ForkSummaryBar } from "../components/ForkSummaryBar";
import { ChatWindow } from "../components/ChatWindow";
import { ResetModal } from "../components/ResetModal";
import { useSessionId, useSessionIdReset } from "../hooks/useSessionId";

/**
 * Home page component - main view with all sections
 */
function Home() {
  const [forkStatement, setForkStatement] = useState("");
  const [intensity, setIntensity] = useState("mild");
  const [started, setStarted] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const sessionId = useSessionId();
  const resetSessionId = useSessionIdReset();

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
    // Generate new session
    resetSessionId();
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

export default Home;
