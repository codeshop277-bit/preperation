# NextJS Error flow
Request →
  Fetch Data →
    ❌ Error thrown → error.tsx
    ❌ notFound() → not-found.tsx
    ✅ Success → page.tsx

One-line summary
    error.tsx handles crashes (500)
not-found.tsx handles absence (404)

error.tsx is Next.js’ built-in Error Boundary for the App Router.
It catches runtime errors that occur during:
API failure
Database connection error
Undefined/null access
Failed server action
Throwing custom errors

# error.tsx applies to the route segment it lives in and all its children.
# error.tsx must be a Client Component:
Because:
It uses React state
It can reset/retry rendering

What does reset() do?
Re-renders the route segment
Retries data fetching
Clears the error state

| Case                             | Caught? |
| -------------------------------- | ------- |
| `notFound()`                     | ❌ No    |
| `redirect()`                     | ❌ No    |
| Build-time errors                | ❌ No    |
| Syntax errors                    | ❌ No    |
| Errors outside its route segment | ❌ No    |

# What is not-found.tsx?
not-found.tsx defines what UI to show when a route is not found.
It handles:
Invalid dynamic routes

import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return <Post post={post} />;
}

# Loading states
Skeletons,Spinners, Placeholders
A loading state is the UI shown while data or code is being fetched.

# Suspense Boundaries
Suspense is a boundary that pauses rendering until async work is ready, while showing a fallback UI.
“Render everything you can, don’t block the rest.”
Page starts rendering
 ├─ Header renders immediately
 ├─ Sidebar renders immediately
 ├─ Main content → suspended
     └─ Show fallback
Since it is wrapped inside a specific part inside a route, other contents will render

# Gracefule degradation
Graceful degradation means:
The app still works even when features fail

Examples of degradation
API is slow → show cached data
JS fails → server-rendered HTML still works
Image fails → text fallback
Client JS disabled → SSR content still readable

| Scenario        | What kicks in |
| --------------- | ------------- |
| Data slow       | loading.tsx   |
| Component async | Suspense      |
| Runtime crash   | error.tsx     |
| Missing data    | not-found.tsx |
| JS fails        | SSR HTML      |
