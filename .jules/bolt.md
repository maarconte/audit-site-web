## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-02-28 - [Formik Re-renders & Synchronous DOM Queries Anti-Pattern]
**Learning:** Passing full Formik state objects (`errors`, `touched`) to children components without `React.memo` causes massive, unnecessary re-renders across all form fields when any single field changes. Additionally, using synchronous DOM queries (`document.getElementById`) inside render functions to check state (e.g., if a radio is checked) causes layout thrashing and severe performance penalties.
**Action:** Always map Formik form fields by passing specific primitive values (`error`, `isTouched`, `value`) to child components wrapped in `React.memo()`. Never use synchronous DOM queries in render loops; derive state from passed props instead.
