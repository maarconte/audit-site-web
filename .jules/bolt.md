## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-02-28 - [Static JSX Mapping Anti-Pattern]
**Learning:** Re-creating a mapping of string keys to JSX elements (like `react-icons`) *inside* a React functional component's body causes new object allocation and React element creation on every render.
**Action:** Move static JSX mappings and configuration objects outside of the component render function (to module scope) to improve performance and reduce garbage collection overhead, as per standard optimization patterns in this repository.
