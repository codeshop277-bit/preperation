# Memory Leaks in React
A memory leak happens when objects are no longer needed but are still reachable from memory references, so the garbage collector (GC) cannot free them.

In React, this usually means:
Components unmounted but still referenced
Effects that keep running
Async operations updating dead components
Event listeners or timers persisting

➡️ Result:
Increasing memory usage
Slower JS execution
UI jank after long sessions
Tabs crashing in dashboards
Why it is caused (Real Root Cause)
React itself rarely leaks memory.
The leak happens because:
JavaScript references still exist somewhere in memory graph.

Common sources:
Closures
DOM references
Global listeners
Timers
WebSockets
Observers

Example memory graph:
window
 └─ listener callback
      └─ closure → component state

GC cannot remove component because closure still reachable.
Problem:
Component unmounts
Promise resolves later
React state referenced → leak warning (or silent retain)
```js
function setup() {
  const btn = document.getElementById("btn");

  function handleClick() {
    console.log("clicked");
  }

  btn.addEventListener("click", handleClick);

  return () => btn.removeEventListener("click", handleClick); //cleanup
}
const controller = new AbortController();

fetch("/api", { signal: controller.signal });

// cleanup
controller.abort();
```
✔ Always clean side effects
timers
subscriptions
websocket
observers
listeners
✔ Avoid long-lived refs to UI objects
✔ Prefer server data fetching (Next App Router)
Reducing client async code → fewer leaks.

# Detached DOM Nodes
A detached DOM node is:
A DOM element removed from the page BUT still referenced in JS memory.
Browser cannot garbage collect it.

Why it happens
Mostly caused by:
Manual DOM manipulation
refs stored globally
third-party libraries
event handlers capturing elements
```js
❌ Bad Example
const cache = [];

function Component() {
  const ref = useRef();

  useEffect(() => {
    cache.push(ref.current);
  }, []);
}

Even after unmount:

cache → DOM node

DOM stays alive.

✅ Proper Fix
useEffect(() => {
  cache.push(ref.current);

  return () => {
    cache.length = 0;
  };
}, []);

or avoid storing DOM references globally.
```
Real Production Example
Charts libraries:
Chart.js
D3
Maps

They often create detached canvas nodes if destroy() not called.
```js
✅ Cleanup Pattern
useEffect(() => {
  const chart = new Chart(canvasRef.current);

  return () => chart.destroy();
}, []);
```
Detection (Senior Tip)

Chrome DevTools:
Memory → Heap Snapshot → Detached DOM nodes
If count increases → leak confirmed.

# 3️⃣ Event Listener Leaks
Listeners remain active even after component unmounts.

The callback keeps:
component state
props
closures
alive in memory.
Why it happens
Because:
window/document keeps reference → callback
❌ Bad Example
useEffect(() => {
  window.addEventListener("resize", handleResize);
}, []);

No cleanup.
✅ Correct Pattern
useEffect(() => {
  function handleResize() {
    console.log(window.innerWidth);
  }
  window.addEventListener("resize", handleResize);
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
Senior Mistake (VERY common)
window.addEventListener("resize", () => {});
❌ Cannot remove anonymous function.

✔ Stable handler solution
const handleResize = useCallback(() => {
  setWidth(window.innerWidth);
}, []);
Advanced (Dashboard Optimization)
Instead of many listeners:
// single global listener
window.addEventListener("resize", emitResizeEvent);
Use pub/sub internally.

# Closures Retaining Memory
A closure keeps access to variables from its lexical scope.
If closure survives longer than component lifecycle → memory retained.

Why it happens
JavaScript rule:
As long as function exists, variables it references cannot be GC’d.
❌ Classic Leak
useEffect(() => {
  const bigData = new Array(1000000).fill("data");
  setTimeout(() => {
    console.log(bigData.length);
  }, 10000);
}, []);

Even if component unmounts:
timeout → closure → bigData
Memory retained.
✅ Fix — Clear timer
useEffect(() => {
  const bigData = new Array(1000000).fill("data");
  const id = setTimeout(() => {
    console.log(bigData.length);
  }, 10000);

  return () => clearTimeout(id);
}, []);

Advanced Leak Pattern (React apps)
❌ Store callbacks globally
globalCallbacks.push(() => {
  console.log(state);
});
Entire component state frozen in closure.
✅ Fix
Store minimal data only:
globalCallbacks.push(id);
Senior Rule
Closures are the #1 invisible memory leak in JS apps.
Especially:
async callbacks
promise chains
listeners
debounced functions

# Whenever you write useEffect, ask:
Did I create:
- listener?
- timer?
- subscription?
- observer?
- async work?
- external instance?
➡️ If YES → return cleanup.