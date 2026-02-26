# Bundle Splitting

Bundle splitting means dividing your JavaScript into multiple smaller bundles instead of shipping one large file.

Instead of:
main.js (2.5 MB)

you get:
main.js
dashboard.chunk.js
vendor.chunk.js
analytics.chunk.js

Browser loads only what is needed initially.
Why is it needed / caused?
Large bundles happen because:
SPA loads everything up front
Shared libraries (lodash, charts, editors)
Route-based code included in initial build
Microfrontends or large feature modules

Impact:
Slow TTI (Time to Interactive)
Poor LCP / FCP
CPU parse + compile cost (often worse than network)

How to prevent / resolve
✔ Route-level splitting (MOST important)
Load code only when route is visited.
✔ Vendor splitting (framework-level)

Webpack example:
optimization: {
  splitChunks: {
    chunks: "all"
  }
}
Result:
vendor.js
runtime.js
feature chunks

✔ Feature-based splitting (microfrontend mindset)
const AnalyticsPanel = lazy(() =>
  import("./modules/analytics/AnalyticsPanel")
);
✔ Priority rule (Senior tip)

Split when:
Module > 30–50kb
Rarely used
Heavy dependencies (charts/editors/maps)

DON’T split:
Tiny utilities
Frequently used components

# Tree Shaking
What it is
Tree shaking removes unused exports from your final bundle.

Example:
// utils.js
export const add = () => {}
export const multiply = () => {}
export const divide = () => {}

If you use only:
Only add remains in final build.

Tree shaking fails when:
CommonJS (require) used
Side effects exist
Barrel files import everything
Dynamic object exports

Bad:
module.exports = { add, multiply };

✔ Use ES Modules
export const add = () => {};
✔ Avoid wildcard imports

❌ Bad:
import * as lodash from "lodash";

✔ Good:
import debounce from "lodash/debounce";

✔ Configure sideEffects
package.json:
{
  "sideEffects": false
}
✔️ Means: all files are safe to remove if unused.
or:
{
  "sideEffects": ["*.css"]
}
✔️ Means: these files have side effects and must not be tree-shaken.
Tree shaking works at module graph level, not runtime logic.
This WON’T shake:
if (condition) {
  import something
}
because bundler must keep it safe.

# Dynamic Imports
What it is
Dynamic import loads JS at runtime, creating async chunks automatically.
import("./module");
This creates:
module.chunk.js

Why use it?
Because:
Initial bundle gets smaller
Heavy code deferred
Improves startup performance

Prevent / Resolve performance issues
✔ On-demand heavy libraries
Example: charts loaded only when needed.
const loadChart = async () => {
  const { Chart } = await import("chart.js");
  new Chart(...);
};
✔ IntersectionObserver lazy load (advanced)
const observer = new IntersectionObserver(async ([entry]) => {
  if (entry.isIntersecting) {
    const module = await import("./HeavyComponent");
    module.load();
    observer.disconnect();
  }
});
✔ Prefetch optimization
Webpack:
import(
  /* webpackPrefetch: true */
  "./Dashboard"
);

Loads during idle time.
Too many dynamic imports → network waterfall.
Balance chunk size vs request count.

# Dead Code Elimination
| Tree shaking           | DCE                       |
| ---------------------- | ------------------------- |
| Removes unused exports | Removes unreachable logic |
| Module level           | Syntax level              |
Removing code that can never execute.
Example:
if (false) {
  console.log("dead code");
}
Removed during minification.
Why dead code exists
Feature flags
Debug logs
Environment branches

Example:
if (process.env.NODE_ENV !== "production") {
  console.log("debug");
}

# Minification
Minification is the process of reducing file size by removing unnecessary characters from code without changing its behavior.

What gets removed
Spaces & line breaks
Comments
Long variable names → short ones
Dead code (sometimes)
Example:
Before
function calculateTotal(price, tax) {
  return price + price * tax;
}
After
function a(b,c){return b+b*c}

Why it’s done
Smaller bundle size
Faster download time
Faster page load
Better performance (especially on slow networks)
Where it happens
Usually during build/production:
webpack → Terser
Vite → esbuild / terser
Rollup → terser

Minification is often combined with:
Tree shaking
Code splitting
Compression (gzip/Brotli)
➡️ Minification reduces source size, compression reduces transfer size.

One-line definition
Minification = removing non-essential code characters to reduce bundle size and improve load performance

# Dependency Cost Analysis (Senior-level MOST IMPORTANT)

Analyzing how much bundle size + runtime cost a dependency introduces.
Cost =
Download size
+ Parse cost
+ Execution time
+ Memory usage
Why bundles become huge

Common culprits:
moment.js (~300kb)
chart libraries
UI frameworks
utility libs imported incorrectly

How to analyze
✔ Webpack Bundle Analyzer
npm run build
npx webpack-bundle-analyzer dist/stats.json

Shows:
main.js
 ├── lodash
 ├── moment
 ├── chart.js
✔ Vite visualization
npm run build -- --analyze
✔ Runtime cost analysis (Senior tip)

Use Chrome:
Performance → Main Thread → Scripting time
Large dependency = long parse time.

How to reduce dependency cost
1️⃣ Replace heavy libraries
❌
import moment from "moment";
✔
import dayjs from "dayjs";
2️⃣ Modular imports
import debounce from "lodash/debounce";
3️⃣ Lazy load heavy libs
const editor = await import("monaco-editor");



Think in 3 costs:

Network Cost
→ Bundle splitting
→ Dynamic imports

Build-time Cost
→ Tree shaking
→ Dead code elimination

Runtime Cost
→ Dependency analysis
→ Parse/execute optimization

# The REAL bottleneck today: Main Thread CPU
After download, browser must:
Parse JS
Compile JS (JIT)
Execute JS
Hydrate React
Attach event listeners
Layout + paint

All happen on:
⚠️ SINGLE MAIN THREAD
If blocked → UI freezes → jank.
Real Example
Two apps:
App	Bundle	Performance
A	700 KB optimized code	FAST
B	250 KB heavy logic	SLOW

# Hydration Cost
Hydration is the process where the browser takes server-rendered HTML and attaches JavaScript behavior (event listeners, state, hooks).

SSR flow:
Server → HTML sent
Browser → HTML displayed
React → hydrates and makes it interactive

Example:
hydrateRoot(document.getElementById("root"), <App />);
Why is hydration expensive?
Because React must:
Recreate component tree
Re-run hooks
Attach event handlers
Reconcile DOM
Build internal fiber tree
Even though HTML already exists.
⚠️ This is pure CPU work.

Hydration often costs MORE than initial render because:
HTML already painted
+ React executes again
You basically render twice.
Symptoms of hydration bottleneck
Page looks loaded but clicks don’t work
Scroll lag immediately after load
Input delay (INP issues)
Chrome Performance:
Long tasks after DOMContentLoaded
How to prevent / resolve
✔ Partial Hydration (Islands architecture)
Hydrate only interactive parts.
Concept:
Static HTML → no JS
Interactive widgets → hydrate
Modern frameworks:
Astro
Next.js Partial hydration patterns

✔ Lazy Hydration (when visible)
const observer = new IntersectionObserver(async ([entry]) => {
  if (entry.isIntersecting) {
    const { hydrate } = await import("./hydrateComments");
    hydrate();
  }
});
Hydrate only when user reaches section.
✔ Client-only heavy components
const Chart = dynamic(() => import("./Chart"), {
  ssr: false
});
Avoid hydration entirely for heavy widgets.
✔ Server Components (React architecture shift)
Move logic to server → zero hydration.

# JS Parse / Compile Time
Before JS runs, browser must:

JS → Parse → AST → Compile → Execute
# AST - Abstract Syntax Tree
AST is the structured tree generated by the JS parser that represents code syntax and allows tools/engines to analyze and transform JavaScript efficiently.

This happens every page load.
Parse = reading JS
Compile = converting to executable machine code

Why does it become expensive?
Modern JS contains:
Large frameworks
Closures
Classes
Transpiled code (Babel output)
Polyfills
Even compressed files expand massively in memory.

Example:
300kb compressed → 1.5MB parsed JS
Hidden problem (Senior insight)

Parse + compile happens on:
⚠️ Main Thread

Meaning:
No scrolling
No input response
No animations

Real performance profile
Download: 120ms
Parse: 300ms
Compile: 500ms
Execute: 800ms
Network isn’t the issue anymore.
How to prevent / resolve
✔ Ship modern syntax (avoid transpiling too much)

Bad:
for (var i = 0; i < arr.length; i++) {}

Better target modern browsers:
targets: "defaults and not IE 11"
Less generated code → less parse time.

✔ Reduce framework runtime
Avoid huge UI libraries for small needs.

✔ Split CPU-heavy code
const editor = await import("./MonacoEditor");
Compile deferred until needed.
✔ Avoid large inline scripts
Inline JS blocks parsing of HTML.

✔ Use Web Workers
const worker = new Worker("parser.js");
worker.postMessage(data);
Moves execution off main thread.

Browser doesn’t care about KB — it cares about AST complexity.
Complex logic = slow compile.