# 🧠 Senior Frontend Developer — Scenario-Based Interview Questions (2025)

> **For developers with 4–7 years of experience preparing for senior-level job switches.**
> Sourced from Reddit, Glassdoor, LinkedIn, Medium, and top frontend interview platforms.
> These are real-world, "how would you handle this?" questions — not textbook definitions.

---

## Table of Contents

1. [Performance & Optimization](#performance--optimization)
2. [State Management](#state-management)
3. [Architecture & System Design](#architecture--system-design)
4. [JavaScript & Async](#javascript--async)
5. [Accessibility & UX](#accessibility--ux)
6. [Security](#security)
7. [Testing & Debugging](#testing--debugging)
8. [Team & Process](#team--process)

---

## Performance & Optimization

---

### Q1. Your app takes 8 seconds to load on first visit. Walk me through how you'd diagnose and fix it.

**Why they ask this:** Tests your systematic debugging mindset and knowledge of the full performance stack.

**Answer:**

Start with measurement before guessing. Open Chrome DevTools → Network tab and Lighthouse. Look at:

- **Bundle size** — Is the JS bundle bloated? Use `webpack-bundle-analyzer` or Vite's rollup visualizer.
- **Critical render path** — Is there render-blocking CSS or JS in `<head>`?
- **Waterfall** — Are there sequential API calls that could be parallelized?
- **Images** — Are large, uncompressed images being loaded eagerly?

**Fix in layers:**
1. **Code splitting** — Use `React.lazy()` + `Suspense` to split routes. Only load what's needed.
2. **Tree shaking** — Ensure unused imports are eliminated (check if your bundler is doing this).
3. **Image optimization** — Switch to WebP/AVIF, add `loading="lazy"` for below-fold images, use `srcset` for responsive delivery.
4. **Compression** — Enable Brotli or gzip on your server/CDN.
5. **CDN** — Serve static assets from a CDN geographically close to users.
6. **Preload critical assets** — Use `<link rel="preload">` for fonts and hero images.
7. **Defer non-critical scripts** — Add `defer` or `async` to non-essential JS.

**Senior signal:** Mention Core Web Vitals (LCP, FID/INP, CLS) as your measurement targets, not just "load time."

---

### Q2. A product manager reports that the feed page feels "janky" on scroll. How do you find and fix it?

**Why they ask this:** Tests your understanding of browser rendering and how JS interacts with the paint pipeline.

**Answer:**

Open Chrome DevTools → **Performance** tab. Record a scroll session and look for:

- **Long tasks** (red bars > 50ms) — these block the main thread.
- **Layout thrashing** — forced synchronous layouts caused by reading and writing DOM properties in rapid succession (e.g., reading `offsetHeight` then setting `style.height` in a loop).
- **Paint storms** — excessive repaint areas shown in the "Rendering" overlay.

**Common culprits and fixes:**
- **Unvirtualized long lists** — Render only what's visible using `react-window` or `react-virtual`. A list of 5,000 items should have ~15–20 DOM nodes at any time.
- **Scroll event listeners without throttle/debounce** — Replace with `IntersectionObserver` which runs off the main thread.
- **CSS `box-shadow` / `filter` on scrolled elements** — These trigger repaint on every frame. Prefer `transform` and `opacity` which only trigger compositing.
- **`position: fixed` elements** — Can cause repaints. Use `will-change: transform` to promote to its own compositor layer.

**Senior signal:** Mention the difference between Layout → Paint → Composite stages. Fixes that stay in the Composite stage (transform, opacity) are the most efficient.

---

### Q3. You're asked to build a component that displays a list of 100,000 rows. What's your approach?

**Why they ask this:** Classic virtualization question — tests practical knowledge of rendering at scale.

**Answer:**

Never render 100,000 DOM nodes. The browser will collapse. The solution is **virtual scrolling** (a.k.a. windowing).

**How it works:** Only the rows visible in the viewport (+ a small buffer) are rendered in the DOM. As the user scrolls, rows outside the view are unmounted and new ones are mounted — but the scroll position is maintained by setting the container's total height.

**Implementation options:**
- `react-window` — Lightweight, great for fixed-height rows.
- `react-virtual` (TanStack) — More flexible, handles dynamic heights.
- `@tanstack/virtual` — Framework-agnostic, the current gold standard.

**Beyond virtualization:**
- **Pagination/cursor-based loading** — Don't fetch 100k records at once. Load in batches of 50–100 as the user scrolls (infinite scroll pattern).
- **Memoization** — Use `React.memo` on row components so unchanged rows don't re-render.
- **Web Workers** — If sorting/filtering 100k records, offload that computation off the main thread.

**Senior signal:** Mention that virtualization breaks accessibility (screen readers need full DOM context) and you'd add a fallback like a "Load more" button for AT users.

---

### Q4. After a new deploy, your LCP went from 1.8s to 4.5s. How do you investigate?

**Why they ask this:** Tests real-world observability, regression detection, and rollback thinking.

**Answer:**

First, **don't panic — roll back** if users are impacted while you investigate.

Investigation steps:
1. **Compare bundles** — Use `webpack-bundle-analyzer` or a bundle diff tool between the two deploys.
2. **Check the LCP element** — Use DevTools to identify what element is the "Largest Contentful Paint." Was a large image added to the hero? Did a font load change?
3. **Check network waterfall** — Is a new API call blocking rendering? Was a lazy-loaded chunk accidentally included in the critical path?
4. **Check render-blocking resources** — Did a new CSS file get added to `<head>` without `media` attribute?
5. **Check image format/size** — Did someone accidentally push an uncompressed PNG where there was a WebP before?

**Prevention:**
- Set up a **Lighthouse CI** or **Web Vitals monitoring** (e.g., via Sentry, Datadog, or `web-vitals` library) to catch regressions before they hit production.
- Add **performance budgets** to your CI pipeline.

---

### Q5. How would you implement infinite scroll in a news feed without killing performance or accessibility?

**Why they ask this:** Tests knowledge of IntersectionObserver, pagination, and a11y edge cases.

**Answer:**

**The approach:**
1. Use `IntersectionObserver` to detect when a sentinel element (a div at the bottom of the list) enters the viewport.
2. When triggered, fetch the next page using cursor-based pagination.
3. Append new items to the list. Avoid full re-renders using keys and memoization.

```js
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) fetchNextPage();
}, { threshold: 0.1 });

observer.observe(sentinelRef.current);
```

**Performance:**
- Virtualize the rendered list with `react-virtual` so old items are unmounted.
- Debounce the fetch trigger to avoid double-fires.
- Show skeleton loaders while fetching.

**Accessibility (the part most devs miss):**
- Add a visible **"Load more" button** as a fallback for keyboard/screen-reader users — infinite scroll is notoriously bad for AT.
- Announce new content with an `aria-live="polite"` region: "12 new articles loaded."
- Manage focus — don't steal focus when new items load.

**Senior signal:** Knowing that Google recommends against pure infinite scroll for paginated content (it breaks browser back/forward navigation) and suggesting `history.pushState` to update the URL with the current page.

---

## State Management

---

### Q6. You're joining a large React app that uses Redux everywhere — even for things like modal open/close state. How do you handle this?

**Why they ask this:** Tests your opinionated but reasoned view on state management and your ability to improve a codebase without burning it down.

**Answer:**

This is a "right tool for the job" problem. Redux isn't wrong — it's just overused here.

**The mental model for choosing state location:**
- **UI state** (modal open, tab selected, tooltip visible) → `useState` or `useReducer` locally.
- **Server/async state** (data fetched from APIs) → `React Query` or `SWR`. These eliminate the need for Redux async patterns entirely.
- **Shared client state** (current user, cart, theme) → Context API or Zustand.
- **Complex shared app state** (multi-step forms, undo/redo) → Redux Toolkit.

**What I'd do:**
1. Audit the store — categorize what's in Redux.
2. Migrate server state to React Query (biggest win — removes all the fetch/loading/error boilerplate).
3. Move local UI state to component state.
4. What remains in Redux is what actually belongs there.

Do this incrementally, never as a big-bang rewrite.

---

### Q7. How do you prevent excessive re-renders in a React app with complex shared state?

**Why they ask this:** Tests React internals knowledge and practical optimization skills.

**Answer:**

Re-renders happen when state or props change. The goal is to make sure only the components that *need* to re-render actually do.

**Techniques:**
- **Split contexts** — A single `AppContext` with 20 fields means every consumer re-renders on any change. Split into `UserContext`, `ThemeContext`, `CartContext`.
- **`React.memo`** — Wrap components that receive the same props frequently.
- **`useMemo` / `useCallback`** — Stabilize derived values and function references passed as props.
- **Zustand with selectors** — Components only re-render when the specific slice they subscribe to changes.
- **State colocation** — If only one component uses the state, keep it there. Don't hoist unnecessarily.

**Profiling first:**
Use React DevTools Profiler to see which components are rendering and why. Look for components rendering with no prop/state change — those are the targets.

**Senior signal:** Mention that premature optimization is a trap. Profile first, optimize second. `React.memo` everywhere without measuring causes more problems than it solves.

---

### Q8. Your app has a multi-step form with 6 steps and complex validation. How do you architect the state?

**Why they ask this:** Tests ability to reason about form state architecture at scale.

**Answer:**

**Option 1: Local state in a parent wrapper component**
Keep all form data in a parent `useReducer`. Each step receives its slice of state as props and dispatches actions. Simple, no library needed.

**Option 2: React Hook Form (preferred)**
RHF is uncontrolled by default — inputs only update the form state on blur/submit, not every keystroke. This is dramatically better for performance on large forms.

```js
const { register, handleSubmit, watch, trigger } = useForm();
```

Use `watch` to observe field values for conditional logic between steps. Use `trigger` for per-step validation before advancing.

**Option 3: Zustand/Context for persisted draft**
If users can close the browser and return to the form later, persist state to `localStorage` via Zustand's `persist` middleware.

**Architecture considerations:**
- Validate each step independently before allowing navigation to the next.
- Show a step indicator with completed/active/remaining states.
- Handle dirty state — warn users before navigating away with unsaved data (`useBeforeUnload`).

---

## Architecture & System Design

---

### Q9. How would you architect a micro-frontend system for a large enterprise app with 5 teams?

**Why they ask this:** Tests system-level thinking for large-scale frontend codebases.

**Answer:**

Micro-frontends let each team own and deploy their section of the app independently.

**Two main approaches:**

**1. Module Federation (Webpack 5)**
Each team's app exposes components/modules that are consumed at runtime by a shell app. No shared code at build time — each team deploys their own bundle.

**2. Single-SPA**
An orchestration framework that lets you mount/unmount multiple framework apps (React, Vue, Angular) under one shell.

**Key decisions to make:**
- **Routing** — Who owns routing? Usually the shell app handles top-level routes.
- **Shared dependencies** — React, design system components. Module Federation handles this with `shared: { react: { singleton: true } }`.
- **Communication** — Use Custom Events or a shared event bus. Avoid direct imports between micro-frontends.
- **Authentication** — Shell handles auth, passes tokens via context or URL params.
- **Design system** — Centralized in a shared package with its own versioning.

**Trade-offs to acknowledge:**
- Increased complexity in CI/CD.
- Version mismatch risks.
- Bundle duplication if `shared` config is wrong.
- Performance — multiple separate bundles add HTTP overhead.

---

### Q10. When would you choose SSR, CSR, or SSG for a new project?

**Why they ask this:** Tests rendering architecture knowledge — a key senior-level decision.

**Answer:**

| Strategy | Use When |
|---|---|
| **CSR** | Auth-protected dashboards, no SEO needed, rich interactivity |
| **SSR** | Public pages needing SEO, personalized content per request |
| **SSG** | Marketing pages, blogs, docs — content changes infrequently |
| **ISR** | E-commerce product pages — mostly static but needs periodic freshness |

**Real-world examples:**
- A **banking dashboard** → CSR. It's behind auth, no SEO, needs fast client-side updates.
- A **product landing page** → SSG. Blazing fast, CDN-cached, never changes.
- A **news website** → SSR or ISR. Needs fresh content and good SEO.
- A **social feed** → SSR for first load (SEO + fast FCP), then CSR for interactions.

**Senior signal:** Mention hydration cost — SSR sends HTML that React then "hydrates" with JS. Heavy SSR + large JS bundles can cause TTI to be worse than pure CSR. React Server Components (RSC) in Next.js 13+ solve this by shipping zero JS for server components.

---

### Q11. You're asked to design an autocomplete/typeahead search component. Walk me through your approach.

**Why they ask this:** A classic system design question that touches debouncing, caching, accessibility, and API design.

**Answer:**

**User experience requirements first:**
- Show suggestions after 2+ characters.
- Respond within 200ms (perceived).
- Support keyboard navigation (↑ ↓ Enter Escape).
- Screen reader accessible.

**Frontend implementation:**
1. **Debounce input** — Wait 300ms after the user stops typing before firing the API call.
2. **Cancel in-flight requests** — Use `AbortController` to cancel the previous request when a new one fires.
3. **Client-side cache** — Cache results by query string. If the user retypes a previous query, use the cached result instantly.
4. **Loading/empty/error states** — Show a spinner, "No results found," and "Something went wrong" respectively.

**Accessibility:**
- Use `role="combobox"` on the input, `role="listbox"` on the dropdown, `role="option"` on each item.
- Set `aria-expanded`, `aria-activedescendant`, `aria-autocomplete="list"`.
- Support keyboard navigation and close on Escape.

**Performance:**
- Virtualize the list if results can be > 50 items.
- Consider server-side caching at the API level (Redis) for popular queries.

---

### Q12. How would you design a real-time dashboard that displays live data for thousands of concurrent users?

**Why they ask this:** Tests knowledge of WebSockets, SSE, state update patterns, and performance under load.

**Answer:**

**Data transport choice:**
- **WebSockets** — Full duplex, good for bidirectional data (chat, collaborative tools).
- **SSE (Server-Sent Events)** — Server → client only, simpler, automatically reconnects, works over HTTP/2. Great for dashboards.
- **Polling** — Last resort. Use only when WebSockets/SSE aren't available.

For a dashboard, **SSE is usually the right choice** — the client doesn't need to push data back.

**Frontend architecture:**
1. Connect to SSE endpoint on mount. Clean up on unmount.
2. Incoming events update a normalized state store (Zustand or Redux).
3. Use React's `useDeferredValue` or batch updates to prevent render storms from rapid data bursts.
4. **Throttle renders** — Don't re-render on every event. Buffer updates and apply them every 100–200ms.

**Scalability considerations:**
- Show a "Last updated" timestamp so users know the data is live.
- Handle disconnection gracefully — show a banner "Reconnecting..." and retry with exponential backoff.
- For very high-frequency data (e.g., stock tickers), consider showing only the latest value, not every update.

---

## JavaScript & Async

---

### Q13. You have an API that sometimes fails. How do you implement retry logic with exponential backoff?

**Why they ask this:** Tests async patterns and resilience thinking.

**Answer:**

Exponential backoff means waiting progressively longer between retries: 1s → 2s → 4s → 8s. This prevents hammering a struggling server.

```js
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    if (retries === 0) throw err;
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(url, options, retries - 1, delay * 2);
  }
}
```

**Production additions:**
- **Jitter** — Add random variance to the delay (`delay * 2 + Math.random() * 1000`) to prevent thundering herd — all clients retrying at the exact same time.
- **Retry only on specific errors** — Don't retry 4xx errors (client's fault). Only retry 5xx (server error) and network failures.
- **Max timeout** — Cap the backoff at e.g. 30 seconds.

Libraries like `axios-retry` or React Query's built-in retry handle this for you in most apps.

---

### Q14. How do you cancel API calls when a user navigates away or a component unmounts?

**Why they ask this:** Tests cleanup patterns and avoidance of memory leaks / race conditions.

**Answer:**

The problem: user visits a page, triggers a fetch, then navigates away. The fetch resolves and tries to set state on an unmounted component → memory leak and potential stale data shown.

**Solution: `AbortController`**

```js
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => {
      if (err.name === 'AbortError') return; // Expected, ignore it
      setError(err);
    });

  return () => controller.abort(); // Cleanup on unmount
}, []);
```

**With React Query:** This is handled automatically. React Query cancels in-flight queries when a component unmounts.

**Race condition prevention:** If the same component fires multiple requests (e.g., typeahead), abort the previous request's controller before creating a new one.

---

### Q15. Explain the difference between debounce and throttle. When would you use each?

**Why they ask this:** Practical question — directly applicable to scroll handlers, search inputs, resize handlers.

**Answer:**

**Debounce:** Executes the function only after the user *stops* triggering the event for X milliseconds.
→ Use for **search inputs**, **form autosave**. You want to wait until they're done typing.

**Throttle:** Executes the function at most once every X milliseconds, no matter how often the event fires.
→ Use for **scroll handlers**, **window resize**, **mouse move**. You want to fire regularly but not on every single pixel.

```js
// Debounce — fires 300ms after last keystroke
const handleSearch = debounce((query) => fetchResults(query), 300);

// Throttle — fires at most once every 100ms during scroll
const handleScroll = throttle(() => updateScrollPosition(), 100);
```

**Modern alternative:** For scroll, prefer `IntersectionObserver` and `ResizeObserver` — they run off the main thread and are more performant than scroll/resize event listeners with throttle.

---

### Q16. How do you handle a situation where multiple components need data from the same expensive API call?

**Why they ask this:** Tests knowledge of data fetching deduplication and caching patterns.

**Answer:**

If three components each call `fetch('/api/user')` independently, you get three identical network requests. The fix: **deduplication and caching**.

**React Query (recommended approach):**
```js
// In any component — React Query deduplicates automatically
const { data } = useQuery({ queryKey: ['user'], queryFn: fetchUser });
```

If 10 components call `useQuery(['user'])`, React Query fires the network request exactly once and shares the cached result.

**Manual approach (without a library):**
- Create a singleton fetch promise per key. If a request for that key is in-flight, return the same promise.
- Store the result in a shared cache (context, Zustand).

**Senior signal:** Explain `staleTime` vs `cacheTime` in React Query — `staleTime` determines how long cached data is considered fresh (no refetch), `cacheTime` determines how long unused data stays in memory.

---

## Accessibility & UX

---

### Q17. A user reports that they can't use your modal with a keyboard. How do you fix it?

**Why they ask this:** Accessibility is increasingly a senior-level expectation, not a junior checkbox.

**Answer:**

A fully accessible modal requires:

**1. Focus trap** — When the modal opens, focus must be locked inside it. Tab should cycle through only the modal's interactive elements. Use `focus-trap-react` or implement manually by listening to `keydown` on Tab.

**2. Initial focus** — Move focus to the modal's first focusable element (or the modal heading/close button) on open.

**3. Return focus** — When the modal closes, return focus to the element that triggered it (e.g., the button that opened it).

**4. Escape key** — Close the modal when Escape is pressed.

**5. ARIA attributes:**
```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Confirm Delete</h2>
  ...
</div>
```

**6. Background scroll lock** — Prevent the page behind the modal from scrolling (`overflow: hidden` on body).

**7. Background inert** — Use `inert` attribute on the page content behind the modal so screen readers don't "see" it.

---

### Q18. The designer gives you a beautiful animation concept that involves animating 200 items simultaneously. How do you respond?

**Why they ask this:** Tests your ability to balance design intent with performance reality, and your communication skills.

**Answer:**

I wouldn't say "no" outright — I'd start a conversation.

**Step 1: Understand the intent.** What feeling is the animation trying to create? Often there's a simpler approach that achieves the same emotional effect.

**Step 2: Prototype and measure.** Build a quick proof of concept and profile it on a mid-range device (not your M3 MacBook). Chrome DevTools → Performance tab → look for frame drops below 60fps.

**Step 3: Suggest alternatives if needed:**
- Animate items in **staggered groups** instead of all at once (e.g., 5 items every 50ms).
- Use **CSS animations** with `transform` and `opacity` only — these run on the compositor thread and don't block the main thread.
- Use `will-change: transform` to promote elements to GPU layers before animation starts.
- Consider **FLIP animations** (First, Last, Invert, Play) for layout transitions — very performant.
- Reduce motion for users who prefer it: `@media (prefers-reduced-motion: reduce)`.

**Step 4: Present the options** with visual demos and let the designer and PM make an informed decision.

---

### Q19. How would you ensure a form you've built is fully accessible?

**Why they ask this:** Forms are one of the most WCAG-sensitive UI patterns.

**Answer:**

- **Labels** — Every input has a visible `<label>` with a matching `for`/`id`. Never rely on `placeholder` alone as a label.
- **Error messages** — Shown inline near the field. Associated with the input via `aria-describedby`. Don't use only color to signal errors.
- **Required fields** — Use `aria-required="true"` or the native `required` attribute.
- **Focus order** — Tab order follows the visual reading order. Don't use `tabindex > 0`.
- **Error announcement** — Use `aria-live="assertive"` for error regions so screen readers announce them immediately on submit.
- **Fieldsets and legends** — Group related fields (e.g., radio groups, address fields) in `<fieldset>` with `<legend>`.
- **Autocomplete** — Use `autocomplete` attributes (`name`, `email`, `tel`) so password managers and AT can help users.
- **Testing** — Run `axe-core` or Deque's browser extension, then test manually with NVDA (Windows) or VoiceOver (macOS).

---

## Security

---

### Q20. How do you protect a React app from XSS attacks?

**Why they ask this:** Security is a blind spot for many frontend devs — showing you know it signals seniority.

**Answer:**

XSS (Cross-Site Scripting) happens when malicious JS gets injected into your page and executed. React's JSX escapes output by default — `{userInput}` will never execute scripts. The danger comes when you break this.

**Common vulnerabilities and fixes:**

1. **`dangerouslySetInnerHTML`** — Only use when absolutely necessary (e.g., CMS content). Always sanitize with `DOMPurify` first:
   ```js
   <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlString) }} />
   ```

2. **URL injection** — Never do `<a href={userInput}>`. Validate that the URL starts with `https://` or `mailto:`.

3. **`eval()` / `new Function()`** — Never use with user-provided strings.

4. **Markdown renderers** — Libraries like `marked` can execute scripts. Use a sanitizer after rendering.

**Additional layers:**
- **Content Security Policy (CSP)** — HTTP header that whitelists which scripts are allowed to run. Prevents inline scripts and unauthorized script sources.
- **HttpOnly cookies** — Store auth tokens in HttpOnly cookies, not `localStorage`. XSS can't steal HttpOnly cookies via JS.

---

### Q21. How do you handle authentication and token storage securely in a frontend app?

**Why they ask this:** One of the most asked security questions in senior frontend interviews (from Glassdoor/Reddit data).

**Answer:**

The key debate: **`localStorage` vs. `HttpOnly cookies`.**

**`localStorage` — Easy but risky:**
- Accessible to any JS on the page.
- If you have an XSS vulnerability, attackers steal the token.
- Never use for high-security apps.

**`HttpOnly cookies` — Recommended:**
- The browser sends them automatically with every request.
- Inaccessible to JavaScript (even in XSS scenarios).
- Set `Secure` flag (HTTPS only) and `SameSite=Strict` or `Lax` (prevents CSRF).

**Token refresh strategy:**
- Store access token in memory (JS variable). Short-lived (15 min).
- Store refresh token in HttpOnly cookie. Longer-lived.
- On page reload, silently call `/refresh` endpoint to get a new access token.
- Use an Axios interceptor to attach the access token to every request and handle 401s by triggering a refresh.

**Logout:** Clear in-memory token + call a server endpoint to invalidate the refresh token.

---

## Testing & Debugging

---

### Q22. Your QA team reports a bug that only happens in production, not locally. How do you debug it?

**Why they ask this:** Real-world debugging scenario — tests your systematic approach.

**Answer:**

"Works locally, broken in production" is a classic. Common causes:

1. **Environment variables** — Is a production API key, endpoint, or feature flag different? Check `.env.production` vs `.env.local`.
2. **Build vs. dev differences** — Minification in production can expose bugs hidden in development. Check if the issue is in a minified code path.
3. **Different data** — Production has real user data. The bug might only trigger with specific data shapes. Try to replicate with a production-like dataset.
4. **Browser/OS differences** — Is it device-specific? Collect the user's browser and OS. Test on BrowserStack.
5. **Race conditions** — Production is faster/slower in unexpected ways. A race condition in async code may only appear under real network conditions.

**Debugging tools:**
- Add **error logging** (Sentry/Datadog) with breadcrumbs so you can see what led up to the crash.
- Use **source maps** in production (uploaded to Sentry but not publicly served) so you get readable stack traces.
- **Feature flags** — If possible, reproduce the issue in a staging environment with production data.

---

### Q23. How do you approach testing a complex React component?

**Why they ask this:** Tests your philosophy on testing and practical tool knowledge.

**Answer:**

I follow the testing trophy (Kent C. Dodds):
- Most value from **integration tests**.
- Some unit tests for pure logic/utilities.
- A few E2E tests for critical paths.

**For a complex React component (e.g., a data table with sorting, filtering, pagination):**

**Integration tests with React Testing Library:**
```js
test('filters rows when search input changes', async () => {
  render(<DataTable data={mockData} />);
  await userEvent.type(screen.getByRole('searchbox'), 'Alice');
  expect(screen.getAllByRole('row')).toHaveLength(2); // header + 1 match
});
```

RTL encourages testing user behavior, not implementation. Don't test state directly — test what the user sees.

**What to test:**
- Rendering with edge cases (empty data, loading, error state).
- User interactions (click, type, keyboard nav).
- Accessibility (use `@testing-library/jest-dom` matchers like `toBeVisible`, `toHaveAccessibleName`).

**What not to test:**
- Internal implementation details (component state, private methods).
- Third-party library internals.

---

### Q24. How do you detect and fix a memory leak in a React application?

**Why they ask this:** Memory leaks are a common senior-level issue, especially in SPAs.

**Answer:**

**Common causes:**
1. Setting state after component unmounts (covered with AbortController cleanup).
2. `setInterval` or `setTimeout` not cleared in `useEffect` cleanup.
3. `addEventListener` not removed on unmount.
4. Holding references to large objects in closures.
5. Third-party libraries that don't clean up subscriptions.

**Detection:**
- Open Chrome DevTools → **Memory** tab.
- Take a heap snapshot. Perform the action you suspect is leaking. Take another snapshot.
- Compare snapshots — look for objects that are growing in count.
- Use the **Allocation instrumentation on timeline** to see what's being allocated over time.

**Fix pattern — always clean up in `useEffect`:**
```js
useEffect(() => {
  const interval = setInterval(fetchData, 5000);
  window.addEventListener('resize', handleResize);

  return () => {
    clearInterval(interval);
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

---

## Team & Process

---

### Q25. You're tasked with refactoring a large, undocumented legacy codebase. How do you approach it?

**Why they ask this:** Seniority is measured by how you handle messy real-world situations, not greenfield projects.

**Answer:**

**Never rewrite from scratch.** This is almost always a mistake — the legacy code has years of bug fixes and business logic baked in.

**Strangler Fig pattern:**
Gradually replace pieces of the old system with new ones. The new code "strangles" the old code over time.

**My approach:**
1. **Understand before touching** — Read the code, run it, map out the data flows. Create a dependency graph.
2. **Add tests to existing behavior** — Before changing anything, write characterization tests that document current behavior (even if the behavior is wrong). These are your safety net.
3. **Identify high-ROI targets** — Which parts are changed most often? Which parts have the most bugs? Start there.
4. **Refactor in small, reviewable PRs** — Never a 10,000-line refactor PR. Small, atomic changes that can be code reviewed and rolled back independently.
5. **Improve incrementally** — Introduce TypeScript file by file. Introduce components to a template-based system module by module.

---

### Q26. How do you approach a design handoff where the designer's concept isn't technically feasible within the timeline?

**Why they ask this:** Tests cross-functional communication and your ability to negotiate scope.

**Answer:**

This is a communication challenge as much as a technical one.

**My approach:**
1. **Don't just say "no"** — Understand the design intent first. What problem is this visual trying to solve? What feeling should it evoke?
2. **Build a prototype quickly** — Show, don't just tell. A quick demo of the performance implications is more persuasive than "that'll be slow."
3. **Offer tiered alternatives:**
   - **Now (this sprint):** A simplified version that hits 80% of the design intent with 20% of the effort.
   - **Next sprint:** The full design if we allocate more time.
   - **Never:** Explain what's browser-limited (e.g., certain scroll-linked animations on iOS).
4. **Involve the designer in the decision** — They often have flexibility they don't advertise. Show them the trade-offs and let them choose.

---

### Q27. You're asked to introduce a design system from scratch for a team of 10 frontend engineers. Where do you start?

**Why they ask this:** Tests architectural thinking and leadership at scale.

**Answer:**

A design system is a product — it needs the same rigor as any product.

**Phase 1: Foundation**
- Define design tokens (colors, spacing, typography, shadows) in a shared format (CSS custom properties or Style Dictionary).
- Agree on naming conventions.
- Set up a component library repo (monorepo with Nx or Turborepo).

**Phase 2: Core components**
- Build the highest-traffic components first: Button, Input, Modal, Typography, Card.
- Use Storybook as the living documentation.
- Write accessibility tests into every component from day one.

**Phase 3: Distribution**
- Publish as an internal npm package.
- Set up a Chromatic (visual regression testing) pipeline to catch unintended visual changes.
- Create a versioning and breaking change policy.

**Phase 4: Governance**
- Assign a design system team (even part-time).
- Create a contribution guide — how can other teams add components?
- Monthly review of open issues and adoption metrics.

**Senior signal:** Mention that a design system is only useful if teams adopt it. Developer experience (DX) of the library matters as much as the components themselves. Good docs, good TypeScript types, good error messages.

---

### Q28. How do you manage technical debt without stopping feature delivery?

**Why they ask this:** Every senior dev deals with this — tests your pragmatism and communication.

**Answer:**

Technical debt is a business conversation, not just an engineering one.

**My approach:**
1. **Make it visible** — Maintain a "debt register" (a doc or Notion board) that categorizes debt by severity and area. This turns abstract grumbling into a prioritized backlog item.
2. **The boy scout rule** — Leave the code a little better than you found it. If you're touching a file for a feature, clean up small things while you're there. No big refactor needed.
3. **Negotiate debt budget** — Work with the PM to allocate 20% of sprint capacity to tech debt consistently. Framing: "This makes future features 30% faster to ship."
4. **Attach debt to feature work** — "We need to refactor the form system before we can build the feature you want." This makes debt tangible and business-relevant.
5. **Prioritize by impact** — Fix debt in the hottest code paths first. Debt in a module nobody touches is low priority.

---

### Q29. How do you handle a situation where a production bug is affecting 10% of users and needs to be fixed urgently?

**Why they ask this:** Tests crisis response, communication, and decision-making under pressure.

**Answer:**

**Immediate (first 15 minutes):**
1. **Assess impact** — How many users? Is it data loss or just visual? Can users work around it?
2. **Communicate** — Notify stakeholders immediately. Even "We're investigating" is better than silence.
3. **Can we roll back?** — If the bug was introduced in the last deploy, roll back first, investigate second. Always prefer "slow and correct" over "fast and broken."

**Investigation:**
4. Check error monitoring (Sentry/Datadog) for the first occurrence and stack trace.
5. Reproduce in staging. If you can't reproduce, add more logging and deploy.
6. Narrow down to the 10% — is it a specific browser? OS? Feature flag cohort? User attribute?

**Fix:**
7. Fix in a branch. Get a quick peer review (don't skip review under pressure — this is when new bugs are introduced).
8. Deploy to staging, verify, deploy to production.
9. Monitor error rates after the fix.

**Post-mortem:**
Write a blameless post-mortem. Not "who did this" but "what in our process allowed this to reach production." Add a test case that would have caught it.

---

### Q30. You've joined a new team and noticed the CI pipeline takes 40 minutes. How do you speed it up?

**Why they ask this:** Tests DevEx thinking — a trait of strong senior engineers.

**Answer:**

A 40-minute CI pipeline means 40 minutes of waiting per PR — it kills team velocity. This is absolutely worth fixing.

**Diagnosis first — where is the time going?**
- Is it **install time?** Restore `node_modules` from cache.
- Is it **build time?** Use incremental builds. In monorepos, only build/test affected packages (Nx and Turborepo do this).
- Is it **test time?** Run tests in parallel across multiple CI workers.
- Is it **E2E tests?** These are usually the culprit. Shard them across multiple machines.

**Common wins:**
1. **Dependency caching** — Cache `node_modules` by lockfile hash. Saves 3–5 min instantly.
2. **Test parallelization** — Jest's `--runInBand` flag disables parallelization. Remove it. Use `--maxWorkers` to tune.
3. **Affected-only testing** — In a monorepo, only run tests for packages that changed.
4. **Separate fast checks from slow ones** — Run linting and type-checking first (fast, fail early). Run E2E tests last or on merge only.
5. **Docker layer caching** — If using Docker, order Dockerfile commands so the most-changed layers come last.

**Target:** A CI pipeline that gives feedback in under 10 minutes is achievable for most frontend projects.

---

## Quick Reference Summary

| # | Scenario | Key Concept |
|---|---|---|
| 1 | App takes 8s to load | Lighthouse, bundle splitting, CDN |
| 2 | Janky scroll | DevTools perf profiling, virtualization |
| 3 | 100k row list | Virtual scrolling, react-window |
| 4 | LCP regression after deploy | Bundle diff, Lighthouse CI |
| 5 | Infinite scroll | IntersectionObserver, a11y fallback |
| 6 | Redux overuse | State colocation, React Query |
| 7 | Excessive re-renders | Context splitting, memo, profiler |
| 8 | Multi-step form | React Hook Form, Zustand persist |
| 9 | Micro-frontends | Module Federation, Single-SPA |
| 10 | SSR vs CSR vs SSG | Rendering tradeoffs, RSC |
| 11 | Autocomplete design | Debounce, AbortController, ARIA |
| 12 | Real-time dashboard | SSE vs WebSockets, update batching |
| 13 | API retry logic | Exponential backoff, jitter |
| 14 | Cancel API on unmount | AbortController, cleanup |
| 15 | Debounce vs throttle | Event handling patterns |
| 16 | Shared API calls | React Query deduplication |
| 17 | Keyboard-inaccessible modal | Focus trap, ARIA, return focus |
| 18 | 200-item animation | GPU layers, FLIP, prefers-reduced-motion |
| 19 | Accessible form | Labels, ARIA, axe-core |
| 20 | XSS protection | DOMPurify, CSP, HttpOnly |
| 21 | Auth token storage | HttpOnly cookies vs localStorage |
| 22 | Prod-only bug | Source maps, Sentry, env diff |
| 23 | Testing strategy | RTL, integration > unit |
| 24 | Memory leak | Heap snapshot, useEffect cleanup |
| 25 | Legacy codebase | Strangler fig, characterization tests |
| 26 | Infeasible design | Tiered alternatives, prototype first |
| 27 | Design system from scratch | Tokens, Storybook, governance |
| 28 | Technical debt | Debt register, 20% budget |
| 29 | Production incident | Rollback, post-mortem, comms |
| 30 | Slow CI pipeline | Caching, parallelization, sharding |

---

## Tips for Answering in Interviews

- **Think out loud** — Interviewers want to see your reasoning, not just the answer.
- **Ask clarifying questions first** — "Is this a public-facing app? How many users? What's the performance budget?"
- **State trade-offs** — Every technical decision has trade-offs. Naming them signals seniority.
- **Mention what you'd measure** — Decisions should be driven by data, not gut feel.
- **Relate to real experience** — "At my previous company, we solved this by..." always scores points.

---
# Q31. A user's session should expire after 15 minutes of inactivity, but your JWT has a 24-hour expiry. How do you handle this?
Why they ask this: Tests understanding that token expiry and session inactivity are two different problems — most devs confuse them.
Answer:
JWT expiry is a server-side time bomb — it expires at a fixed time regardless of user activity. Inactivity timeout is a client-side behavioral concern. They need to be solved separately.
Client-side inactivity tracking:
Listen to user activity events — mousemove, keydown, click, scroll. Every time one fires, reset a timer. If the timer hits 15 minutes with no activity, log the user out proactively — clear the in-memory access token and redirect to login.
jslet inactivityTimer;

function resetTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(logout, 15 * 60 * 1000);
}

['mousemove', 'keydown', 'click', 'scroll'].forEach(event =>
  window.addEventListener(event, resetTimer)
);
Important nuance: Throttle the event listeners heavily — you don't want mousemove resetting the timer 60 times per second. Throttle to once every 30 seconds.
Server-side complement: Even with client-side logout, the refresh token in the HttpOnly cookie should also be invalidated server-side on logout. Otherwise the user could manually call the refresh endpoint and get a new access token after the inactivity logout. Always call a /logout API that invalidates the refresh token in the database.
Multi-tab handling: If the user has the app open in 3 tabs, inactivity in one tab shouldn't log them out if they're active in another. Use BroadcastChannel API or localStorage events to sync activity signals across tabs.

# Q32. Walk me through the complete, production-grade flow for storing and refreshing auth tokens securely. Where exactly does each token live and why?
Why they ask this: This is the most comprehensive auth question — it separates developers who've thought through the full picture from those who've only copied a tutorial.
Answer:
The two-token pattern — Access Token + Refresh Token:
Access Token:

Short-lived (10–15 minutes).
Contains user identity and permissions (claims).
Stored in memory only — a JavaScript variable or closure. Never localStorage, never sessionStorage.
Sent as Authorization: Bearer <token> header on every API request.
Lost on page refresh — by design.

Refresh Token:

Long-lived (7–30 days).
Stored in an HttpOnly, Secure, SameSite=Strict cookie.
Never accessible to JavaScript — even if you have an XSS vulnerability, the attacker cannot read this cookie.
Only sent to the /refresh endpoint, not every API call.

The silent refresh flow (what happens on page load/token expiry):

User loads the app. Access token is gone (it was in memory).
App immediately calls /auth/refresh — the browser automatically sends the HttpOnly refresh cookie.
Server validates the refresh token, returns a new access token in the response body.
App stores the new access token in memory.
App proceeds to load the user's data.

js// On app boot
async function initAuth() {
  try {
    const res = await fetch('/auth/refresh', { credentials: 'include' });
    const { accessToken } = await res.json();
    setAccessToken(accessToken); // store in memory/closure
  } catch {
    redirectToLogin();
  }
}
Handling token expiry mid-session (Axios interceptor pattern):
jsaxios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const { accessToken } = await refreshToken();
      setAccessToken(accessToken);
      error.config.headers['Authorization'] = `Bearer ${accessToken}`;
      return axios(error.config); // retry the original request
    }
    return Promise.reject(error);
  }
);
Refresh token rotation (critical security practice):
Every time the refresh token is used, the server should issue a brand new refresh token and invalidate the old one. This means if an attacker steals a refresh token and tries to use it after you've already used it, the server detects reuse and can invalidate the entire session family.
Logout:

Clear the in-memory access token.
Call POST /auth/logout — server clears the refresh token cookie (Set-Cookie: refreshToken=; Max-Age=0) and invalidates it in the database.
Redirect to login.

Cookie flags — all three are non-negotiable:

HttpOnly — no JS access.
Secure — HTTPS only.
SameSite=Strict — prevents the cookie from being sent on cross-site requests, blocking CSRF attacks.

Why not localStorage?
Simple — any XSS vulnerability on your domain can steal everything in localStorage. HttpOnly cookies cannot be accessed by JS at all, so even a successful XSS attack can't steal the refresh token.
Senior signal: Mention that SameSite=Strict can break OAuth flows where the redirect comes from a third-party identity provider — in that case SameSite=Lax is the pragmatic compromise. And that CSRF tokens are still recommended on state-changing endpoints as an additional layer even with SameSite cookies.