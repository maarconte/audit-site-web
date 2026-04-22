## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-02-28 - [Formik Performance Optimization for Dynamic Forms]
**Learning:** In Next.js/React Formik applications, iterating over all form values multiple times using `.reduce` to build intermediate category-specific objects creates excessive memory allocations and `O(N)` mapping overhead on every render, especially when the form is dynamic.
**Action:** Replace multi-pass `.reduce` intermediate object allocations with single-pass logic or short-circuiting methods like `Object.keys(values).some(...)` to evaluate form state efficiently without building disposable objects.
