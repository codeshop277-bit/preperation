
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