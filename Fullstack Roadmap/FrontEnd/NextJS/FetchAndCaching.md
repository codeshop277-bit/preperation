# Fetch in next js

Fetch in next js is an extension of browser's fetch but it adds and supports few additional features like
   Request Caching,
   revalidation,
   Tag based cache invalidation,
   automatic deduplication

```js
// app/posts/page.tsx (Server Component by default)
const res = await fetch('https://api.example.com/posts');
const posts = await res.json();

export default function PostsPage() {
  return <Posts posts={posts} />;
}
```
The above runs in server, result is cached, removed from Js bundle, HTML is sent to browser not JSON.

| Feature          | Next.js Fetch | Axios |
| ---------------- | ------------- | ----- |
| Built-in caching | ✅             | ❌     |
| Tree-shaken      | ✅             | ❌     |
| Streaming        | ✅             | ❌     |
| Server dedupe    | ✅             | ❌     |
| Edge compatible  | ✅             | ⚠️    |

# Caching
fetch(url); //Cached forever, Ideal for blogs
fetch(url, { next: { revalidate: 60 } }); //Cache refreshes every 60 seconds
fetch(url, { cache: 'no-store' });// Always refresh, runs on every request
const users = await fetch('https://api.example.com/users', {
  next: { tags: ['users'] }
}).then
How tags work:
User list is fetched and cached. Cahe is labelled as "users"
When a new user is added or a user is deleted we can revalidate this cache
import {revalidateTag} from 'next/cache';
revalidateTag('users');
This will revalidate cached users and in the next visit refteches fresh users

Caching avoids:
Re-running database queries
Re-fetching APIs
Re-rendering React trees on the server

Next.js caches three things:
Fetch response (data cache)
Rendered React Server Component tree
Final HTML output

When user navigates from client side to homepage
Browser → Next.js router
           ↓
     Reuses cached RSC payload
           ↓
     NO full page reload

    Instant navigation
✅ No server re-render
✅ No API call

Browser refres or new tab
Server behavior:
Next.js checks cache
Cache still valid (within revalidate window)
HTML served directly from cache

If cache expires,
the next api request would get old HTML data and Nextjs refetches in background and cache is updated

# RSC Payload(React Server Components)
RSC payload is a serialized description of server component tree and its data sent from server to browser.
What it contains:
    Server component output
    Props passes to Client components
    References to client component
    Data fetched on server
CLient navigation
❌ No full page reload
✅ Browser requests RSC payload only
✅ React swaps UI

# Static Rendering
Html is generated in build time and served from cache/CDN 
Build time
   ↓
HTML generated
   ↓
Stored in cache / CDN
   ↓
Browser gets ready-made HTML

# Dynamic Rendering
Html is generated on every request using request time data
Browser request
   ↓
Server executes code
   ↓
Fresh HTML generated
   ↓
Response sent
Anything that depends on cookies, header, user auth forces dunamic rendering

# ROute Handlers
ROute handlers are server only functions in nextjs that lets you hadnle HTTP method using web fetch API. It return response does not rerender UI
All routes.ts are declared inside app/ folder

in page.tsx landing/page.tsx
```js
const users = await fetch('http://localhost:3000/api/users', {
     next: { tags: ['users'] } }).then(res => res.json());
```
in routes.ts app/landing/routes.ts
```js
export async function GET()
 { const users = await getUsersFromDB();
  return NextResponse.json(users); 
  }
```
Steps:
     Browser lands on page.tsx
     Page.tsx is a server comp and executed 
    await fetch('http://localhost:3000/api/users') -- At this exact moment render pauses
    Nextjs makes an internal HTTP request to routes which matches the url
    Then executes the routes.ts call and returns the response to server which then generates the HTML and caches it 

For multiple get calls
```js
/api/users?type=active
/api/users?role=admin

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const role = searchParams.get('role');
  const type = searchParams.get('type');

  if (role === 'admin') {
    return Response.json(await getAdmins());
  }

  if (type === 'active') {
    return Response.json(await getActiveUsers());
  }

  return Response.json(await getAllUsers());
}

```

# Server Actions
It allows react client compoenents to directly invoke  server logic without defining endpoints and still securely running on server.
It needs to be triggered manually. like formsubmit, button click. It can be used only when we own the db layer as well.

```js
// app/actions/createUser.ts
'use server';

export async function createUser(formData: FormData) {
  const name = formData.get('name');
  await saveUserToDB(name);
}
```
Client → request → Next.js Server → Executes server action → Returns result

| Server Actions    | Route Handlers (`route.ts`) |
| ----------------- | --------------------------- |
| Function-based    | HTTP-based                  |
| No public URL     | Public API endpoint         |
| Called from React | Called via fetch            |
| Ideal for forms   | Ideal for APIs              |
| Tight UI coupling | Loose coupling              |
| No CORS           | CORS applies                |

# Cache Invalidation 
Cache invalidation strategies define when cached data becomes stale. In Next.js, this can be handled using time-based revalidation, event-based invalidation with tags, path-based invalidation, or disabling cache entirely, depending on consistency and performance needs.
It is when cached data is no longer correct and must be refreshed
1, WHat is cached?
2, When is it no longer valid?

In netxjs 
| Strategy    | Next.js mechanism        |
| ----------- | ------------------------ |
| Time-based  | `revalidate`             |
| Event-based | `tags` + `revalidateTag` |
| Path-based  | `revalidatePath`         |
| No cache    | `cache: 'no-store'`      |
| SWR         | Built-in ISR             |

Revalidate path: 
revalidatePath('/users');

# React does not have in built caching features like above. So it relies on npm like Redux toolkit query

# Waterfall
A water fall happens when each requests run sequentially where each requests wait for the previous request to finish before starting

To avoid if requests are not dependant on each other, run in parallel sing, Promise.all([])
Fetch data in oarent and pass as props to child

Where it is unavoidable use Suspense so slow section loads without blocking everything
and caching wherever dependencies exist