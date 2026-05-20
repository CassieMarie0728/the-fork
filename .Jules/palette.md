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
