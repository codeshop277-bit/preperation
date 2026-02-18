GraphQL is a schema-driven, client-controlled API layer that optimizes data fetching for modern frontend architectures while centralizing API contracts.

GraphQL Characteristics
Single endpoint
Schema-driven (Query, Mutation)
Client controls response shape
Strong typing & introspection
No versioning needed (additive evolution)

| Concern        | REST                | GraphQL       |
| -------------- | ------------------- | ------------- |
| Endpoints      | Many                | Single        |
| Over-fetching  | Common              | Eliminated    |
| Under-fetching | Common              | Eliminated    |
| Versioning     | Required            | Rarely needed |
| Flexibility    | Backend-driven      | Client-driven |
| Caching        | Simple (HTTP cache) | Complex       |
| Learning Curve | Low                 | Medium        |

🧠 Why GraphQL Should Be Preferred (When Appropriate)
1️⃣ Frontend-Heavy Applications (React/Next.js, Mobile)
Since you work heavily in frontend architecture — GraphQL shines when:
Multiple UI screens need different shapes of same entity
You want to reduce network calls
UI evolves frequently

2️⃣ Microservice Aggregation
GraphQL acts as a BFF (Backend for Frontend) layer:
Aggregates data from multiple services
Shields frontend from backend changes

3️⃣ Performance Control at Client Layer
Frontend controls:
Fields
Nested depth
Shape of response
This improves:
Bandwidth efficiency
Render performance
Developer velocity

```js
// RESI API
// 🔹 CREATE USER
  const createUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Balaji",
          email: "balaji@test.com"
        })
      });
      const data = await res.json();
      alert("User created: " + data.id);
    } catch (err) {
      console.error("Error creating user", err);
    }
  };

  // 🔹 DELETE USER
  const deleteUser = async () => {
    try {
      await fetch(`${BASE_URL}/users/101`, {
        method: "DELETE"
      });
      setUser(null);
      alert("User deleted");
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

//GraphQL
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://testdomain.com/graphql"
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
      "x-tenant-id": "tenant-123"
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

import { ApolloProvider } from "@apollo/client";
import { client } from "./apolloClient";
import UserGraphQL from "./UserGraphQL";

function App() {
  return (
    <ApolloProvider client={client}>
      <UserGraphQL />
    </ApolloProvider>
  );
}

export default App;

import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_USER = gql`
  query GetUser {
    user(id: 101) {
      id
      name
      email
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser {
    createUser(input: {
      name: "Balaji"
      email: "balaji@test.com"
    }) {
      id
      name
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser(id: 101) {
      success
    }
  }
`;

export default function UserGraphQL() {
  const { data, loading, error, refetch } = useQuery(GET_USER);

  const [createUser] = useMutation(CREATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <div>
      <h2>GraphQL User</h2>

      {data?.user && (
        <div>
          <p>Name: {data.user.name}</p>
          <p>Email: {data.user.email}</p>
        </div>
      )}

      <button
        onClick={async () => {
          await createUser();
          refetch();
        }}
      >
        Create User
      </button>

      <button
        onClick={async () => {
          await deleteUser();
          refetch();
        }}
      >
        Delete User
      </button>
    </div>
  );
}
```
1️⃣ Query vs Mutation vs Subscription
🔹 Query
Used for read operations
Must be side-effect free
Equivalent to GET in REST
query {
  user(id: 1) {
    name
  }
}

🔹 Mutation
Used for write operations
Can modify server state
Equivalent to POST/PUT/DELETE
mutation {
  createUser(name: "Balaji") {
    id
  }
}

🔹 Subscription
Used for real-time updates
Typically WebSocket-based
Push model instead of request-response
subscription {
  userCreated {
    id
    name
  }
}
Query = read
Mutation = write
Subscription = real-time push

2️⃣ Schema
The contract of your API.
Strongly typed
Defines available queries, mutations, types
Single source of truth
Self-documenting

Example:
type Query {
  user(id: ID!): User
}
type Mutation {
  createUser(name: String!): User
}
Schema defines what is possible.
Clients cannot request fields not defined here.

3️⃣ Type System
GraphQL is strongly typed.
Core types:
String
Int
Float
Boolean
ID
Custom types:
```js
type User {
  id: ID!
  name: String!
  email: String
}
```
Key concepts:
! → Non-nullable
[User] → List
[User!]! → Non-null list of non-null users
Strong typing prevents runtime contract mismatches.

4️⃣ Resolvers
Resolvers are functions that return data for fields.
Schema:
type Query {
  user(id: ID!): User
}

Resolver:
const resolvers = {
  Query: {
    user: (_, args, context) => {
      return db.getUser(args.id);
    }
  }
};

Each field can have a resolver.
Schema defines structure.
Resolvers define execution logic.

5️⃣ Arguments
Arguments allow dynamic data fetching.
Schema:
type Query {
  user(id: ID!): User
}

Query:
query {
  user(id: 101) {
    name
  }
}

Arguments are:
Strongly typed
Validated against schema

6️⃣ Variables
Avoid hardcoding values inside query string.
Better practice:
query GetUser($id: ID!) {
  user(id: $id) {
    name
  }
}

Variables payload:
{
  "id": 101
}

Why use variables?
Cleaner queries
Better caching
Prevents query recompilation
More secure than string interpolation

7️⃣ Fragments
Fragments allow reusable field selections.
fragment UserFields on User {
  id
  name
  email
}
query {
  user(id: 1) {
    ...UserFields
  }
}
Benefits:
Avoid repetition
Shared UI data contracts
Better maintainability
In large frontend apps, fragments often mirror UI components.

| Concept      | Purpose                 |
| ------------ | ----------------------- |
| Query        | Read data               |
| Mutation     | Modify data             |
| Subscription | Real-time updates       |
| Schema       | API contract            |
| Type System  | Strong validation layer |
| Resolvers    | Execution logic         |
| Arguments    | Dynamic inputs          |
| Variables    | Runtime-safe parameters |
| Fragments    | Reusable field sets     |

2️⃣ Overfetching / Underfetching
🔹 Overfetching
Client receives more data than needed.
REST example:
GET /users/101

Returns:
{
  "id": 101,
  "name": "Balaji",
  "email": "...",
  "address": "...",
  "createdAt": "..."
}

If UI only needs name, bandwidth is wasted.
🔹 Underfetching
Client does not receive enough data and must make multiple calls.

Example:
GET /users/101
GET /users/101/posts
GET /posts/1/comments

Multiple round trips → latency increases.
🔹 GraphQL Fix
Client specifies exactly what it needs:
query {
  user(id: 101) {
    name
    posts {
      title
    }
  }
}

✔ No overfetching
✔ No underfetching
✔ One round-trip

3️⃣ N+1 Problem
This is a backend execution issue, not a query issue.
Example query:

query {
  users {
    id
    posts {
      title
    }
  }
}

Naive resolver implementation:
1 query → get all users
Then for each user → query posts
If 100 users:
1 query for users
100 queries for posts
Total = 101 DB queries
This is the N+1 problem.

🔹 Why It Happens
Each field resolver executes independently.
GraphQL resolver model is:
Field-level execution, not query-level optimization.

🔹 Solution
Use batching tools like:
DataLoader (Facebook pattern)
Query-level joins
ORM eager loading
With batching:
1 query for users
1 query for posts
Total = 2 queries

4️⃣ Versioning vs Schema Evolution
🔵 REST Versioning
Typical pattern:
/api/v1/users
/api/v2/users

Why?
Response shape changes break clients
Removing fields causes breaking changes

Problems:
Duplicate endpoints
Maintenance overhead
Client migration complexity

🟣 GraphQL Schema Evolution
GraphQL prefers additive changes.
Rules:
Never remove fields immediately
Mark fields as deprecated
Add new fields safely

Example:
type User {
  id: ID!
  name: String!
  fullName: String @deprecated(reason: "Use name instead")
}
Clients choose what fields to request.
No forced versioning.

1️⃣ When NOT to Use GraphQL
GraphQL is powerful — but not universal.
❌ 1. Simple CRUD APIs
REST is simpler and operationally cheaper.
GraphQL introduces unnecessary schema + resolver complexity.

❌ 2. Heavy CDN Caching Requirements
REST:
GET /products/101
→ Cacheable at CDN (URL-based)
GraphQL:
POST /graphql
→ Harder to cache at CDN level
→ Requires persisted queries or custom caching layer

If edge caching is critical → REST wins.

❌ 3. Strict Backend-Controlled APIs
If backend must:
Control response shape strictly
Limit data exposure tightly
GraphQL’s client-driven nature may be risky.

❌ 4. Low Team Maturity
GraphQL requires:
Schema governance
Query complexity limits
N+1 prevention strategy
Observability tooling
Without discipline → performance & security risks.

❌ 5. Very High-Throughput Systems
If your API:
Serves millions of identical simple requests
Needs maximum HTTP caching efficiency
REST with CDN is often more performant operationally.

🎯 Senior Rule

Use GraphQL when UI complexity is high.
Avoid it when system complexity is low.

2️⃣ GraphQL in Microservices

GraphQL works best as a BFF (Backend For Frontend) or API Gateway layer.
Typical Microservice Architecture
Frontend
    ↓
GraphQL Gateway
    ↓
User Service
Order Service
Payment Service
Inventory Service
GraphQL:
Aggregates multiple services
Shields frontend from service fragmentation
Reduces multiple network calls
Example

Frontend wants:
query {
  user(id: 1) {
    name
    orders {
      total
      paymentStatus
    }
  }
}

GraphQL Gateway:
Calls User Service
Calls Order Service
Calls Payment Service
Merges response
Frontend sees a unified contract.
Why It Works Well

✔ Reduces frontend orchestration
✔ Prevents service coupling to UI
✔ Centralized schema contract
✔ Enables team autonomy per domain

Risks in Microservices
N+1 across services
Increased latency aggregation
Gateway becoming bottleneck
Requires batching & caching strategies
Senior Pattern
Large orgs often use:
GraphQL Gateway layer
Domain-owned subgraphs
GraphQL becomes the experience layer, not the data layer.

| Scenario                  | Prefer       |
| ------------------------- | ------------ |
| Large enterprise          | Schema-first |
| Strong governance needed  | Schema-first |
| Startup / rapid iteration | Code-first   |
| Heavy TypeScript usage    | Code-first   |

# N+1 using data loader
```js
const DataLoader = require("dataloader");

// Batch function
const postLoader = new DataLoader(async (userIds) => {
  const posts = await db.getPostsByUserIds(userIds);
  
  return userIds.map(id =>
    posts.filter(post => post.userId === id)
  );
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    postLoader
  })
});
// Updated Resolver
User: {
  posts: (user, _, context) => {
    return context.postLoader.load(user.id);
  }
}
```
✅ Now What Happens?
If 100 users:
1 query → users
1 query → posts (batched with WHERE userId IN (...))
Total = 2 queries
🔥 Massive performance improvement.

# Batching
Combine multiple resolver calls into one DB query.
Example batched DB query:
```js
db.getPostsByUserIds = async (userIds) => {
  return db.query(
    `SELECT * FROM posts WHERE user_id IN (?)`,
    [userIds]
  );
};
```
SQL becomes
SELECT * FROM posts WHERE user_id IN (1,2,3)

#  Caching Strategies
GraphQL caching has multiple layers.
1️⃣ Request-Level Caching (DataLoader Default)
DataLoader caches within a single request.
If same user requested twice:
{
  user(id: 1) { name }
  anotherUser: user(id: 1) { email }
}
DB hit happens once.

2️⃣ Resolver-Level Caching
You can manually cache expensive calls.
Example with Redis:
```js
const resolvers = {
  Query: {
    user: async (_, { id }) => {
      const cached = await redis.get(`user:${id}`);
      if (cached) return JSON.parse(cached);

      const user = await db.getUser(id);
      await redis.set(`user:${id}`, JSON.stringify(user), "EX", 60);

      return user;
    }
  }
};
```
3️⃣ Apollo Response Caching
Apollo provides cache control:
const resolvers = {
  Query: {
    users: async (_, __, { cacheControl }) => {
      cacheControl.setCacheHint({ maxAge: 60 });
      return db.getAllUsers();
    }
  }
};
This enables HTTP-level caching strategies.

4️⃣ Client-Side Caching (Apollo Client)
Apollo Client automatically caches query results:
const { data } = useQuery(GET_USERS);
If query is repeated → no network call.
Cache key is based on:
Query shape
Variables
Object IDs

# Security
1️⃣ Depth Limiting
✅ What It Is
Limits how deeply nested a GraphQL query can go.
Example of a dangerous query:

query {
  users {
    posts {
      comments {
        author {
          posts {
            comments {
              ...
            }
          }
        }
      }
    }
  }
}

This can:
Blow up DB calls
Consume huge CPU
Crash your server

❓ Why It Matters
GraphQL allows recursive relationships.
Without depth limits:
Attackers can craft deeply nested queries
Your API can get DOS’ed
🛠 How to Implement (Apollo Example)
Use graphql-depth-limit:
import depthLimit from 'graphql-depth-limit';
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5)]
});
This caps nesting at depth 5.
🎯 Interview Insight
They want to see if you understand:
GraphQL gives flexibility — but flexibility must be controlled.

#  Query Complexity Analysis
✅ What It Is
Limits total “cost” of a query.
Instead of just depth, it calculates:
Number of fields requested
Estimated execution cost
Example:

query {
  users(limit: 10000) {
    posts {
      comments {
        id
      }
    }
  }
}

Even if depth is small, cost is massive.
❓ Why It Matters
Depth ≠ complexity.
You need to protect against:
Large list queries
Expensive aggregations
Massive nested requests
🛠 How to Implement
Use graphql-query-complexity:
import { createComplexityRule } from 'graphql-query-complexity';
validationRules: [
  createComplexityRule({
    maximumComplexity: 1000
  })
]
You can assign cost per field.
Total cost is calculated before execution.
If cost > threshold → reject query.

# 3️⃣ Rate Limiting
✅ What It Is
Limits how many requests a user can make in a time window.
Example:
100 requests per minute per user/IP
❓ Why It Matters
GraphQL:
Has single endpoint
Allows complex queries
Easier to abuse than REST
Without rate limiting:
Brute force attacks
Token abuse
API scraping
🛠 How to Implement
Using Express:

import rateLimit from 'express-rate-limit';
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
Or Redis-based rate limiting for distributed systems.

# 4️⃣ Auth in Resolvers
✅ What It Is
Authorization checks inside GraphQL resolvers.
GraphQL does NOT have built-in auth.

Example:
const resolvers = {
  Query: {
    users: (parent, args, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      return getUsers();
    }
  }
};
❓ Why It Matters
Even if route is protected:
Clients can query any allowed field
You must check permissions per resolver
Example:
User should see only their posts
Admin can see all users
🛠 Best Practice
Use:
Context-based auth
Role-based checks (RBAC)
Field-level authorization
Better pattern:
if (!context.user || context.user.role !== "ADMIN") {
  throw new ForbiddenError("Access denied");
}

# Error Handling
1️⃣ Error Handling in GraphQL
Unlike REST:
REST → HTTP status codes define failure.
GraphQL → Always returns 200 OK (in most cases).
Errors are part of the response body.
Why?
Because GraphQL can return partial success.
Example Query
query {
  user(id: 1) {
    name
    posts {
      title
    }
  }
}

If user loads but posts fails → GraphQL still returns what it can.
2️⃣ GraphQL Error Format
Standard GraphQL response:
```js
{
  "data": {
    "user": {
      "name": "Balaji",
      "posts": null
    }
  },
  "errors": [
    {
      "message": "Failed to fetch posts",
      "path": ["user", "posts"],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR"
      }
    }
  ]
}
```
| Field        | Meaning                            |
| ------------ | ---------------------------------- |
| `message`    | Error description                  |
| `path`       | Field that failed                  |
| `extensions` | Custom metadata (error code, etc.) |

3️⃣ Partial Responses
This is one of GraphQL’s biggest differences from REST.
REST:
If one part fails → entire request fails.
GraphQL:
If one field fails → other fields can still succeed.
query {
  user(id: 1) {
    name
    salary   # restricted field
  }
}
If user has no permission for salary:
Response:

{
  "data": {
    "user": {
      "name": "Balaji",
      "salary": null
    }
  },
  "errors": [...]
}
✔ Frontend still receives usable data
✔ Fine-grained field-level errors
🎯 Senior Insight
Partial responses:
Improve resilience
Reduce UI breakage
Enable field-level authorization
But:
Require frontend error-awareness

# Optimistic updates
Optimistic Updates
🔎 What is it?
Optimistic update means:
Update the UI immediately before the server responds.
Used for:
Like buttons
Add comment
Delete item
Example Without Optimistic Update
User clicks "Like"
→ Wait for server
→ UI updates after response
Feels slow.
Example With Optimistic Update (Apollo)
const [likePost] = useMutation(LIKE_POST, {
  optimisticResponse: {
    likePost: {
      id: post.id,
      likes: post.likes + 1,
      __typename: "Post"
    }
  }
});
What happens:
UI updates instantly
Apollo stores optimistic value
Server response arrives
Cache reconciles
If Server Fails?
Apollo automatically rolls back the optimistic change.
Senior Insight
Optimistic updates:
Improve perceived performance
Require deterministic mutations
Should not be used for complex transactional logic

#  Cache Normalization
🔎 What is it?
Cache normalization means:
Store API response as individual entities keyed by unique ID instead of storing full nested objects.
✅ With Normalization (Apollo Behavior)
Apollo stores like this internally: Instead of nested query
User:10 → { id: 10, name: "Balaji" }
Post:1  → { id: 1, title: "Post 1", author: "User:10" }
One source of truth
Updating User:10 updates everywhere automatically

# Refetch vs Cache Update
After a mutation, you have two options.
Option A: Refetch Queries
useMutation(DELETE_USER, {
  refetchQueries: ["GetUsers"]
});
What happens:
Mutation completes
Apollo re-runs query
UI updates with fresh server data
Pros
✔ Simple
✔ Safe
✔ No manual cache logic
Cons
❌ Extra network request
❌ Slower
❌ Wasteful at scale
Option B: Manual Cache Update
useMutation(DELETE_USER, {
  update(cache, { data }) {
    cache.modify({
      fields: {
        users(existingUsers = [], { readField }) {
          return existingUsers.filter(
            user => readField("id", user) !== data.deleteUser.id
          );
        }
      }
    });
  }
});
What happens:
Remove deleted user from cache directly
No refetch
Instant UI update
Pros
✔ No extra request
✔ Faster
✔ More scalable
Cons
❌ More complex
❌ Risk of inconsistent cache if done wrong

#  errorPolicy: "all"
Both data and errors available
You can:
Render partial data
Show warning banner

# npm install @graphql-codegen/cli
GraphQL Code Generator auto-generates types from schema + queries.