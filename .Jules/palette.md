## 2024-05-14 - [Accessibility Gaps in Interactive Elements]
**Learning:** This application had several interactive elements (textareas, buttons, modals) that lacked standard accessibility features like associated labels, ARIA roles, and keyboard focus indicators.
**Action:** Always verify that input elements have `id` attributes matching their `<label htmlFor="...">` and that modals support the `Escape` key for closure. Use `focus-visible` for focus rings to ensure keyboard users have visual feedback without affecting mouse users' experience.

## 2024-05-24 - [Semantic Radio Groups and Avatar Silence]
**Learning:** Decorative text avatars (like "OY" or "Y") are often read by screen readers as separate, confusing words, creating noise. Additionally, custom toggle groups are far more accessible when explicitly defined as a `radiogroup`.
**Action:** Apply `aria-hidden="true"` to text-based decorative icons and ensure toggle groups use `role="radiogroup"` with `role="radio"` and `aria-checked` on children. Always link the group to its label using `aria-labelledby`.
