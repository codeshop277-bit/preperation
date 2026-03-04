# Lighthouse Performance Analysis – Practical Walkthrough

This document summarizes a real-world performance analysis using **Chrome Lighthouse** on the CNN website. The goal is to understand how to interpret Lighthouse reports and identify performance bottlenecks like a senior frontend engineer.

---

# 1. Lighthouse Audit Setup

### Steps to Run Lighthouse

1. Open the target website
   Example: `https://edition.cnn.com`

2. Open Chrome DevTools

```
Right Click → Inspect
```

or

```
Ctrl + Shift + I
```

3. Open the **Lighthouse** tab.

4. Select configuration

* Device: **Mobile**
* Categories:

  * Performance
  * Accessibility
  * Best Practices
  * SEO

5. Click **Analyze page load**.

---

# 2. Initial Lighthouse Metrics

Observed metrics from the audit:

| Metric                         | Value   | Status         |
| ------------------------------ | ------- | -------------- |
| First Contentful Paint (FCP)   | 4.6s    | Slow           |
| Largest Contentful Paint (LCP) | 15.2s   | Very Slow      |
| Total Blocking Time (TBT)      | 4070 ms | Extremely High |
| Speed Index                    | 16.6s   | Slow           |
| Cumulative Layout Shift (CLS)  | 0.066   | Good           |

### Key Observation

Two major performance issues:

1. **Very high JavaScript blocking time**
2. **Delayed rendering of the LCP element**

---

# 3. LCP Breakdown Analysis

Lighthouse showed:

| Subpart              | Time      |
| -------------------- | --------- |
| Time to First Byte   | 40 ms     |
| Element Render Delay | 16,990 ms |

### Interpretation

```
Backend response is fast.
Rendering is delayed in the browser.
```

The LCP element is a **text headline**, not an image.

Therefore the delay is caused by:

* Heavy JavaScript execution
* Main thread blocking
* Third-party scripts

---

# 4. Total JavaScript Size

From Lighthouse Treemap:

```
Total JavaScript ≈ 7.7 MB
```

Typical optimized sites:

| Type          | JS Size    |
| ------------- | ---------- |
| Optimized SPA | 200–400 KB |
| Medium apps   | 400–800 KB |
| Heavy apps    | ~1.5 MB    |

The CNN page loads **far more JavaScript than recommended**.

---

# 5. Major JavaScript Bundles Identified

### UI Bundle

```
Size: ~3 MB
Contribution: 39%
```

Likely includes:

* UI components
* layout systems
* widgets
* tracking hooks

---

### Video Player Bundle

```
boltPlayer ≈ 617 KB
```

Loads even when users **do not watch videos**.

---

### Vendor Bundle

```
≈ 339 KB
```

Typically includes:

* React
* shared libraries
* utilities

---

# 6. Third-Party Scripts

Several external scripts were detected:

Examples:

* advertising scripts
* analytics
* A/B testing tools
* subscription services
* tracking scripts

Examples from the audit:

```
ads.score.min.js
doubleclick ads
zion-web-client
tiny-pass
optimizely
```

These scripts execute on the **main thread** and significantly increase blocking time.

---

# 7. Why Large JavaScript Causes Performance Issues

Every JavaScript file goes through this pipeline:

```
Download
↓
Parse
↓
Compile
↓
Execute
```

Approximate CPU cost:

```
1 MB JS ≈ 300–400 ms processing time
```

For a **7.7 MB bundle**, this can easily create **3–4 seconds of main thread blocking**, which matches the Lighthouse metric:

```
Total Blocking Time ≈ 4070 ms
```

---

# 8. Impact on LCP

The LCP element itself is simple text, but rendering is delayed because:

```
JavaScript blocks the main thread
↓
Browser cannot paint the DOM
↓
Headline appears late
```

This results in:

```
LCP ≈ 15 seconds
```

---

# 9. Recommended Performance Optimizations

If this were a React or Next.js application, the following improvements would help.

---

## Code Splitting

Split large bundles into smaller chunks.

Example:

```javascript
const Comments = React.lazy(() => import("./Comments"));
```

Load components **only when needed**.

---

## Dynamic Imports

Load modules conditionally.

Example:

```javascript
if (user.opensVideo) {
  import("./VideoPlayer");
}
```

---

## Lazy Loading Video Player

Avoid loading heavy media components initially.

Example:

```javascript
const VideoPlayer = dynamic(() => import("./VideoPlayer"), {
  ssr: false
});
```

---

## Defer Third-Party Scripts

Delay non-critical scripts until after the page becomes interactive.

Example (Next.js):

```javascript
<Script src="analytics.js" strategy="lazyOnload" />
```

---

## Tree Shaking

Import only required parts of libraries.

Bad:

```javascript
import _ from "lodash";
```

Good:

```javascript
import debounce from "lodash/debounce";
```

---

## Route-Based Code Splitting

Instead of loading all routes:

```
home
sports
politics
video
```

Load only the current route:

```
home
```

Other routes load on navigation.

---

# 10. Performance Debugging Workflow

A typical workflow used by frontend engineers:

```
1. Run Lighthouse audit
2. Identify worst metrics (LCP, TBT)
3. Inspect LCP element
4. Check JavaScript bundles (Treemap)
5. Analyze main thread blocking in Performance tab
6. Identify unused JavaScript using Coverage
7. Optimize bundles and scripts
8. Re-run Lighthouse
```

---

# 11. Key Takeaways

* The backend was **fast (TTFB 40ms)**.
* The main problem was **large JavaScript payload (7.7 MB)**.
* Heavy JavaScript caused **4 seconds of main thread blocking**.
* This delayed rendering and produced **15-second LCP**.
* Optimizations should focus on **reducing JavaScript execution and deferring non-critical scripts**.

---

# 12. Useful DevTools for Performance Analysis

Important tools for debugging frontend performance:

```
Lighthouse → performance metrics
Network → resource waterfall
Performance → CPU flame chart
Coverage → unused JavaScript
Bundle analyzer → dependency size
```

Mastering this workflow helps diagnose **real-world frontend performance issues in production applications**.
