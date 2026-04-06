## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-02-28 - [Consolidating Iteration Passes and Avoiding Intermediate Objects]
**Learning:** A common performance anti-pattern found in this codebase involves performing multiple sequential passes over data—such as creating an intermediate object via `reduce` and immediately extracting its values using `Object.values().reduce()`, or filtering an entire large object with `Object.keys()` to check a single subset. This causes unnecessary object allocations and CPU cycles on every render.
**Action:** When deriving data, especially in loops and component lifecycle methods, aim for a single direct iteration pass over the original array using early-exit methods like `some()`, or a single `reduce()` that computes the final desired value directly.
