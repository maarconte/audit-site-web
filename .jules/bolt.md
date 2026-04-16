## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-02-28 - [Single-Pass Iteration and Short-Circuit Evaluation Anti-Pattern]
**Learning:** In React components that process large datasets or form values on every render (like `handleDisableNext`), using multiple chained array methods (`reduce` followed by `Object.values().reduce` or `.some()`) creates unnecessary intermediate objects. This adds significant CPU and memory allocation overhead.
**Action:** Consolidate multiple iteration passes into a single pass to eliminate intermediate object creation. Use short-circuit evaluation methods like `some()` directly over the necessary keys or elements instead of full object/array filtering before checking for booleans to reduce CPU overhead.
