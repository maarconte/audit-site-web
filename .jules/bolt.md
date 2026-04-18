## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-02-28 - [Eliminating Object Allocation in Data Transformations]
**Learning:** In React components that iterate over complex data structures frequently (like `FormContainer.tsx` validating multi-step form values), chaining `.reduce()` calls or creating intermediate mapping objects (`getCurrentCategoryData`) introduces unnecessary object allocations and linear overhead.
**Action:** Consolidate multiple iteration passes into a single pass where possible. Use early-exit methods like `.some()` instead of filtering/mapping to intermediate objects for boolean checks to reduce CPU overhead on every render.
