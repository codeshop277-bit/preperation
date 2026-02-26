# Bundle Analysis & Optimization – Next.js (Hands-on Notes)

## 🎯 Goal

Understand why bundle size was large, learn how to analyze it, and isolate heavy dependencies (example: **framer-motion**) so they don’t affect initial load.

---

## 1️⃣ Setup Bundle Analyzer

Installed official Next.js bundle analyzer:

```bash
npm i -D @next/bundle-analyzer
```

### `next.config.js`

```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({});
```

### Run Analyzer

```bash
set ANALYZE=true && npm run build   # Windows
# OR
ANALYZE=true npm run build          # Mac/Linux
```

Analyzer output:

```
.next/analyze/
  ├─ client.html
  ├─ server.html
  └─ edge.html
```

Focus mainly on:

```
client.html
```

---

## 2️⃣ How to Read the Analyzer

### Tree Structure

```
Chunk
  → node_modules
     → package
        → files
```

### Meaning

* Bigger rectangle → larger JS size
* Hover shows:

  * Stat size
  * Parsed size (most important)
  * Gzipped size

### Important Understanding

Analyzer shows **all chunks**, not only initial load bundles.

---

## 3️⃣ Initial Observation

Large box found:

```
framer-motion/dist/es
proxy.mjs + 249 modules
```

Assumption:

> Framer Motion is loading in main bundle.

---

## 4️⃣ Investigation

### Route structure

```
src/app/animation/page.tsx
```

Initial code:

```js
"use client";
import { motion } from "framer-motion";
```

Key learning:

* Making `page.tsx` a client component can promote dependencies into shared chunks depending on client boundaries and import graph.

---

## 5️⃣ Refactor Done

### BEFORE (not ideal)

```
page.tsx (client)
  └─ framer-motion import
```

### AFTER (recommended pattern)

```
page.tsx (server)
  └─ AnimationClient.tsx ("use client")
       └─ framer-motion
```

Example:

#### `page.tsx` (Server)

```js
import AnimationClient from "./AnimationClient";

export default function Page() {
  return <AnimationClient />;
}
```

#### `AnimationClient.tsx`

```js
"use client";
import { motion } from "framer-motion";
```

---

## 6️⃣ Result After Rebuild

Analyzer shows:

```
static/chunks/286-xxxx.js
  └─ framer-motion
```

### Important Conclusion

✔ Framer Motion moved into its **own chunk**
✔ It is **NOT** inside main/shared chunk anymore
✔ Optimization worked

---

## 7️⃣ Key Realization (VERY IMPORTANT)

Seeing a large chunk in analyzer ≠ it loads initially.

To verify real behavior:

1. Open Chrome DevTools → Network tab
2. Hard refresh homepage
3. Check if framer-motion chunk loads

Expected:

* ❌ Not loaded initially
* ✔ Loaded only when visiting `/animation`

---

## 8️⃣ Core Learnings (Senior-Level)

### Rule 1 — App Router Strategy

```
Server components by default
Client components as small islands
```

---

### Rule 2 — Client Boundaries Matter

Bundle splitting depends on:

```
Import graph + client boundaries
```

NOT just folder structure.

---

### Rule 3 — Avoid Client Page Entry

Prefer:

```
page.tsx (server)
   ↓
Client component inside
```

instead of making whole page client.

---

### Rule 4 — Analyzer vs Initial Load

Analyzer shows:

```
All possible chunks
```

Real performance depends on:

```
What loads on first navigation
```

---

## 9️⃣ Current Status

* Bundle analyzer configured
* Understanding of chunks improved
* Framer Motion isolated into lazy chunk
* Initial bundle not affected by animation dependency

---

## 🔟 Optional Future Improvement

Framer Motion can be further optimized with:

```js
import { LazyMotion, domAnimation, m } from "framer-motion";
```

This reduces animation bundle size further.

---

## ⭐ Final Takeaway

> The most important optimization in Next.js App Router is controlling **where client boundaries start**.
> Heavy libraries must live inside small, route-level client components.
| Concept              | Next.js           | React App           |
| -------------------- | ----------------- | ------------------- |
| Prevent initial load | Client island     | React.lazy          |
| Route splitting      | Automatic         | React Router + lazy |
| Chunk separation     | Framework handles | You manage manually |
| Server components    | Yes               | ❌ No                |


//Can also use source map. Similar to bundle analysers