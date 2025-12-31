Next.js = React lifecycle + Rendering lifecycle (Server ↔ Client)

So:

Component lifecycle → React

Data fetching, routing, rendering timing → Next.js

1️⃣ Component Lifecycle (Same as React)

Inside a component, nothing changes.

useEffect(() => {
  console.log("Runs after paint on client");
}, []);


useState, useEffect, useMemo, useRef

Mount / Update / Unmount

Cleanup logic

All pure React, because **Next.js is built on top of **React.

📌 If you know React lifecycle → you already know component lifecycle in Next.js.

What Next.js Adds (Important Part)

Next.js introduces where and when rendering happens.

Rendering environments:

Server

Client

Build time

This is where lifecycle differs conceptually.

3️⃣ Server vs Client Lifecycle (Very Important)
❗ useEffect NEVER runs on server
useEffect(() => {
  console.log("Client only");
}, []);


This runs:

❌ NOT during SSR

❌ NOT during SSG

✅ Only after hydration in browser

Server-side render flow (SSR)
Request →
Server renders React →
HTML sent to browser →
Browser paints →
React hydrates →
useEffect runs


So lifecycle becomes two-phase:

Server render (no effects)

Client hydration + effects

4️⃣ Data Fetching Lifecycle (Next.js specific)

This is where Next.js extends React.

In App Router (Next 13+)
// Server Component (default)
async function Page() {
  const data = await fetch("https://api...");
  return <div>{data.title}</div>;
}


This runs:

On server

Before React lifecycle even begins on client

📌 This is NOT React lifecycle
📌 This is Next.js rendering lifecycle

Old Pages Router
Function	Runs where	When
getStaticProps	Server	Build time
getServerSideProps	Server	Per request
getInitialProps	Server + Client	Legacy

These happen before component render.

5️⃣ Hydration Lifecycle (Next.js specific)

After HTML arrives:

HTML → React attaches event listeners → state restored


This step is called hydration.

Common interview Q:

“Why does my click handler not work initially?”

Answer:

Because hydration hasn’t completed yet.

6️⃣ Routing Lifecycle (Next.js specific)

When navigating between pages:

Route change →
Fetch page bundle →
Render new page →
Unmount old page →
Mount new page


React lifecycles still apply:

Old page useEffect cleanup runs

New page useEffect mount runs

7️⃣ Server Components vs Client Components (App Router)

This is a huge distinction.

Server Component
// No "use client"
export default function Page() {
  console.log("Runs on server");
  return <div>Hello</div>;
}


Runs only on server

No state

No effects

No browser APIs

Client Component
"use client";

useEffect(() => {
  console.log("Client lifecycle");
}, []);


Full React lifecycle

State + effects

Browser APIs

📌 Lifecycle only exists in client components

8️⃣ Lifecycle Comparison Table (Interview Gold)
Area	React	Next.js
Component lifecycle	✅	✅ (same)
useEffect	Client only	Client only
Server rendering	❌	✅
Build-time rendering	❌	✅
Data fetching lifecycle	❌	✅
Routing lifecycle	Basic	Advanced
Server Components	❌	✅
9️⃣ Common Traps (Very Important)
❌ Accessing window on server
window.localStorage // ❌ crashes SSR


✅ Fix:

useEffect(() => {
  localStorage.getItem("x");
}, []);

❌ Assuming effect runs before HTML

Effects always run after paint.

10️⃣ Final One-Liner (Say This in Interviews)

Next.js does not replace React lifecycle. It wraps React with additional server, build-time, and routing lifecycles.

