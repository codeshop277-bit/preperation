# Critical Rendering Path (CRP)
The Critical Rendering Path is the sequence the browser follows to convert:
HTML + CSS + JS → pixels on screen
High-level steps:
Parse HTML → DOM
Parse CSS → CSSOM
Combine → Render Tree
Layout (calculate geometry)
Paint (draw pixels)
Composite (GPU combines layers)

The goal is:
Render meaningful content as fast as possible.

```js
<!-- Blocks rendering -->
<link rel="stylesheet" href="styles.css">

<!-- Blocks parser -->
<script src="app.js"></script>
```
1️⃣ Render-blocking resources
CSS blocks rendering (browser waits before first paint)
Synchronous JS blocks HTML parsing

2️⃣ Large bundles
Huge JS files delay:
parsing
compilation
execution

3️⃣ Deep DOM trees
More nodes → slower style/layout calculations.

# Resolution
```js
//Reduce render blocking
<!-- Non-critical CSS -->
<link rel="preload" href="styles.css" as="style">

<!-- Defer JS execution -->
<script src="app.js" defer></script>

<link rel="preconnect" href="https://api.example.com" />

//Code splitting (React)
const Dashboard = React.lazy(() => import("./Dashboard"));

```
Reducing Time To First Paint (TTFP) and Largest Contentful Paint (LCP)
Most performance wins come from reducing blocking JS/CSS, not micro-optimizing code.

# Layout → Paint → Composite
After DOM + CSSOM:
1️⃣ Layout (Recalculate geometry)
Browser computes:
element size
positions
flow

Example trigger:
div.style.width = "200px";

2️⃣ Paint
Pixels are drawn:
colors
text
shadows
borders
div.style.backgroundColor = "red";

| Change         | Cost                       |
| -------------- | -------------------------- |
| width / height | Layout + Paint + Composite |
| color          | Paint + Composite          |
| transform      | Composite only ⚡           |

//Preferred
div.style.transform = "translateX(100px)";

# Reflow vs Repaint
Reflow (Layout)
Occurs when layout must be recalculated.
Causes
changing width/height
adding DOM nodes
reading layout after writing

div.style.width = "200px";
console.log(div.offsetWidth); // forces reflow

# Layout Thrashing
Layout thrashing happens when code repeatedly alternates between:
DOM WRITE → DOM READ → WRITE → READ
Each read forces the browser to recalculate layout again.
when your code asks for layout info:
element.offsetWidth

the browser must:
Stop JS execution
Recalculate layout immediately
Return accurate value

If this happens repeatedly → performance collapses.

for (let i = 0; i < items.length; i++) {
  items[i].style.width = "100px";
  console.log(items[i].offsetWidth);
}
This triggers multiple forced layouts.
Fix — batch reads and writes
// READ first
const widths = items.map(i => i.offsetWidth);

// WRITE later
items.forEach(i => i.style.width = "100px");
OR
requestAnimationFrame(() => {
  div.style.transform = "translateX(20px)";
});
Reflow is one of the most expensive browser operations.
Frameworks like React help by batching updates — but poorly written effects can still cause layout thrashing.

# Main Thread Blocking
Browser main thread handles:
JS execution
Rendering
Input handling
Layout & paint

If JS runs too long:
UI freezes.

Real-world blocking example
const result = hugeArray.map(expensiveFn);
Large synchronous operations = dropped frames.

Prevention strategies
✔️ Break work into chunks
```js
function processChunk(items) {
  const chunk = items.splice(0, 100);

  chunk.forEach(process);

  if (items.length) {
    setTimeout(() => processChunk(items), 0);
  }
}

// ✔️ Use Web Workers
const worker = new Worker("worker.js");
worker.postMessage(data);
//Moves CPU-heavy work off main thread.

// React concurrency features
const [isPending, startTransition] = useTransition();

startTransition(() => {
  setData(newData);
});
```
Performance problems usually come from:
long tasks (>50ms)
heavy hydration
huge JS bundles

Use Chrome Performance tab → look for Long Tasks.

# JS Execution Cost
What it is
Cost includes:
Download
Parse
Compile
Execute
Memory allocation
GC (Garbage Collection)

Even unused JS impacts performance

⚠️ Causes
Large libraries
```js
import _ from "lodash"; // huge bundle

// Heavy render logic
function Component() {
  const result = expensiveCalculation(); // runs every render
}

// Too many re-renders
const obj = {};
<Component data={obj} />
//New reference every render.

// 🛠 Prevention strategies
// ✔️ Tree shaking
import debounce from "lodash/debounce";

// ✔️ Memoization
const value = useMemo(() => expensiveCalc(data), [data]);

// ✔️ Virtualization (large lists)
import { FixedSizeList } from "react-window";

//Avoid heavy logic in render
❌
return data.sort().map(...)
✔️
const sorted = useMemo(() => data.sort(), [data]);

```
JS cost affects:
TTI (Time to Interactive)
Input latency
Battery usage
Modern frontend performance is mostly:
Reducing JavaScript work rather than optimizing CSS.

# Forced Synchronous Layout
A forced synchronous layout occurs when JavaScript forces the browser to calculate layout immediately instead of waiting for the normal render cycle.
JS interrupts rendering pipeline demanding layout NOW.
APIs that trigger forced layout
```js
element.offsetHeight
element.offsetWidth
element.getBoundingClientRect()
window.getComputedStyle()
scrollTop
clientHeight
```
Example
div.style.width = "300px";  // invalidates layout
console.log(div.offsetWidth); // forces sync layout

JS pauses until layout finishes.
⚠️ Why this hurts performance
Because it:
Blocks main thread
Breaks browser optimizations
Causes frame drops (16ms budget)
# FIx
Separate read/write phases
Pattern used in big systems:
let width;
// READ
width = el.offsetWidth;
// WRITE
requestAnimationFrame(() => {
  el.style.width = width + "px";
});

# GPU compositing
Bowser moves visual updates to GPU instead of recalculating layout/paint on CPU.
GPU-friendly properties
These trigger composite-only updates:
transform
opacity
filter (sometimes)

```js
el.style.transform = "translateX(100px)";

Only GPU layer updates — extremely fast.

❌ CPU-heavy animation
el.style.left = "100px";

Triggers:

Layout → Paint → Composite

✔️ GPU accelerated animation
el.style.transform = "translateX(100px)";
```
Why GPU compositing is powerful
GPU excels at:
moving pixels
blending layers
animations

This enables:
60fps scrolling
smooth transitions
less main-thread work

# will-change
will-change is a CSS performance hint that tells the browser:
⚠️ “This element is going to change soon — prepare in advance.”
It allows the browser to pre-optimize rendering (often by creating a compositor layer).
What the browser actually does

Normally, the browser creates layers only when needed.
With will-change, the browser may:
Promote element to its own GPU layer
Precompute rendering resources
Avoid expensive layout/paint during updates

Result:
Without will-change:
Layout → Paint → Composite

With will-change:
Composite only (GPU)

.box {
  will-change: transform;
  transition: transform 0.3s;
}

Properties Used
will-change: transform;
will-change: opacity;
will-change: scroll-position;

Why misuse is dangerous (Senior Insight)
This is where many engineers go wrong.
Each promoted layer costs:
GPU memory
compositing time
texture upload cost

Bad usage:
* {
  will-change: transform;
}

Use will-change only when:

✔ Animations lag initially
✔ High-frequency transform updates
✔ Complex layered UI
✔ Scroll-based motion effects

# Profiling Overhead - Measurement cost
# DEV VS PROD build differences
| Category                                  | Development Build               | Production Build         | Impact                                |
| ----------------------------------------- | ------------------------------- | ------------------------ | ------------------------------------- |
| **Minification (Terser)**                 | ❌ Disabled                      | ✅ Enabled                | Larger file size in dev               |
| **Dead Code Elimination**                 | ❌ Minimal / disabled            | ✅ Aggressive             | Unused code remains in dev            |
| **Tree Shaking**                          | ⚠️ Limited                      | ✅ Fully applied          | Entire modules kept in dev            |
| **Symbol Mangling**                       | ❌ Disabled                      | ✅ Enabled                | Longer variable names in dev          |
| **Constant Folding**                      | ❌ Disabled                      | ✅ Enabled                | Extra runtime computation in dev      |
| **Scope Hoisting (Module Concatenation)** | ❌ Disabled                      | ✅ Enabled                | More wrapper functions in dev         |
| **React Production Optimizations**        | ❌ Dev warnings + checks enabled | ✅ Warnings stripped      | Dev React is heavier & slower         |
| **PropTypes Checks**                      | ✅ Executed                      | ❌ Stripped               | Extra runtime cost in dev             |
| **Strict Mode Double Invocations**        | ✅ Enabled                       | ❌ Disabled               | Extra lifecycle execution in dev      |
| **Source Maps**                           | ✅ Full / eval-based             | ⚠️ External or minimized | Larger bundle + slower parsing in dev |
| **HMR Runtime**                           | ✅ Included                      | ❌ Removed                | Extra bootstrap code in dev           |
| **Error Overlay / Dev Client**            | ✅ Included                      | ❌ Removed                | Extra runtime cost in dev             |
| **Webpack Debug Runtime**                 | ✅ Verbose                       | ❌ Optimized              | More module tracking in dev           |
| **Module Federation Debug Wrappers**      | ✅ Verbose runtime               | ✅ Optimized runtime      | Slightly larger dev bootstrap         |
| **Compression (gzip/brotli)**             | ❌ Usually disabled              | ✅ Enabled at server      | Dev transfer size appears larger      |
| **Long-Term Caching / Chunk Hashing**     | ❌ Not optimized                 | ✅ Optimized              | Smaller repeat loads in prod          |
| **Bundle Analyzer Optimizations**         | ❌ Not applied                   | ✅ Applied                | Cleaner output in prod                |

# Paint Flashing (Chrome DevTools)
Paint flashing is a rendering diagnostic feature that visually highlights areas of the page whenever the browser repaints them.
When enabled, Chrome flashes regions (typically in green) every time they are repainted.
It helps you answer:
“What parts of the UI are being repainted, and how often?”
