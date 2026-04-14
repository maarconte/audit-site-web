## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-02-28 - [Avoid Two-Pass Object Reduction Pattern]
**Learning:** In the FormContainer component, calculating scores and checking field validity used a two-pass approach: `Array.reduce` into an intermediate dictionary object, followed by `Object.values(...).reduce/some`. This pattern creates unnecessary object allocations on every render or interaction update, which is slow and adds garbage collection overhead, particularly inside frequently evaluated functions like `handleDisableNext`.
**Action:** Replace two-pass dictionary builders with direct single-pass accumulation using standard array methods (`Array.reduce` or `Array.some`) and early exit strategies to compute values directly without instantiating intermediate objects.
