# API Router vs Page Router


# Server Compoenents
    Cannot use browser API's (window, document)
    React hooks or handlers

    With "use-client" declartion we are saying this file should run on browser not on server.
    declaration must be at the top of the line bcoz A client component cannot import Server component but the vice versa can happen
## Page Router:
    Its a file system based routing. Each file inside pages/ folder is considered to be a route
    For dynamic routes, slug will be used pages/blog/[slug].js → /blog/:slug

    Advantages: 
    Simple routing without manual config, 
    Built in SSR and SSG, 
    API routes in same framework
    Data fetching uses getServerSideProps, getStaticProps, or getInitialProps.

## APP Router:
All files inside app/ will be configured with app router.
Advantages:
    Better data fetching, No more special functions like getServerSideProps. You can fetch data directly in server components using async/await, making code more intuitive and reducing boilerplate.
    Improved performance- Server components rendered on the server and minimal js is sent to client
    Better layout composition - Nested folder don't render when navigating between pages unlike page router where layout amounts on every navigation
    - Progressive rendering with React Suspense boundaries, allowing parts of the page to load incrementally.

# Key Architectural Differences
Pages Router:
Everything is a Client Component by default
Data fetching happens at page boundaries
Layouts fully remount on navigation

App Router:
Server Components by default (less JavaScript shipped)
Data fetching can happen at any component level
Layouts persist across navigation
Supports streaming and progressive enhancement


| Feature                         | Pages Router                          | App Router                             |
| ------------------------------- | ------------------------------------- | -------------------------------------- |
| **Colocation**                  | ❌ Components must be outside `pages/` | ✅ Components can live alongside routes |
| **Suspense for code splitting** | ✅ Works with `dynamic()`              | ✅ Works natively                       |
| **Suspense for data fetching**  | ❌ Not supported                       | ✅ Fully supported                      |
| **Streaming SSR**               | ❌ Not supported                       | ✅ Built-in                             |
| **Async components**            | ❌ Not supported                       | ✅ Server Components can be async       |


# Suspense
It is the react's way of handling async operations like data fetching, allowing parts of UI to load progressively.
Benefits:
✅ Progressive rendering - Fast content shows first, slow content loads in
✅ Streaming SSR - Server can send HTML in chunks as data becomes ready
✅ Better UX - User sees partial content instead of blank page
✅ Parallel loading - Multiple Suspense boundaries load simultaneously
✅ Simpler code - No manual loading state management.
// app/profile/page.js

import { Suspense } from 'react';

async function UserInfo() {
  // This component can be async!
  const user = await fetch('/api/user').then(r => r.json());
  return <div>{user.name}</div>;
}

async function UserPosts() {
  // Slow data fetch
  const posts = await fetch('/api/posts').then(r => r.json());
  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}

export default function ProfilePage() {
  return (
    <div>
      {/* Show Spinner while UserInfo loads */}
      <Suspense fallback={<Spinner />}>
        <UserInfo />
      </Suspense>
      
      {/* Show different fallback while UserPosts loads */}
      <Suspense fallback={<div>Loading posts...</div>}>
        <UserPosts />
      </Suspense>
      
      {/* This content shows immediately */}
      <footer>© 2026 My App</footer>
    </div>
  );
}
