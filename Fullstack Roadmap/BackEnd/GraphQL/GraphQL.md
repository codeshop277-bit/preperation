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
