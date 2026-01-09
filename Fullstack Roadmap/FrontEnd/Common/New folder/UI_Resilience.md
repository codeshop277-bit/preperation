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

# Error Logs - Sentry, datadog, new relic, bug snag
User action →
  Error occurs →
    SDK captures error →
      Context attached →
        Event sent to Sentry →
          Stored + grouped →
            Alert triggered →
              Developer fixes

export async function getOrders() {
  try {
    const res = await fetch('https://api.example.com/orders');
    if (!res.ok) throw new Error('Orders API failed');
    return res.json();
  } catch (error) {
    Sentry.captureException(error);
    throw error; // Let error.tsx handle UI
  }
}

ou can configure alerts like:
Error rate spike
New error in production
Error affecting > X users

Alert → Slack → Developer → Fix → Deploy

What Sentry stores for this project
All error events
Stack traces
Breadcrumbs
User context
Release versions
Environment separation (prod / staging)

# Breadcrumbs
What are breadcrumbs? Breadcrumbs = “Where am I?”
Breadcrumbs are a secondary navigation aid that show users:
Where they are in a site’s hierarchy
How they got there
How to go back to higher-level pages

✅ Recommendation (practical)
If you are:
Frontend / React / Next.js heavy → Sentry
Enterprise / microservices → Datadog
Mobile or release-driven → Bugsnag
UX debugging pain → LogRocket (add-on)

| Tool        | Best for              | Replace Sentry?   |
| ----------- | --------------------- | ----------------- |
| Sentry      | Error-first debugging | ✅                 |
| Datadog     | Full observability    | ⚠️ (bigger scope) |
| New Relic   | Performance-first     | ⚠️                |
| Bugsnag     | Release stability     | ✅                 |
| Rollbar     | Simple tracking       | ✅                 |
| LogRocket   | UX/session replay     | ❌ (complement)    |
| Elastic APM | Self-hosted           | ⚠️                |
