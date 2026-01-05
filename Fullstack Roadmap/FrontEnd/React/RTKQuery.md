# RTK Query – Caching, Invalidation & Deduplication (Complete Guide)

This README explains **RTK Query** in depth with **real code examples** covering:

* Caching behavior
* Cache lifetime
* Cache invalidation
* Request deduplication
* Automatic refetching
* Manual refetching
* Advanced patterns

This guide is written for **production usage and interviews**.

---

## 1. What is RTK Query?

RTK Query is a **data fetching and caching layer** built into Redux Toolkit.

It provides:

* Client-side cache
* Request deduplication
* Tag-based invalidation
* Auto refetching
* Minimal boilerplate

Think of it as:

```
Redux + Fetch + Cache + Invalidation
```

---

## 2. Basic Setup

### API Slice

```ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({})
});
```

---

## 3. Basic Caching (Query)

### Define Query

```ts
getUsers: builder.query<User[], void>({
  query: () => '/users'
})
```

### Use in Component

```tsx
const { data, isLoading } = useGetUsersQuery();
```

### What happens

```
First component mounts  → API call
Second component mounts → Cache hit
```

✅ Cached in Redux store

---

## 4. Cache Key & Arguments

RTK Query cache key = **endpoint name + arguments**

```ts
useGetUserQuery(1);
useGetUserQuery(2);
```

These are **different cache entries**.

---

## 5. Cache Lifetime (`keepUnusedDataFor`)

```ts
getUsers: builder.query({
  query: () => '/users',
  keepUnusedDataFor: 60
});
```

### Meaning

* Cache stays while at least one component uses it
* After last unmount → removed after 60s

---

## 6. Request Deduplication (Very Important)

### Scenario

```tsx
useGetUsersQuery(); // Component A
useGetUsersQuery(); // Component B
```

### Behavior

```
Only ONE network request
Both components share the result
```

🔥 This is automatic and built-in

---

## 7. Refetching on Mount / Arg Change

```ts
useGetUsersQuery(undefined, {
  refetchOnMountOrArgChange: true
});
```

### Behavior

* Refetches even if cache exists
* Useful for always-fresh views

---

## 8. Refetch on Focus / Reconnect

```ts
useGetUsersQuery(undefined, {
  refetchOnFocus: true,
  refetchOnReconnect: true
});
```

### Behavior

* Tab refocus → refetch
* Network reconnect → refetch

---

## 9. Tag-based Cache Invalidation (Core Feature)

### Provide Tags (READ)

```ts
getUsers: builder.query({
  query: () => '/users',
  providesTags: ['Users']
});
```

### Invalidate Tags (WRITE)

```ts
createUser: builder.mutation({
  query: (user) => ({
    url: '/users',
    method: 'POST',
    body: user
  }),
  invalidatesTags: ['Users']
});
```

### Result

```
Mutation succeeds
↓
Users cache invalidated
↓
getUsers auto-refetches
```

---

## 10. Granular Tagging (Best Practice)

```ts
getUsers: builder.query({
  query: () => '/users',
  providesTags: ['Users']
});

getUserById: builder.query({
  query: (id) => `/users/${id}`,
  providesTags: (result, error, id) => [{ type: 'User', id }]
});
```

```ts
deleteUser: builder.mutation({
  query: (id) => ({
    url: `/users/${id}`,
    method: 'DELETE'
  }),
  invalidatesTags: ['Users', { type: 'User', id }]
});
```

---

## 11. Manual Cache Invalidation

```ts
import { usersApi } from './usersApi';

dispatch(usersApi.util.invalidateTags(['Users']));
```

Useful for:

* External events
* WebSockets
* Custom logic

---

## 12. Manual Refetch

```ts
const { refetch } = useGetUsersQuery();

<button onClick={refetch}>Refresh</button>
```

---

## 13. Optimistic Updates

```ts
updateUser: builder.mutation({
  query: (user) => ({
    url: `/users/${user.id}`,
    method: 'PUT',
    body: user
  }),
  async onQueryStarted(user, { dispatch, queryFulfilled }) {
    const patch = dispatch(
      usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
        const u = draft.find(d => d.id === user.id);
        if (u) Object.assign(u, user);
      })
    );

    try {
      await queryFulfilled;
    } catch {
      patch.undo();
    }
  }
});
```

---

## 14. Error Handling

```ts
const { data, error, isError } = useGetUsersQuery();

if (isError) {
  return <div>Error loading users</div>;
}
```

---

## 15. Polling

```ts
useGetUsersQuery(undefined, {
  pollingInterval: 5000
});
```

---

## 16. Comparison with Other Systems

| Feature   | RTK Query | React Query | Next.js |
| --------- | --------- | ----------- | ------- |
| Cache     | Client    | Client      | Server  |
| Dedup     | Yes       | Yes         | Yes     |
| Tags      | Yes       | No          | Yes     |
| SSR Cache | No        | Partial     | Yes     |

---

## 17. Common Mistakes

❌ Forgetting `providesTags`
❌ Overusing polling
❌ Storing derived UI state in cache
❌ Using RTK Query for SEO data

---

## 18. Mental Model (Remember This)

```
Query      → READ → providesTags
Mutation   → WRITE → invalidatesTags
Cache Key  → endpoint + args
```

---

## 19. Interview One-liner

> RTK Query provides built-in client-side caching, request deduplication, and tag-based cache invalidation by storing API responses in the Redux store and automatically refetching queries when related mutations occur.

---

## 20. TL;DR

* RTK Query = client cache
* Automatic deduplication
* Tag-based invalidation
* Minimal boilerplate
* Best for Redux-based apps

---

END 🚀
