## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-03-05 - [Form Validation Array Scans and Object Allocation Anti-Pattern]
**Learning:** In dynamically generated forms (`FormContainer.tsx`), calculating derived state (like scores or validation status) on every render by chained `reduce` loops that build intermediate objects and iterate over entire values dictionaries introduces unnecessary CPU overhead and memory allocations.
**Action:** Consolidate multiple passes into a single `.reduce()` over the base array (e.g., `questions`). For early-exit boolean checks (like checking if any required category fields are empty), avoid creating intermediate objects completely and instead use short-circuit evaluations like `Object.keys(values).some(key => ...)` with key prefix filtering to execute significantly faster.
