## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2026-03-04 - [Formik Re-render Anti-Pattern with Mapped Children]
**Learning:** Passing full `errors` and `touched` objects from Formik down to mapped child components causes massive O(n^2) re-renders across the entire form whenever ANY field changes, negating the benefits of React. Additionally, using synchronous DOM queries (`document.getElementById`) inside render loops creates severe main-thread blocking during these re-render cascades.
**Action:** Always pass specific primitive values (`error={errors[id]}`, `isTouched={touched[id]}`, `value={values[id]}`) to child components wrapped in `React.memo()`. Replace sync DOM queries in render functions with simple state or prop comparisons.
