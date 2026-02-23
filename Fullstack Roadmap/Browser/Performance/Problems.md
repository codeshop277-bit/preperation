# UI Janks While Scrolling
The browser cannot render frames within the 16ms frame budget (60fps).
Each frame during scrolling:
Input → JS → Layout → Paint → Composite → Frame
If any step > 16ms → frame drops → visible jank.

# Main Thread Blocking
If JS is busy, browser cannot update UI.

window.addEventListener("scroll", () => {
  heavyCalculation(); // blocks main thread
});
Why jank occurs

The main thread handles:
JS execution
layout
paint
input handling
Heavy work means:

User scrolls → browser waits → delayed frame
✔ Senior fixes
Use passive listeners
```js

window.addEventListener("scroll", onScroll, {
  passive: true
});

Browser doesn’t wait for JS before scrolling.

Throttle work
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateUI();
      ticking = false;
    });
    ticking = true;
  }
});
```
Scroll handlers should never do heavy work.

# 2.Layout Thrashing During Scroll
# 3. Heavy Paint Operations
Problem
Some CSS properties are expensive during scroll.
Example:

.card {
  box-shadow: large;
  filter: blur(10px);
}
Scrolling requires repainting visible areas.
Complex effects = expensive paints.

Prefer:
transform
opacity

These avoid repaint.

# 4. Not Using GPU Compositing
CPU-heavy animation during scroll

# 5. Large DOM / Heavy Layout Calculations
Huge pages:

Thousands of nodes
Nested layouts
Complex CSS

Every scroll causes style & layout recalculation.
Example
items.map(item => <Row />)

10k DOM nodes = slow layout.

✔ Senior fix — virtualization
<FixedSizeList ... />

Only visible elements exist in DOM.

# 6. Images & Asset Loading During Scroll
Problem
Large images decoding while scrolling.
Symptoms:
sudden stutter
frame drops near images

Fix
<img loading="lazy" />
And use properly sized images.

# 7. Frequent React Re-renders While Scrolling
Anti-pattern
setScrollPosition(window.scrollY);

very pixel scroll → React re-render.

Why this kills performance

React render + reconciliation per frame.

✔ Senior fixes
Avoid React state for scroll position
const scrollRef = useRef(0);

Chrome DevTools → Performance tab:
Look for:
Long tasks (>50ms)
Layout events during scroll
Paint spikes
FPS drops

# Update scorll postion efficiently
const observer = new IntersectionObserver(([entry]) => {
  const viewportTop = entry.boundingClientRect.top;

  // Approximate scroll movement
  console.log("Viewport-relative top:", viewportTop);
});

observer.observe(document.querySelector("#section"));
IntersectionObserver allows you to:
Observe when an element’s visibility changes relative to a root (usually the viewport).

Instead of continuously checking position during scroll, you ask the browser:
“Tell me when visibility changes.”
The browser already computes:

element rectangles
viewport boundaries
intersection areas

IntersectionObserver simply:

✔ hooks into this existing layout work
✔ compares element vs viewport
✔ triggers callback asynchronously

Without observer:
scroll → JS → measure DOM → layout

With observer:
layout already happens → browser notifies you

# 2. What passive: true Actually Means
Example (Bad)
window.addEventListener("scroll", onScroll);
Browser pauses briefly waiting for JS.

✔️ Passive listener
window.addEventListener("scroll", onScroll, {
  passive: true
});

Now you promise:
“I will NOT cancel scrolling.”

Browser can scroll immediately.

Without passive:
Input → wait JS → scroll

With passive:
Input → scroll immediately → run JS later

# COncurrent vs Main
|                   | Main Thread              | Concurrent       |
| ----------------- | ------------------------ | ---------------- |
| Type              | Browser execution thread | Scheduling model |
| Threads used      | Single                   | Still single     |
| Goal              | Execute work             | Prioritize work  |
| Prevent blocking? | ❌                        | ✔ partially      |
| Real parallelism? | ❌                        | ❌                |

The main thread executes rendering and JavaScript, while concurrency is a scheduling strategy that allows work to be interrupted and prioritized to keep the UI responsive — but still runs on the same main thread.4

Concurrency does NOT make work faster.
It makes:
UI feel faster
by letting urgent work (input, clicks) happen before heavy rendering.
Work can be interrupted, prioritized, and resumed.
React schedules tasks so important updates happen first.
Example (React)
startTransition(() => {
  setBigList(data);
});

React can:
pause heavy rendering
keep UI responsive

The main thread is the browser’s primary execution thread.
It handles:
JS execution
DOM updates
Layout
Paint
User input events