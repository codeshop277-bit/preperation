# Folder structure in nextjs

app/- all files inside app folder is considered to be a route.
only page.tsx creates a route

layout.tsx --> wraps all child routes
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <header>Navbar</header>
        {children}
        <footer>Footer</footer>
      </body>
    </html>
  );
}
//Does not re render on navigation

page.tsx → What to render

loading.tsx → What to show while page.tsx is loading

error.tsx → What to show if page.tsx throws an error
Helper files for page.tsx
loading.tsx and error.tsx are automatically picked up by Next.js based on the folder structure.
You never import or reference them inside page.tsx.

Ex error
// app/products/error.tsx
"use client";

# Error.ts is a React Error boundary and error boundary works only on client since it relies on ability to catch render/lifecycle errors 

<ErrorBoundary fallback={<Error />}>
  <Route />
</ErrorBoundary>


export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>

      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}

Ex loading
// app/products/loading.tsx
export default function Loading() {
  return (
    <div>
      <h2>Loading products...</h2>
      <p>Please wait</p>
    </div>
  );
}


# Nested Folder
In next js every folder can have its own layout.tsx
app/
 ├─ layout.tsx           ← Root layout
 ├─ page.tsx             ← /
 └─ dashboard/
     ├─ layout.tsx       ← Dashboard layout
     ├─ page.tsx         ← /dashboard
     └─ settings/
         ├─ layout.tsx   ← Settings layout
         └─ page.tsx     ← /dashboard/settings


/dashboard  → /dashboard/settings
| Component       | Re-render? |
| --------------- | ---------- |
| RootLayout      | ❌ No       |
| DashboardLayout | ❌ No       |
| SettingsLayout  | ✅ Yes      |
| SettingsPage    | ✅ Yes      |
Only the layout at or below changed segment re renders

| Trigger                      | Re-render Layout? |
| ---------------------------- | ----------------- |
| Route change (same segment)  | ❌                 |
| Route change (below segment) | ❌                 |
| Client state update          | ✅                 |
| Props change                 | ✅                 |
| Context change               | ✅                 |
| Hard refresh                 | ✅                 |

Child state change will not rerender parent layout
A layout wraps its route segment and stays mounted across navigation.
Layouts only re-render on client-side state or prop changes.
Child state changes never cause parent layouts to re-render.
Server layouts never re-render on client interactions.

State Change Re-render Rules (Golden Rules)
Rule #1 State change re-renders the component that owns the state and its children
Rule #2 Parent does NOT re-render when child state changes
Rule #3 Layouts only re-render if they are client components

Server Components run on the server and send HTML.
Client Components run in the browser and handle interactivity.

eX sERVER comp
// app/products/page.tsx
export default async function ProductsPage() {
  const res = await fetch("https://api.example.com/products"); //Use await fo api calls in server and useEffect in client
  const products = await res.json();

  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}

| Trigger           | Server | Client |
| ----------------- | ------ | ------ |
| `useState` update | ❌      | ✅      |
| Route navigation  | ✅      | ✅      |
| Page refresh      | ✅      | ✅      |
| Parent re-render  | ❌      | ✅      |
