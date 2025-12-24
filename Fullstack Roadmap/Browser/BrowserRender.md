# 🌐 Browser Rendering Pipeline — Combined README

> **Purpose:** End-to-end understanding of how browsers render pages + how performance is measured
>
> **Audience:** Frontend, UI, Performance & Senior Engineer interviews

---

## 🧠 High-Level Mental Model

> "A browser loads resources over the network, builds DOM and CSSOM, creates a render tree, performs layout and paint, composites layers using the GPU, and we evaluate user experience using metrics like FCP, LCP, CLS, and TTI."

---

## 1️⃣ Network & Connection Setup

### What Happens

1. **DNS Lookup** → Domain → IP address
2. **TCP Handshake** → Reliable connection
3. **TLS Handshake** → Secure encrypted channel (HTTPS)
4. **HTTP Request / Response** → HTML received

### Why It Matters

* Each handshake adds latency
* Faster connections = faster rendering start

### Optimization Techniques

* Use **HTTP/2 / HTTP/3**
* Enable **TLS session resumption**
* Serve assets via **CDN**
* Preconnect critical origins

```html
<link rel="preconnect" href="https://cdn.example.com">
```

---

## 2️⃣ HTML Parsing → DOM

### What Happens

* Browser parses HTML top-to-bottom
* Builds the **DOM (Document Object Model)**
* Parsing pauses when blocking `<script>` tags are encountered

### Key Points

* DOM creation starts before full HTML download
* JavaScript can block DOM construction

### Optimization

* Use `defer` for scripts
* Avoid blocking inline scripts

```html
<script src="app.js" defer></script>
```

---

## 3️⃣ CSS Parsing → CSSOM

### What Happens

* CSS is parsed into **CSSOM**
* Browser must know final styles before layout

### Why CSS Is Render-Blocking

* Layout depends on CSS
* Render tree cannot be created without CSSOM

### Optimization

* Inline critical CSS
* Load non-critical CSS asynchronously

---

## 4️⃣ Render Tree Construction

### What Happens

* DOM + CSSOM → **Render Tree**
* Only **visible elements** are included

### Excluded Elements

* `display: none`
* `<head>`

> `visibility: hidden` is included (takes space)

---

## 5️⃣ Layout (Reflow)

### What Happens

* Browser calculates element size and position
* Geometry is determined

### Common Triggers

* DOM changes
* Changing `width`, `height`, `margin`, `padding`
* Reading layout values after writes

### Optimization

* Batch DOM updates
* Avoid layout thrashing
* Use `requestAnimationFrame`

---

## 6️⃣ Paint

### What Happens

* Browser fills pixels
* Colors, text, borders, shadows are drawn

### Cost Characteristics

* Cheaper than layout
* Still expensive if repeated often

### Optimization

* Avoid heavy visual effects
* Reduce repaint areas

---

## 7️⃣ Composite (GPU-Accelerated Step)

### What Happens

* Painted layers are assembled into the final frame
* GPU applies transforms and opacity
* No layout or repaint occurs

### GPU-Friendly Properties

* `transform`
* `opacity`

```css
.card {
  transition: transform 300ms ease;
}
```

### Notes

* Use `will-change` sparingly
* Too many layers increase GPU memory usage

---

# 📊 Web Performance Metrics

These metrics measure **perceived performance and usability**.

---

## FCP — First Contentful Paint

### What It Measures

Time when the **first visible content** appears (text, image, SVG, etc.).

### User Question

> “Is anything loading?”

### Influenced By

* TTFB
* Render-blocking CSS
* Blocking JavaScript

---

## LCP — Largest Contentful Paint

### What It Measures

Time when the **largest visible element** in the viewport finishes rendering.

### User Question

> “Is the main content ready?”

### Influenced By

* Large images / fonts
* JS execution before render
* CSS blocking

```html
<link rel="preload" as="image" href="hero.webp">
```

---

## CLS — Cumulative Layout Shift

### What It Measures

**Visual stability** — how much the layout shifts unexpectedly.

### Common Causes

* Images without dimensions
* Late font loading
* Injected content

```html
<img src="banner.jpg" width="400" height="300">
```

---

## TTI — Time to Interactive

### What It Measures

Time when the page becomes **fully interactive**.

### User Question

> “Can I actually use the page now?”

### Influenced By

* Heavy JavaScript
* Long main-thread tasks
* Third-party scripts

---

## 🔍 Metric Summary Table

| Metric | Measures              | User Perception      |
| ------ | --------------------- | -------------------- |
| FCP    | First visible content | Is anything loading? |
| LCP    | Main content rendered | Is the page ready?   |
| CLS    | Layout stability      | Is the page jumping? |
| TTI    | Interactivity         | Can I use the page?  |

---

## 🛠 Tools to Measure & Debug

* Chrome DevTools → Performance
* Lighthouse
* Web Vitals API

---

## 🎯 Interview One-Shot Summary

> "A browser renders a page by building the DOM and CSSOM, creating a render tree, performing layout and paint, and compositing layers using the GPU. Performance is evaluated using FCP, LCP, CLS, and TTI, which together measure loading speed, visual stability, and interactivity."

---

📌 *Use this README as a single source of truth for browser rendering and performance interviews*
