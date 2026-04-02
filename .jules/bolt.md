## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-03-01 - [Formik Large-Scale Re-renders Optimization]
**Learning:** Passing Formik's full `errors` and `touched` objects to child components causes large-scale re-renders of the entire form when any single field changes. Synchronous DOM queries like `document.getElementById` inside render loops can also cause bottlenecks.
**Action:** Extract specific primitive values (e.g., `error`, `isTouched`, `value`) from Formik objects and pass them down to child components wrapped in `React.memo()` to prevent unnecessary re-renders. Remove synchronous DOM queries and use controlled `value` props instead.
