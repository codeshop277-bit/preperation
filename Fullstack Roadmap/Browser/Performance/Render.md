# Reconcilliation
Reconciliation is React’s process of comparing the previous virtual DOM tree with the new virtual DOM tree to determine the minimum set of changes required for the real DOM.
React does not update the DOM directly on every render — it performs a diff first.
Core ideas:
Tree diffing (O(n) heuristics, not full diff)
Element type comparison
key-based child matching
Determines whether to update, reuse, or remount

Reconciliation runs whenever React decides a component must render:
State update (setState, useState)
Parent re-render
Context update
Props change
Hook-triggered updates
React must reconcile because:
DOM operations are expensive
Rendering is cheap compared to DOM mutation

How to prevent / optimize
You cannot stop reconciliation — but you can reduce unnecessary work.

✅ Stable keys (critical)
Bad:
items.map((item, index) => <Row key={index} />)
Problem:
Reordering causes remounting
State loss
Extra DOM operations

Good:
items.map(item => <Row key={item.id} />)
✅ Avoid unnecessary tree changes
Bad:
{isVisible && <Component />}
Toggles mount/unmount repeatedly.
Better:
<Component hidden={!isVisible} />
(when preserving state is important)

✅ Split components strategically
Bad:
<Page>
  <Header />
  <HeavyChart />
</Page>
State change in Header may trigger reconciliation of whole subtree.
Better:
const Header = React.memo(HeaderComponent);
Reconciliation cost is mostly:
Tree depth
Number of nodes diffed
Identity changes (keys/functions/objects)
Optimization target = reduce subtree invalidation.

# Render vs Commit Phase
React work is divided into two phases:
🟢 Render Phase (Pure Calculation)
React:
Runs component functions
Calculates next UI
Builds virtual DOM
Can be paused/interrupted (Concurrent Rendering)

No DOM mutation happens here.

Example:
function App() {
  console.log("render");
  return <div>Hello</div>;
}
🔵 Commit Phase (Side Effects)
React:
Applies DOM mutations
Runs lifecycle methods
Executes effects
This phase is synchronous and cannot be interrupted.

Runs:
useLayoutEffect
DOM updates
useEffect (after paint)
Why separation exists
Because:
Render can be optimized, paused, aborted
Commit must be fast & atomic
Prevent performance issues
❌ Heavy work in render
function App() {
  expensiveCalculation(); // BAD
  return <UI />;
}
✅ Move work outside render
const result = useMemo(() => expensiveCalculation(), []);
❌ DOM reads during render
const width = element.offsetWidth; // wrong
✅ Use effects
useLayoutEffect(() => {
  const width = ref.current.offsetWidth;
}, []);
Most React performance bugs = render phase doing too much work.

# Re render
A re-render means React re-executes a component function.
➡️ Re-render ≠ DOM update (reconciliation decides that later).
Common causes
1. State changes
setCount(c => c + 1);
2. Parent re-render (MOST COMMON)
function Parent() {
  const [count, setCount] = useState(0);
  return <Child />;
}
Child renders even if props unchanged.

3. New object/function references
Bad:
<Child style={{ color: "red" }} />
New object every render.

4. Context updates
Every consumer re-renders.

5. Hooks updates
useReducer
useState
External store updates

Prevent / Control re-renders
✅ React.memo
const Child = React.memo(function Child(props) {
  return <div>{props.name}</div>;
});
✅ Stable callbacks
const handleClick = useCallback(() => {
  doSomething();
}, []);
✅ Stable objects
const style = useMemo(() => ({ color: "red" }), []);
✅ Context splitting (senior pattern)

Bad:
<AppContext.Provider value={{theme, user}}>

Good:
<ThemeContext.Provider value={theme}>
<UserContext.Provider value={user}>
Most re-renders happen because of reference instability, not data change.

# Memoization Strategy
Memoization caches results to avoid recalculating or re-rendering.
React provides 3 main tools:

| Tool          | Purpose                  |
| ------------- | ------------------------ |
| `React.memo`  | Skip component render    |
| `useMemo`     | Cache computed value     |
| `useCallback` | Cache function reference |

Over-memoization.
Memoization itself has:
Dependency tracking cost
Memory cost
Complexity cost

1️⃣ Memoize expensive calculations
const filtered = useMemo(() => {
  return items.filter(i => i.active);
}, [items]);

Use when:

Heavy computation

Large lists

2️⃣ Memoize props passed to memoized children
const onClick = useCallback(() => {
  save(id);
}, [id]);

<Child onClick={onClick} />
3️⃣ Component boundary memoization
const HeavyChart = React.memo(Chart);

Best ROI optimization.

❌ Bad memoization
const x = useMemo(() => count + 1, [count]);
No benefit.

Rule 1:
Memoize boundaries, not everything.

Rule 2:
Memoize when:
Passing objects/functions to children
Expensive calculations
Large subtree rendering

Rule 3:
Measure first (Profiler).

React performance hierarchy:

1. Prevent unnecessary renders
2. Reduce reconciliation work
3. Reduce render cost
4. Reduce commit cost (DOM mutations)

Most engineers optimize #3 directly — seniors optimize #1.
State change
   ↓
Render Phase (calculate UI)
   ↓
Reconciliation (diff trees)
   ↓
Commit Phase (DOM update)

use useMemo only if:
Computation is expensive OR
Value identity affects child rendering.

# UseCallBack
Reference optimization, not execution optimization.
Ex: <Dashboard /> has a a child <DashboardContents /> In child i have a function handleContents().
Every time Dashboard re-renders:

Dashboard function executes again
↓
DashboardContents executes again
↓
handleContents function recreated

Functions in JS are objects.

Every render:

Render 1:
handleContents → reference 0xA1

Render 2:
handleContents → reference 0xB2

Render 3:
handleContents → reference 0xC3
Even though code is the same:
❌ Reference is different.

Where is this stored?
In JavaScript engine memory (V8 etc):
Function object → Heap memory
Reference → stored in component execution context
Each render = new execution context → new function allocation.

Now imagine you optimize child:
const DashboardContents = React.memo(function DashboardContents() {
  ...
});

React.memo does:
previousProps !== nextProps ?
If function prop changes → re-render.

Render flow WITHOUT useCallback
Dashboard render
   ↓
new function created (new memory reference)
   ↓
new prop reference
   ↓
React.memo fails shallow compare
   ↓
DashboardContents re-renders

Even if NOTHING changed.

Dashboard re-render
   ↓
same function reference
   ↓
React.memo shallow compare passes
   ↓
DashboardContents SKIPS render

# React Batching
Batching means React groups multiple state updates into a single render.
Example
setCount(c => c + 1);
setOpen(true);

React → ONE render.
Why it exists

Without batching:
Each state update triggers render
Excess reconciliation
Poor performance

React 18 automatic batching

Now works inside:
✔ Event handlers
✔ Promises
✔ Timeouts
✔ Async callbacks

setTimeout(() => {
  setA(1);
  setB(2);
});

➡️ Single render (React 18+)
When batching breaks
flushSync
import { flushSync } from "react-dom";
flushSync(() => setState(x));
Forces immediate render.

Use only for:
DOM measurement
Critical UI sync

Batching reduces:
Render count
Reconciliation frequency
Commit work

# State Normalization
Organizing state to avoid duplication and deep nesting — similar to database normalization.

Why bad state happens
Common anti-pattern:
const [user, setUser] = useState({
  posts: [{ id:1, author:{...}}]
});

Problems:
Deep updates
Object recreation
Massive re-renders

❌ Non-normalized state
{
  users: [{id:1,name:"A"}],
  posts: [{id:1,user:{id:1,name:"A"}}]
}

Duplicate data.
✅ Normalized state (Senior Standard)
{
  usersById: {
    1: { id:1, name:"A" }
  },
  postsById: {
    10: { id:10, userId:1 }
  }
}
Benefits
✔ Smaller updates
✔ Easier caching
✔ Better memoization
✔ Predictable rendering

React Example
const user = usersById[post.userId];
Senior insight

Normalization minimizes:
Object identity changes → fewer re-renders.

# Virtualization
Rendering only visible list items instead of the entire list.

Example:
10,000 rows total
Only 20 rendered in DOM

Why it’s needed
Big lists cause:
Slow reconciliation
Layout cost
Memory pressure
Scroll jank

❌ Without virtualization
items.map(item => <Row key={item.id} />)
10k DOM nodes = performance collapse.

✅ With virtualization (react-window)
import { FixedSizeList as List } from "react-window";
<List
  height={500}
  itemCount={items.length}
  itemSize={40}
>
  {({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  )}
</List>
How it works internally
Tracks scroll position
Calculates visible range
Recycles DOM nodes

Senior-level considerations
Overscan
overscanCount={5}
Avoids blank areas during fast scrolling.

Stable heights
Variable heights = expensive recalculations.

Memoized row
const Row = React.memo(RowComponent);

Virtualization is often bigger performance win than memoization.


Performance priorities:
1. Render LESS (virtualization)
2. Update LESS (normalization)
3. Re-render LESS (memoization)
4. Compute LESS (useMemo)

# Profiler
Components Tab Features (07:02) — View full component tree hierarchy. Inspect/edit props & hooks live (great for testing). See hook values (numbered by default, but shows names if variables used). Jump to source code, search components, select DOM → find React component, log details to console, simulate Suspense loading states or Error Boundaries.
Components Tab Settings (13:45) — Customize theme/layout, parse hook names (can slow large apps), open in VS Code, filter out HOCs/DOM nodes, etc.
Profiler Tab Features (15:05) — Record performance over time (start/stop profiling). Shows flame charts, ranked slow components, render durations, commit phases, and exact reasons for re-renders (state/prop/parent/hook changes).
Profiler Tab Settings (18:06) — Record why components rendered, hide fast commits (<10ms), throttle CPU to simulate low-end devices, restart profiling from initial render.

| Content Type      | Strategy |
| ----------------- | -------- |
| Marketing / docs  | SSG      |
| Product listing   | ISR      |
| User dashboard    | SSR      |
| Personalized page | SSR      |

# Streaming
Streaming sends HTML in chunks instead of waiting for full render.

Without streaming:
Fetch → Render → Send HTML

With streaming:
Send shell → stream slow parts later

Improves:
TTFB
Perceived performance
Time to first paint

# Image Optimization

Serving images optimized for:
size
format
viewport
device resolution

Largest Contentful Paint (LCP) is usually images.

Common causes:
oversized images
wrong format
no lazy loading
layout shifts

✅ Optimized Example
import Image from "next/image";

<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  priority
  alt="Hero"
/>
Performance improvements
Automatic optimization provides:
WebP/AVIF conversion
responsive resizing
lazy loading
CDN caching

🚨 Senior mistakes
❌ Using <img> for large assets
❌ Unknown dimensions (layout shift)
❌ Loading huge desktop images on mobile


For feeds:
<Image loading="lazy" />

For hero:
priority
Only ONE priority image.

# Edge Rendering
Rendering happens at edge locations close to user.

Instead of:
India → US Server → Response

Edge:
India → Mumbai edge → Response
Example
export const runtime = "edge";

export default async function Page() {
  const data = await fetch(API_URL);
  return <UI data={await data.json()} />;
}
⚠ Why performance improves
Lower network RTT
Faster TTFB globally

🚨 Why it can be slower

Edge runtime limitations:
limited Node APIs
cold starts
database distance still exists

Use edge when:
✔ read-heavy pages
✔ geo-personalization
✔ middleware logic

Avoid when:
❌ heavy server compute
❌ DB far away from edge

# Server Components Performance (Big One)
React Server Components render on server and send serialized UI, not JS.
// Server Component (default)
export default async function ProductList() {
  const data = await fetchProducts();
  return <UI data={data} />;
}
🚀 Why performance is massive
Key reason:
NO client JS shipped.

Benefits:
lower bundle size
faster hydration
less JS parsing
lower memory

⚠ Why client components hurt performance
"use client";
This forces:
JS shipping
hydration
event wiring

Moving too much into client:
"use client"; // ❌ at top-level page
This kills RSC benefits.

Server → Client island architecture
// Server
<Page>
  <ProductList />     // server
  <FilterPanel />     // client
</Page>
Performance Flow
Server Components:
Fetch → Render → Stream HTML

Client Components:
Download JS → Parse → Hydrate
Move interactivity DOWN the tree.
| Type              | CPU Cost    | TTFB        | JS Cost | Best For     |
| ----------------- | ----------- | ----------- | ------- | ------------ |
| SSR               | High        | Medium      | Medium  | dynamic data |
| SSG               | Zero        | Fastest     | Low     | static       |
| ISR               | Low         | Fast        | Low     | semi-dynamic |
| Edge              | Low latency | Fast global | Same    | geo apps     |
| Server Components | Very low JS | Fast        | Lowest  | modern React |


# Hydration
Hydration = attaching React’s event system to already-rendered HTML sent from the server.

Flow:
Server:
React → HTML → Browser
Client:
Download JS → Parse → Execute → Attach listeners

Until hydration finishes:
UI looks interactive
but JS is NOT active yet

⚠ Why it becomes a bottleneck
Hydration runs on the main thread.
Main thread is also responsible for:
scrolling
input handling
paint/layout
animations
So hydration competes with user interactions.

Major causes (senior-level)
1) Too much client JS
"use client";
export default function Page() {
  return <HugeComponentTree />;
}
➡ Entire subtree must hydrate.

2) Deep interactive trees
Each component requires:
reconciliation
hook initialization
event binding

3) Large dependency graphs
import chartLibrary from "heavy-lib";
Now hydration waits for:
Download → Parse → Compile → Execute
4) Blocking hydration waterfalls
useEffect(() => {
  fetch("/api");
});
JS executes → network starts → UI delays.

🚨 Symptoms you see in real apps
UI freezes after load
scroll jank
delayed button clicks
high INP (Interaction to Next Paint)
long scripting tasks in DevTools

🧠 Prevention / Resolution
Strategy 1 — Reduce hydration surface
Bad:
"use client";
<Page />

Good:
<Page>
  <StaticContent />     {/* server */}
  <SearchBox />         {/* client */}
</Page>
Strategy 2 — Move logic server-side
Instead of:
useEffect(() => fetchData());

Do:
const data = await getData();
Strategy 3 — Lazy hydrate heavy components
const Chart = dynamic(() => import("./Chart"), {
  ssr: false,
});
Hydrates only when needed.
Strategy 4 — Split interactivity islands
Think:
Hydrate only what the user touches.
Hydration cost ≈ Amount of client JS × Component complexity

# Partial Hydration
Hydrating only specific parts of the page instead of the entire tree.
HTML rendered for whole page
↓
Only interactive islands get JS
⚠ Why it exists
Traditional React hydration:
All-or-nothing hydration
Even static areas receive JS overhead.
Partial hydration solves:
unnecessary parsing
memory usage
CPU blocking

🧠 How modern React achieves this
React itself doesn’t explicitly expose “partial hydration”.
Instead we achieve it via:

1) Server Components (default server)
2) Client boundaries
// Server component
<ProductPage>
  <ProductInfo />   {/* no hydration */}
  <BuyButton />     {/* hydration */}
</ProductPage>

Only BuyButton hydrates.
🚨 Bad implementation
"use client";

export default function Page() {
  return (
    <>
      <StaticHeader />
      <StaticBody />
    </>
  );
}
Even static parts hydrate → wasted CPU.

Partial hydration is basically:
Server Components + Client Islands
Real-world benefit
Large e-commerce page:
Without partial hydration:
Hydrate 200 components
With partial hydration:
Hydrate 12 interactive components
Massive CPU reduction.

# Server VS Client
| Factor        | Server | Client |
| ------------- | ------ | ------ |
| JS shipped    | ❌      | ✅      |
| Hydration     | ❌      | ✅      |
| Interactivity | ❌      | ✅      |
| Performance   | ⭐⭐⭐⭐⭐  | ⭐⭐     |
| Browser APIs  | ❌      | ✅      |
