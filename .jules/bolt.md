## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-04-17 - [Early-exit checks over N-pass transformations]
**Learning:** In React components managing complex form state (like Formik objects), using broad methods like `Object.keys(values).reduce` to filter specific category data incurs O(N) overhead scanning all values, and allocating intermediate objects.
**Action:** Always prefer iterating solely over static, scoped configuration arrays (e.g. `currentQuestions`) combined with early-exit functions like `.some()` for boolean validation checks, and consolidate multiple `reduce` passes into single passes to avoid unnecessary allocations during render loops.
