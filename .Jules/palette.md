## 2024-05-14 - [Accessibility Gaps in Interactive Elements]
**Learning:** This application had several interactive elements (textareas, buttons, modals) that lacked standard accessibility features like associated labels, ARIA roles, and keyboard focus indicators.
**Action:** Always verify that input elements have `id` attributes matching their `<label htmlFor="...">` and that modals support the `Escape` key for closure. Use `focus-visible` for focus rings to ensure keyboard users have visual feedback without affecting mouse users' experience.
