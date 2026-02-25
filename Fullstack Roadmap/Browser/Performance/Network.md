
# Network
# HTTP Waterfall
An HTTP waterfall is the visual sequence of network requests shown in browser DevTools (Network tab).
It represents:
DNS lookup
TCP/TLS handshake
Request queueing
Time to first byte (TTFB)
Download time
Execution blocking
Requests appear like a waterfall because each dependency delays the next.
Typical bad waterfall:
HTML
  ↓
CSS (blocking)
  ↓
JS bundle (blocking)
  ↓
API call
  ↓
Images
Why it happens
1. Resource dependency chains
JS waits for CSS → API waits for JS → UI waits for API.
2. Render-blocking assets
Large CSS
Synchronous JS
3. Too many small requests (HTTP/1.1 issue)
4. Late discovery

Browser only discovers resources after parsing HTML.
Impact
Slow Largest Contentful Paint (LCP)
Delayed interactivity
Janky loading experience

How to prevent (Senior practices)
✔️ Break dependency chains

Load critical resources first.
✔️ Inline critical CSS
<style>
/* above-the-fold styles */
</style>
✔️ Async / defer JS
<script src="app.js" defer></script>

defer → waits for HTML parse
async → executes immediately (can reorder)

✔️ Parallelize API calls
❌ Sequential:
await fetchUser();
await fetchPosts();

✔️ Parallel:
await Promise.all([fetchUser(), fetchPosts()]);
✔️ Code splitting (React)
const Dashboard = React.lazy(() => import("./Dashboard"));
Your goal is NOT fewer requests anymore —
Your goal is earlier critical bytes.

1️⃣ How to Read the Waterfall Column
Each horizontal bar represents one network request over time.
Left → Right = time progression.
The bar is split into colored segments. Each segment represents a specific phase of the request lifecycle.
If you click a request → Timing tab, you’ll see the exact breakdown.

2️⃣ What Each Colored Block Represents
In Chrome DevTools, the phases are typically:
🟡 Queueing / Stalled
Waiting for an available connection
Browser connection limit reached
Waiting for higher-priority requests
🟢 DNS Lookup
Resolving domain name → IP address

🟠 Initial Connection
TCP handshake

🟣 SSL
TLS negotiation

🔵 Request Sent
Browser sends HTTP request

🟤 Waiting (TTFB)
Time To First Byte
Server processing time
Backend latency lives here

🔷 Content Download
Response body being downloaded

3️⃣ What the Blue Blocks Mean in Your Screenshot
In your screenshot, most bars are solid blue.

That means:
The request skipped DNS/TCP/SSL and is mostly just download or cached retrieval.

For JavaScript files especially:
Blue = content download

If very short blue bar = fast response (likely cache)
To verify exactly:
Click a request → Timing → see phase labels.

4️⃣ What the Red Vertical Line Means
The thin red vertical line in the waterfall is:
🔴 Page Load Event

Chrome shows two important markers:
🟢 Blue vertical line → DOMContentLoaded
🔴 Red vertical line → Load event

From your summary bar:
DOMContentLoaded: 2.62 s
Load: 3.07 s
That red line corresponds to ~3.07s.
Everything after that is happening after the page officially finished loading.

5️⃣ How I Know Some Requests Are Cached
Because in your screenshot I can see in the Size column:
(disk cache)
(memory cache)

When Chrome serves a file from cache:
Status often still shows 200
Size column shows (disk cache) or (memory cache)
Waterfall is extremely short (almost instant)
Memory cache
Stored in RAM
Fastest
Cleared when tab closes
Disk cache
Stored on disk
Slightly slower
Survives reloads

If a request is cached:
No DNS
No TCP
No SSL
No server TTFB
No real network download

6️⃣ How to Be Certain About Cache

Click a request → Headers tab:
Look for:

from disk cache
from memory cache

Or check:

Response Headers → cache-control
7️⃣ How to Diagnose Performance From Waterfall
Now that you know what the phases mean:

Long brown section?
→ Backend slow (high TTFB)

Long blue section?
→ Large file download

Long yellow (queueing)?
→ Too many parallel requests

Many JS chunks loading before red line?
→ Heavy bundle, possible code splitting issue

8️⃣ Pro Tip for Clear Analysis

To see true network behavior:
Check Disable cache
Enable throttling (e.g., Fast 3G)
Hard reload (Ctrl+Shift+R)
Now the waterfall will show real network timings.

# Compression (Brotli vs Gzip)
What it is
Compression reduces transfer size over network.
Server compresses → Browser decompresses automatically.
Why it exists
Network transfer is expensive compared to CPU decompression.
Example:
| File      | Original | Gzip  | Brotli |
| --------- | -------- | ----- | ------ |
| JS Bundle | 500KB    | 180KB | 140KB  |

gzip vs Brotli
| Feature           | gzip            | Brotli           |
| ----------------- | --------------- | ---------------- |
| Compression ratio | Good            | Better (~15–25%) |
| CPU cost          | Low             | Higher           |
| Best for          | Dynamic content | Static assets    |
Best practice (Senior)

✔️ Brotli for static builds
✔️ gzip fallback

# HTTP/2 & HTTP/3
What it is
Protocol evolution:
HTTP/1.1 → HTTP/2 → HTTP/3
Why HTTP/1.1 caused issues
Connection limits (~6 per domain)
Head-of-line blocking
Request queueing

HTTP/2 improvements
Multiplexing
Multiple requests over ONE connection.
[CSS]
[JS]
[IMG]
[API]
   ↓
Same TCP connection
Header compression (HPACK)

HTTP/3 (QUIC)
Uses UDP instead of TCP.

Benefits:
Faster connection setup
Better packet loss recovery
Mobile network friendly
Senior insight

With HTTP/2+:
❌ Sprite sheets less needed
❌ Domain sharding obsolete

How to adopt
Usually automatic via CDN:
Cloudflare
AWS CloudFront
Fastly

# Lazy Loading
What it is
Load resources ONLY when needed.
Why needed
Initial page contains too many assets.
Native image lazy loading

<img src="img.jpg" loading="lazy">
React lazy loading
const Settings = React.lazy(() => import("./Settings"));
Route-based lazy loading
const Dashboard = React.lazy(() => import("./Dashboard"));
<Route
  path="/dashboard"
  element={
    <Suspense fallback={<Loader />}>
      <Dashboard />
    </Suspense>
  }
/>

Advanced (IntersectionObserver)
const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadComponent();
  }
});

observer.observe(element);

When NOT to lazy load
❌ Above-the-fold images
❌ Hero content
❌ Critical JS

Without lazy loading:
Initial bundle
 ├── Home
 ├── Dashboard
 ├── Settings
 └── Everything loaded at startup ❌

With lazy loading:
Initial bundle
 ├── Home
Dashboard bundle → downloaded ONLY when route opens ✔
User opens app
Dashboard JS is NOT downloaded yet
User navigates to /dashboard
Dynamic import starts
<Suspense> shows <Loader />
Component loads → render

# What IntersectionObserver does
It watches:
Is this element visible on screen?
When user scrolls and element enters viewport:
isIntersecting = true
Then:
loadComponent();

# Prefetch vs Preload
This is senior-level frequently misunderstood.
Preload (HIGH priority)
Use when resource is needed VERY soon.

<link rel="preload" href="main.css" as="style">

Browser behavior:
Immediate download
High priority
Blocks less later

Use for:
Critical fonts
Hero image
Main CSS

Prefetch (LOW priority)
Future navigation guess.
<link rel="prefetch" href="/dashboard.js">

Browser:
Downloads during idle time
Cached for future
Use for:
Next page route
Likely user action
React example (route prefetch)
router.prefetch("/dashboard");
Senior rule
Preload → THIS navigation
Prefetch → NEXT navigation
Common mistakes
❌ Preloading everything → bandwidth starvation
❌ Prefetch on slow network

# CDN - Content Delivery Network
CDN Strategies
What it is
CDN = geographically distributed cache servers.
Example:
User (India) → Mumbai Edge → origin server
Why needed
Reduced latency
Better cache hit ratio
DDoS protection
HTTP/3 support

Senior CDN strategies
1️⃣ Cache static aggressively
Cache-Control: public, max-age=31536000, immutable
Use hashed filenames:
app.9a8f3.js

2️⃣ Separate static vs dynamic
cdn.example.com → static
api.example.com → dynamic

3️⃣ Edge caching APIs (careful)
Cache-Control: s-maxage=60
Good for:
Product catalog
Config data

4️⃣ Use stale-while-revalidate
Cache-Control: max-age=60, stale-while-revalidate=300

5️⃣ Image optimization at edge
CDN transforms:
/image.jpg?width=400

# Resource Prioritization
Resource prioritization is how the browser decides which network requests get bandwidth first.
The browser does NOT download everything equally — it assigns priorities like:
Highest   → HTML, critical CSS
High      → fonts, blocking JS
Medium    → images in viewport
Low       → prefetch, async scripts
Lowest    → lazy content

The scheduler decides:
What starts first
What gets bandwidth
What gets delayed

How prioritization works internally
Discovery timing
Earlier discovered → higher chance to load early.
Example:
<link rel="stylesheet" href="main.css">

vs
import("./styles.css")
Second is discovered late → lower priority.

3️⃣ Render dependency
If rendering depends on it → priority increases.

Controlling priority (Modern APIs)
✔️ fetchpriority (VERY IMPORTANT)
<img src="hero.jpg" fetchpriority="high">

Or lower priority:

<img src="below-fold.jpg" fetchpriority="low">
✔️ Preload changes priority
<link rel="preload" href="hero.jpg" as="image">

Tells browser:
“This is important — start now.”

✔️ Async vs defer
<script defer src="app.js"></script>
<script async src="analytics.js"></script>

defer → ordered, higher relevance
async → lower scheduling certainty

# Critical CSS
Critical CSS = minimum CSS required to render above-the-fold content immediately.
Everything else can load later.

CSS is render blocking.
Browser cannot paint until CSSOM is ready:
HTML → CSS → Render Tree → Paint
Large CSS file = delayed first paint.

main.css = 300KB
↓
Browser waits
↓
White screen

Solution (Critical CSS pattern)
Step 1 — Inline critical CSS
Step 2 — Load remaining CSS async
<link 
  rel="preload" 
  href="main.css" 
  as="style"
  onload="this.rel='stylesheet'"
>

# Early Hints
Early Hints (HTTP 103)
HTTP 103 Early Hints allows the server to tell the browser:
“Start downloading these resources BEFORE the final response arrives.”

Traditional flow (without 103)
Request HTML
   ↓
Wait for server response
   ↓
Parse HTML
   ↓
Discover CSS/JS
   ↓
Start downloading
Lost time = network latency.

With Early Hints
Request HTML
   ↓
Server sends 103 response
   ↓
<link rel="preload"...>
   ↓
Browser starts downloads EARLY
   ↓
Final HTML arrives

Server sends:
HTTP/1.1 103 Early Hints
Link: </main.css>; rel=preload; as=style
Link: </app.js>; rel=preload; as=script

Browser starts downloading immediately.
Why it exists
Backend rendering can take time:
SSR frameworks
Database calls
API aggregation

Early hints hide that latency.

“How do you improve LCP?”
1. Send early hints for CSS + hero image
2. Inline critical CSS
3. Use fetchpriority=high for LCP image
4. Reduce waterfall dependency chain

Early Hints (HTTP 103) is NOT configured inside React — it’s configured at the server / CDN layer that serves your React app.

React controls what assets exist
Server/CDN controls how early they are announced
Browser requests /
      ↓
Server starts rendering (SSR or static)
      ↓
Before HTML is ready
      ↓
Server sends 103 Early Hints
      ↓
Browser downloads CSS + Hero image
      ↓
Final HTML arrives

If you serve React via Express:

app.get("/", (req, res) => {
  // Send Early Hints FIRST
  res.writeEarlyHints({
    link: [
      '</static/main.css>; rel=preload; as=style',
      '</hero.webp>; rel=preload; as=image'
    ]
  });

  // Then send final HTML
  res.send(renderReactApp());
});