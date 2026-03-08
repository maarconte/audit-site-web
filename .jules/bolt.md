## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2023-10-25 - [Formik Renders and Synchronous DOM Queries Anti-Pattern]
**Learning:** Passing full Formik state objects (like `errors` or `touched`) to child components causes large-scale re-renders of the entire form whenever any field changes. Furthermore, using synchronous DOM queries like `document.getElementById` inside a React render function is a major performance bottleneck, as it forces layout thrashing.
**Action:** Extract primitive values from Formik state (`error`, `isTouched`, `value`) and pass them individually to child components wrapped in `React.memo()`. Rely on React state/props instead of querying the DOM directly during renders.
