TTFB vs Hydration Cost (frontend performance, clearly separated)
🕒 TTFB (Time To First Byte)

What it measures

Time from request sent → first byte of HTML received by the browser.

Where it happens

Server + network path

DNS lookup

TLS handshake

Server execution (SSR, DB calls, APIs)

CDN / Edge location

What affects TTFB

Server location (edge vs centralized server)

Backend execution time

Cold starts (Lambda, serverless)

Database latency

Cache hits/misses

Why it matters

Determines how fast the page starts appearing

Critical for SEO, Core Web Vitals (LCP indirectly)

Mental model

“How fast did the server start responding?”

⚙️ Hydration Cost

What it measures

Time the browser spends attaching JavaScript behavior to server-rendered HTML.

Where it happens

Client (browser main thread)

What affects hydration cost

Size of JS bundle

Number of React components

useEffect, event listeners

Heavy client-only logic

Hydration mismatches (extra work)

Why it matters

Determines when the page becomes interactive

Directly impacts INP / TTI

Mental model

“How long until the page actually works?”

🔁 Side-by-side comparison
Aspect	TTFB	Hydration Cost
Happens on	Server + Network	Browser
Triggered by	Initial request	JS execution
Affected by	Backend, DB, edge, cache	JS size, React tree
User sees	HTML appears	Page becomes interactive
Core metric	LCP (indirect)	INP / TTI
Fixed by	Edge SSR, caching	Code-splitting, islands
🧠 Important nuance (very common confusion)

Low TTFB ≠ fast app

Page loads quickly but feels frozen → high hydration cost

High TTFB but low hydration

Blank screen longer, but instant interactivity once loaded

Best UX = low TTFB + low hydration cost

🚀 Optimization strategies

Improve TTFB

Edge rendering

Server-side caching

Avoid blocking DB calls

ISR / pre-rendering

CDN usage

Reduce hydration cost

Move logic to Server Components

Code-splitting (dynamic import)

Partial hydration / islands

Avoid unnecessary use client

Reduce JS bundle size

🧩 One-line takeaway

TTFB controls when users see content.
Hydration cost controls when users can use it.