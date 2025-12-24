# ⚡ Browser Rendering Optimization — Interview Cheat Sheet

> **Purpose:** Quick revision before frontend / UI / performance interviews
>
> **Time to revise:** 5–7 minutes

---

## 🧠 Core Mental Model (Say This First)

> "I optimize rendering by reducing network latency, shortening the critical rendering path, minimizing layout and paint work, and leveraging GPU compositing."

---

## 1️⃣ Network & Connection Optimization

**Goal:** Faster Time To First Byte (TTFB)

### What to Do

* Use **HTTP/2 or HTTP/3**
* Enable **TLS session resumption**
* Serve static assets via **CDN**
* Preconnect critical domains

```html
<link rel="preconnect" href="https://cdn.example.com">
```

### Interview Line

> "Reducing TCP and TLS overhead improves initial load performance."

---

## 2️⃣ Critical Rendering Path (CRP)

**Goal:** Render meaningful content ASAP

### Reduce Render‑Blocking CSS

* Inline **critical CSS**
* Load non‑critical CSS asynchronously

```html
<link rel="preload" as="style" href="style.css" onload="this.rel='stylesheet'">
```

### Optimize JavaScript Loading

* Prefer `defer`
* Avoid blocking `<script>` tags

```html
<script src="app.js" defer></script>
```

### Interview Line

> "I minimize resources that block DOM and CSSOM construction."

---

## 3️⃣ Layout (Reflow) Optimization

**Goal:** Avoid expensive layout recalculations

### Common Reflow Triggers

* Changing `width`, `height`, `margin`, `padding`
* Reading layout values after DOM writes
* Frequent DOM mutations

### Best Practices

* Batch DOM updates
* Read first → write later
* Use `requestAnimationFrame`

```js
requestAnimationFrame(() => {
  el.style.transform = "translateX(20px)";
});
```

### Interview Line

> "I avoid layout thrashing by batching DOM reads and writes."

---

## 4️⃣ Paint Optimization

**Goal:** Reduce pixel redraw cost

### Tips

* Avoid heavy `box-shadow`, `blur`, large gradients
* Reduce overdraw
* Reuse painted layers when possible

### Interview Line

> "Paint is cheaper than layout, but still expensive if overused."

---

## 5️⃣ Composite & GPU Optimization (Very Important)

**Goal:** Skip layout & paint entirely

### GPU‑Friendly Properties

✅ `transform`
✅ `opacity`

```css
.card {
  transition: transform 300ms ease;
}
```

### Layer Promotion (Use Carefully)

```css
.card {
  will-change: transform;
}
```

⚠️ Overusing layers increases GPU memory usage

### Interview Line

> "Composite‑only animations are GPU‑accelerated and smoother."

---

## 6️⃣ Prevent Layout Shifts (CLS)

### Common Causes

* Images without dimensions
* Late font loading
* Injected dynamic content

### Fixes

```html
<img src="hero.jpg" width="400" height="300">
```

```css
font-display: swap;
```

### Interview Line

> "Preventing CLS improves visual stability and user experience."

---

## 7️⃣ Measure & Validate (Always Mention)

### Tools

* Chrome DevTools → Performance tab
* Lighthouse
* Web Vitals

### Metrics Interviewers Love

* **FCP** – First Contentful Paint
* **LCP** – Largest Contentful Paint
* **CLS** – Cumulative Layout Shift
* **TTI** – Time to Interactive

### Interview Line

> "I profile before and after changes to validate real improvements."

---

## 🔥 30‑Second Power Answer (Memorize)

> "I optimize browser rendering by reducing network latency, minimizing render‑blocking CSS and JavaScript, avoiding unnecessary reflows and paints, and using GPU‑accelerated compositing with transform and opacity. I validate improvements using Chrome DevTools and Web Vitals like LCP and CLS."

---

## 🧪 Rapid Follow‑Up Q&A

**Why is `transform` faster than `top`?**
→ It avoids layout and paint, working only at the composite stage.

**Why is CSS render‑blocking?**
→ Layout depends on knowing final styles.

**When should you avoid `will-change`?**
→ On static elements — it wastes GPU memory.

**How do you detect reflows?**
→ Chrome DevTools → Performance → Layout events.

# 📊 Web Performance Metrics — README

This document explains the most important web performance metrics used in
frontend interviews and real-world performance optimization.

---

## FCP — First Contentful Paint

### What it is
FCP measures the time when the browser renders the **first piece of visible
content** on the screen.

This content can be:
- Text
- Image
- SVG
- Canvas
- Non-white background

It answers the user question:
> “When does the user see something instead of a blank screen?”

---

### What affects FCP
- Server response time (TTFB)
- Render-blocking CSS
- Blocking JavaScript
- Large HTML payloads
- Slow font loading

---

### How to improve FCP
- Inline critical CSS
- Defer non-critical JavaScript
- Use CDN for faster asset delivery
- Reduce server latency

**Interview one-liner:**  
> “FCP measures how fast users see the first visible content.”

---

## LCP — Largest Contentful Paint

### What it is
LCP measures the time when the **largest visible element in the viewport**
finishes rendering.

This is usually:
- Hero image
- Large heading
- Banner image
- Video poster

It answers the user question:
> “When does the main content become visible?”

---

### What affects LCP
- Large images or videos
- Slow font loading
- Render-blocking CSS
- Heavy JavaScript execution before render
- Client-side rendering delays

---

### How to improve LCP
- Optimize and compress hero images
- Preload LCP-critical resources
- Reduce JavaScript blocking before render
- Use server-side rendering (SSR) or streaming

```html
<link rel="preload" as="image" href="hero.webp">

