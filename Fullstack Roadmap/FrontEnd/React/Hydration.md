# React & Next.js Hydration – Complete Guide

Hydration is a core concept when working with **Server-Side Rendering (SSR)** in React and frameworks like Next.js. This document explains hydration in simple terms, with examples, common pitfalls, and interview-focused explanations.

---

## What is Hydration?

**Hydration is the process where React attaches event listeners, state, and effects to HTML that was already rendered on the server.**

In short:
- Server sends **pre-rendered HTML**
- Browser displays it immediately
- React “hydrates” it to make it interactive

> Hydration does **not** recreate the DOM — it reuses the existing DOM.

---

## Why Hydration Exists

Without hydration (Client-Side Rendering only):
JS loads → React renders → DOM created → Page visible

With hydration (SSR / SSG):
HTML from server → Page visible immediately
JS loads → React hydrates → Page becomes interactive


Benefits:
- Faster First Contentful Paint (FCP)
- Better SEO
- Better perceived performance

---

## Hydration Mental Model

Think of it like this:

- Server builds the **static structure**
- Browser shows it instantly
- Hydration plugs in **interactivity**

> HTML is the body, hydration is the nervous system.

---

## Hydration in React (SSR)

When React is used with SSR:

### Server Side
```js
renderToString(<App />); // Generates HTML


#Client Side
hydrateRoot(document.getElementById("root"), <App />);
Key points:

React matches virtual DOM with existing DOM

Only event handlers and state are attached

DOM nodes are NOT recreated
Hydration in Next.js

Next.js handles hydration automatically.

Page Load Flow

Server renders HTML

Browser paints content immediately

JavaScript bundle loads

React hydrates the page

Page becomes interactive

You don’t manually call hydrateRoot in Next.js — it’s built in.

Example: Hydration in Action
export default function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
What Happens

Server Output
<button>Count: 0</button>
Before Hydration

Button visible

Click does nothing

After Hydration

onClick works

State updates

React controls UI

Hydration Mismatch (Very Important)
What is a Hydration Mismatch?

When server-rendered HTML does not match client-rendered HTML.

Example ❌  
<p>{Math.random()}</p>
Server: 0.25

Client: 0.89

React throws a hydration warning/error

Fixing Hydration Mismatch
Solution 1: Run client-only logic after mount
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;
Solution 2: Disable SSR for a component (Next.js)
import dynamic from "next/dynamic";

const ClientOnly = dynamic(() => import("./ClientOnly"), {
  ssr: false,
});

| Feature              | React (CSR) | React + SSR | Next.js  |
| -------------------- | ----------- | ----------- | -------- |
| Server-rendered HTML | ❌           | ✅           | ✅        |
| Hydration needed     | ❌           | ✅           | ✅        |
| SEO friendly         | ❌           | ✅           | ✅        |
| Setup                | Simple      | Manual      | Built-in |

Partial / Selective Hydration (Advanced – Next.js App Router)

Next.js supports Server Components and Client Components.

Server Component (No Hydration)
Partial / Selective Hydration (Advanced – Next.js App Router)

Next.js supports Server Components and Client Components.

Server Component (No Hydration)

Client Component (Hydrated)
"use client";

export default function Header() {
  return <button onClick={() => alert("Hi")}>Click</button>;
}

}
Benefits:

Smaller JS bundles

Faster load

Better performance

Performance & SEO Impact
Hydration enables:

Faster initial paint

Reduced bounce rate

Better Core Web Vitals

Search engine friendly pages

Interview One-Liner
Hydration is the process where React attaches event listeners and state to server-rendered HTML to make it interactive without recreating the DOM.

Common Interview Questions
Q: Does hydration re-render the DOM?
No. It reuses existing DOM nodes.

Q: Why does hydration fail?
When server and client output differ.

Q: Is hydration required for Server Components?
No. Only Client Components are hydrated.

Summary

Hydration = HTML + Interactivity

Used in SSR / SSG

Default in Next.js

Mismatch causes runtime errors

Partial hydration improves performance

Server → server calls:
No CORS
No TLS handshake from browser
Lower latency
Private network access