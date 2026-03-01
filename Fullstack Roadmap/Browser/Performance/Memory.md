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

# Garbage Collection Behavior
Garbage Collection (GC) is the JavaScript engine’s process of automatically freeing memory that is no longer reachable.

In browsers (V8 / Chrome):
Memory = Heap
Objects live until no reference points to them
GC removes unreachable objects
React does NOT manage memory — JavaScript engine does.

How GC works internally (Senior-level mental model)
V8 uses Generational Garbage Collection.
Two main areas:
🔹 Young Generation (New Space)
Short-lived objects
React renders create many of these
Very frequent cleanup (fast)

Examples:
temporary props
virtual DOM objects
render calculations

🔹 Old Generation (Old Space)
Long-lived objects
expensive cleanup
leaks usually end up here

Examples:
listeners
closures
cached data
refs

Why memory problems happen
GC only removes objects that are:
UNREACHABLE from ROOTS

Roots include:
window
DOM
event listeners
active timers
closures

If anything is still reachable → no cleanup.
Example (React leak reality)
useEffect(() => {
  window.addEventListener("resize", () => {
    console.log(state);
  });
}, []);

Memory graph:
window
 └ listener
     └ closure
         └ component state

GC cannot remove component.
GC Behavior in React Apps

React creates MANY short-lived objects:
reconciliation trees
fibers
props copies
This is normal.
Problem = when objects survive multiple GC cycles.
Common GC Symptoms

You see:
memory grows slowly over time
drops occasionally (minor GC)
never returns fully (objects promoted to old space)
Chrome Performance panel shows:
sawtooth pattern ↑ ↓ ↑ ↓

If baseline keeps rising → leak.
Prevention Strategy (Senior)
✔ Avoid long-lived references

Bad:
globalCache.push(state);

Good:
globalCache.push(state.id);
✔ Cleanup aggressively inside effects

Every side effect = lifecycle responsibility.

# Heap Snapshots
A Heap Snapshot is:
A frozen picture of all memory objects at one moment.

Used to:
detect leaks
find large objects
locate retained components
Why it exists
GC runs automatically and invisibly.
Snapshots let you inspect:
WHAT is in memory
WHY it still exists

How seniors actually use it (Real workflow)
Chrome DevTools:
Memory → Heap Snapshot

Take:
Snapshot A (fresh page)
Perform actions (navigate, open dashboard)
Snapshot B
Compare

What you look for
🔹 Growing object counts

Example:
Detached HTMLDivElement ↑
DashboardComponent ↑

Means memory not released.
🔹 Large retained size

Important columns:
Column	Meaning
Shallow Size	memory of object itself
Retained Size	memory kept alive because of it

⚠️ Retained size matters more.

Example Investigation
You see:
Closure → retained size: 45MB
This means:

One closure holding huge object graph.
If closure references bigData indirectly → snapshot shows:
Closure
 └ Array(500000)
Senior Tip (VERY IMPORTANT)
Snapshot shows symptoms, not root cause.

Always inspect:
Retainers chain


# Retainers Graph
A Retainers Graph shows:
WHY an object is still in memory.
It displays the chain of references preventing GC.

Think:
Who is holding this object alive?
Why it matters

Finding object ≠ solving leak.
You must know:
ROOT → … → problematic object
Example Retainers Graph
Imagine leaked component:
Window
 └ EventListener
     └ Closure
         └ React FiberNode
             └ Component State

Root cause:
➡️ event listener not removed.

Real React Example
Code
useEffect(() => {
  const handler = () => console.log(data);

  window.addEventListener("scroll", handler);
}, []);

Heap snapshot:
data object
Retainers graph:

Window
 └ scroll listener
     └ handler closure
         └ data
Now leak is obvious.

Advanced Example — Detached DOM
Graph:

Window
 └ library cache
     └ DOM node

Root cause:
library forgot cleanup.

How seniors debug leaks (REAL PROCESS)
Step 1 — Heap Snapshot
Find growing objects.

Step 2 — Retained Size
Identify biggest retainers.

Step 3 — Retainers Graph
Trace back to root.

Ask:
listener?
closure?
global variable?
timer?

Step 4 — Fix lifecycle cleanup.
Senior Insight: React Fiber Appears Often

You may see:
FiberNode

Don’t blame React immediately.
Usually retained by:
closures
listeners
async callbacks
React fiber is just the victim.