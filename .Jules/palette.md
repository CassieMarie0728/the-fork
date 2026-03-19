## 2024-05-14 - [Accessibility Gaps in Interactive Elements]
**Learning:** This application had several interactive elements (textareas, buttons, modals) that lacked standard accessibility features like associated labels, ARIA roles, and keyboard focus indicators.
**Action:** Always verify that input elements have `id` attributes matching their `<label htmlFor="...">` and that modals support the `Escape` key for closure. Use `focus-visible` for focus rings to ensure keyboard users have visual feedback without affecting mouse users' experience.

## 2024-05-15 - [ARIA Radio Groups for Custom Toggles]
**Learning:** Custom selection groups (e.g., intensity toggles) must implement `role="radiogroup"` and `role="radio"` with the `aria-checked` attribute to be correctly interpreted by screen readers as a single choice among multiple options.
**Action:** When creating custom toggle groups that act like radio buttons, use `role="radiogroup"` on the container and `role="radio"` on the items, ensuring they are linked to a label via `aria-labelledby`.

## 2024-05-15 - [Hiding Redundant Text-based Avatars]
**Learning:** Text-based avatars (e.g., single-letter initials) that appear next to a name can be redundant and noisy for screen readers, leading to confusing announcements like "O Y Other You".
**Action:** Apply `aria-hidden="true"` to decorative or redundant text-based icons to prevent screen reader noise when the same information is already conveyed by adjacent text.

## 2026-03-19 - [Synchronizing Frontend Limits with Backend Truncation]
**Learning:** Backend FastAPI logic (e.g., in server.py) often silently truncates long text inputs to stay within context windows or database limits. Without frontend enforcement, users may lose information they spent time drafting.
**Action:** Always implement `maxLength` constraints on textareas that match backend limits, and provide a real-time character counter with `aria-live="polite"` to give accessible feedback on remaining space.
