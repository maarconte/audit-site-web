## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-03-13 - [Formik Re-renders with Complex Objects]
**Learning:** Passing entire Formik `errors` and `touched` objects into child components inside loops (like mapped form fields) breaks `React.memo()`. This happens because these objects are mutated and re-created by Formik on every field change, causing all inputs in the form to needlessly re-render even if they weren't touched.
**Action:** When mapping Formik form fields to child components wrapped in `React.memo()`, always pass the specific primitive values (`error`, `isTouched`, `value`) instead of full `errors` and `touched` objects to prevent unnecessary large-scale re-renders. Avoid synchronous DOM queries (e.g., `document.getElementById`) in render loops in favor of checking the passed `value` prop.
