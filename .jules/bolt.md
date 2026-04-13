## 2025-02-28 - [Canvas Animation Loop Anti-Pattern]
**Learning:** In Next.js/React applications, starting a `requestAnimationFrame` loop on component mount that constantly runs (even when there's nothing to draw on the canvas, like in the previous `ClickSpark` implementation) causes massive CPU and battery drain. Next.js does not magically optimize this away.
**Action:** Always start canvas animations based on user interaction (like `onClick`) and explicitly stop the loop (`cancelAnimationFrame` or exit the recursion) when the animation finishes or there are no items left to render.

## 2025-02-28 - [NPM Install Modifying Package Files]
**Learning:** Running `npm install eslint` in this repo to satisfy linting dependencies modifies `package.json` and `package-lock.json`, which can be staged by the environment automatically.
**Action:** Always run `git restore --staged package.json package-lock.json && git restore package.json package-lock.json` after running `npm run lint` with dynamically installed packages to avoid accidentally committing dependency changes when working on non-dependency related tasks.
