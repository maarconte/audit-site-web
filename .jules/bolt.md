## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-02-28 - [Formik Lists & DOM Queries Anti-Pattern]
**Learning:** Passing full Formik `errors` and `touched` objects to child components mapped in lists causes unnecessary large-scale re-renders because Formik changes the object references on every interaction. Additionally, using synchronous DOM queries like `document.getElementById` inside a React component's render function or derived calculation is very slow and blocks the main thread.
**Action:** Always extract and pass specific primitive values (e.g., `error={errors[id]}`, `isTouched={touched[id]}`) when mapping form fields, and wrap the child components in `React.memo` (with a `displayName`). Never use DOM queries for state lookups in React; derive the state directly from the component's `value` or state props.
