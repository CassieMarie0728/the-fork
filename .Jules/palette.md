## 2024-05-14 - [Accessibility Gaps in Interactive Elements]
**Learning:** This application had several interactive elements (textareas, buttons, modals) that lacked standard accessibility features like associated labels, ARIA roles, and keyboard focus indicators.
**Action:** Always verify that input elements have `id` attributes matching their `<label htmlFor="...">` and that modals support the `Escape` key for closure. Use `focus-visible` for focus rings to ensure keyboard users have visual feedback without affecting mouse users' experience.

## 2024-05-15 - [ARIA Radio Groups for Custom Toggles]
**Learning:** Custom selection groups (e.g., intensity toggles) must implement `role="radiogroup"` and `role="radio"` with the `aria-checked` attribute to be correctly interpreted by screen readers as a single choice among multiple options.
**Action:** When creating custom toggle groups that act like radio buttons, use `role="radiogroup"` on the container and `role="radio"` on the items, ensuring they are linked to a label via `aria-labelledby`.

## 2024-05-15 - [Hiding Redundant Text-based Avatars]
**Learning:** Text-based avatars (e.g., single-letter initials) that appear next to a name can be redundant and noisy for screen readers, leading to confusing announcements like "O Y Other You".
**Action:** Apply `aria-hidden="true"` to decorative or redundant text-based icons to prevent screen reader noise when the same information is already conveyed by adjacent text.

## 2024-05-16 - [Comprehensive Modal UX & Accessibility]
**Learning:** Modals require a combination of focus management (capture focus, initial focus on safe action, restore on close) and intuitive dismissal (backdrop click) to feel polished and accessible. Using `focus-visible` ensures keyboard users have clarity without adding visual noise for mouse users.
**Action:** Implement focus management and backdrop-click-to-close as a standard package for all modal components to ensure a consistent and inclusive user experience.

## 2024-05-17 - [Accessible Chat Error Announcements]
**Learning:** Error messages that appear dynamically in a chat interface (e.g., after an async send fails) are often missed by screen reader users if they aren't marked as live regions.
**Action:** Apply `role="alert"` to error message containers in the chat interface to ensure immediate notification for screen reader users when errors occur during async operations.

## 2025-01-30 - [Contextual Loading Labels for Persona Consistency]
**Learning:** In a persona-driven application like "The Fork", generic loading indicators (like "Loading...") feel out of place. Contextual labels like "Speaking..." or "Choosing words..." maintain the immersive atmosphere while providing the necessary system status feedback.
**Action:** Replace generic loading states with persona-consistent micro-copy that reinforces the application's theme while serving the functional purpose of interaction feedback.

## 2025-05-22 - [Proactive Input Constraints]
**Learning:** Users can feel frustrated when they hit a character limit abruptly without visual warning. Providing a transition in color and font weight as the limit approaches acts as a "soft warning" that improves the typing rhythm and prevents data loss.
**Action:** Implement visual urgency triggers (e.g., color transitions) for character counters when input reaches ~85-90% of the maximum length to provide a smoother interaction flow.
