import { useEffect, useMemo } from "react";
import { uuidv4 } from "../utils/constants";

/**
 * Hook to manage session ID in localStorage
 */
export const useSessionId = () => {
  const sessionId = useMemo(() => {
    const existing = window.localStorage.getItem("fork.sessionId");
    if (existing) return existing;
    const id = uuidv4();
    window.localStorage.setItem("fork.sessionId", id);
    return id;
  }, []);

  return sessionId;
};

/**
 * Hook to set session ID (for reset)
 */
export const useSessionIdReset = () => {
  return () => {
    const id = uuidv4();
    window.localStorage.setItem("fork.sessionId", id);
    return id;
  };
};
