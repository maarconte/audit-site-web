## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.
## 2025-02-28 - [Performance Optimization: Early-Exit and Single-Pass Iteration]
**Learning:** In Next.js/React applications, intermediate array/object allocations and scanning (e.g. `reduce` to filter, then `Object.values().some/reduce`) causes unnecessary CPU cycles on every render, especially inside forms with complex dynamic fields.
**Action:** Consolidate multiple iteration passes into a single pass and utilize short-circuit evaluation methods like `some()` combined with prefix matching (`startsWith`) to avoid O(N) overhead scanning all values.
