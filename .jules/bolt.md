## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-03-18 - [Formik Re-render Optimization & DOM Sync]
**Learning:** Passing full form state objects (like `errors` and `touched` from Formik) to deeply nested form components breaks `React.memo` by changing references on every form update. Additionally, using synchronous DOM queries like `document.getElementById` inside render blocks is an expensive anti-pattern that slows down re-renders significantly.
**Action:** Always extract and pass specific primitive values (e.g., `error={errors[id]}`, `value={values[id]}`) down to individual input components to allow `React.memo` to effectively prevent unnecessary re-renders. Replace DOM queries with direct state/prop evaluations.
