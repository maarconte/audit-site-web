## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2024-05-18 - [Fix React Re-renders and DOM queries]
**Learning:** Found an anti-pattern in the codebase where `document.getElementById` was being used synchronously inside a React component's render function to check if a checkbox was ticked.
**Action:** Replace `document.getElementById` with a simple check on the prop value (`value === option.score.toString()`) to improve rendering speed by removing a costly DOM lookup. Additionally, always pass primitive values instead of complex objects to components wrapped in `React.memo` so that it can correctly evaluate props equality and skip unnecessary renders.
