## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-02-28 - [React.memo and Formik Object Props Anti-Pattern]
**Learning:** Passing entire Formik `errors` and `touched` state objects to list items (like `FormQuestion`) defeats `React.memo` and causes massive O(N^2) re-renders, since those objects are re-created on every form interaction. Additionally, using synchronous DOM queries (`document.getElementById`) inside a render loop to check input states adds significant CPU overhead and breaks React's unidirectional data flow.
**Action:** When mapping Formik form fields in this codebase, always pass specific primitive values (`error`, `isTouched`, `value`) to child components wrapped in `React.memo()`. Prevent unnecessary large-scale re-renders and avoid synchronous DOM queries by relying entirely on the provided Formik primitive props.
