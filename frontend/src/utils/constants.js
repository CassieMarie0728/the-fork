/**
 * Intensity configurations for The Fork
 */
export const INTENSITY = {
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

/**
 * Generate a lightweight UUID v4
 */
export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncate(text, max = 64) {
  const t = (text || "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}
